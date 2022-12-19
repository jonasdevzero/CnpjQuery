import Http from 'node:http';
import Event from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import unzipper from 'unzipper';
import stream from 'node:stream';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import { CnpjDataReader, CnpjDataReaderEvent } from '../domain/utils/CnpjDataReader';

export class CnpjDataReaderAdapter implements CnpjDataReader {
  private readonly EOL = '\n';
  private readonly FILE_ENCODING = 'latin1';
  private readonly TEMP_FOLDER = path.join(process.cwd(), 'temp');
  readonly MIN_ROWS_LENGTH = 15000;

  async read(url: string): Promise<CnpjDataReaderEvent> {
    const module = await this.getUrlProtocolModule(url);
    return this.execute(url, module);
  }

  private async getUrlProtocolModule(url: string): Promise<typeof Http> {
    const match = /(http[s]?):\/\/.+\.zip/g.exec(url);
    if (!match) throw new InvalidParamError('url');

    const protocol = match[1];
    return import(`node:${protocol}`);
  }

  private execute(url: string, module: typeof Http) {
    const event = new Event();
    const request = this.makeRequest(event, url, module);

    request();
    event.on('retry', request.bind(this));

    return event;
  }

  private makeRequest(event: Event, url: string, module: typeof Http) {
    return () => {
      const request = module.request(url);
      this.clearInternalListeners(event);
      this.handleRequest(request, event);
    };
  }

  private clearInternalListeners(event: Event) {
    event.removeAllListeners('rows:send');
    event.removeAllListeners('rows:next');
  }

  private handleRequest(request: Http.ClientRequest, event: Event) {
    request.on('response', this.makeResponseHandler(event));
    request.on('error', this.makeErrorHandler(event));
    request.end();
  }

  private makeErrorHandler(event: Event) {
    return (error: Error & { code?: string }) => {
      if (error.code === 'ECONNRESET') {
        event.emit('retry');
        return;
      }

      event.emit('error', error);
    };
  }

  private makeResponseHandler(event: Event) {
    const zippedFilePath = path.join(this.TEMP_FOLDER, `${Date.now()}.zip`);
    const errorHandler = this.makeErrorHandler(event);

    return (response: Http.IncomingMessage) => {
      response.on('error', errorHandler);
      response
        .pipe(fs.createWriteStream(zippedFilePath))
        .on('error', errorHandler)
        .on('finish', async () => {
          const filePath = await this.unzipAndDeleteFile(event, zippedFilePath);
          this.readFileAndDelete(event, filePath);
        });
    };
  }

  private async unzipAndDeleteFile(event: Event, zippedFilePath: string) {
    const filePath = zippedFilePath.replace('.zip', '.csv');

    return new Promise<string>((resolve) => {
      fs.createReadStream(zippedFilePath)
        .pipe(unzipper.Parse())
        .on('entry', (entry: unzipper.Entry) => {
          entry
            .pipe(this.makeCleanDataStream())
            .pipe(fs.createWriteStream(filePath))
            .on('error', this.makeErrorHandler(event))
            .on('finish', async () => {
              await this.deleteFile(zippedFilePath);
              resolve(filePath);
            });
        })
        .on('error', this.makeErrorHandler(event));
    });
  }

  private makeCleanDataStream(): stream.Transform {
    let pendingData = '';
    let rowEndIndex = -1;

    const transform = (chunk: Buffer, _: unknown, callback: stream.TransformCallback) => {
      const rows = [] as string[];
      pendingData += chunk.toString(this.FILE_ENCODING);
      rowEndIndex = pendingData.indexOf(this.EOL);

      while (rowEndIndex !== -1) {
        rows.push(pendingData.slice(0, rowEndIndex));

        pendingData = pendingData.slice(rowEndIndex + 1);
        rowEndIndex = pendingData.indexOf(this.EOL);
      }

      const parsedRows = rows
        .join(this.EOL)
        .replace(/";"/gm, '<->')
        .replace(/"|\x00/gm, '');

      const parsedChunk = Buffer.from(`${parsedRows}\n`, this.FILE_ENCODING);

      callback(null, parsedChunk);
    };

    return new stream.Transform({ transform: transform.bind(this) });
  }

  private async deleteFile(filePath: string) {
    return new Promise<void>((resolve, reject) => {
      fs.unlink(filePath, (error) => (error ? reject(error) : resolve()));
    });
  }

  private readFileAndDelete(event: Event, filePath: string) {
    const readStream = fs.createReadStream(filePath, { encoding: this.FILE_ENCODING });

    event.on('rows:next', () => readStream.resume());

    readStream.on('data', this.makeDataHandler(event, readStream));
    readStream.on('error', this.makeErrorHandler(event));
    readStream.on('end', async () => {
      await this.deleteFile(filePath);
      event.emit('rows:send');
      event.emit('end');
    });
  }

  private makeDataHandler(event: Event, readStream: fs.ReadStream) {
    let pendingData = '';
    let rows = [] as string[];
    let rowEndIndex = -1;

    event.on('rows:send', () => {
      readStream.pause();
      event.emit('rows', rows);
      rows = [];
    });

    return (chunk: string) => {
      pendingData += chunk;
      rowEndIndex = pendingData.indexOf(this.EOL);

      while (rowEndIndex !== -1) {
        const row = pendingData.slice(0, rowEndIndex);
        row ? rows.push(row) : null;

        pendingData = pendingData.slice(rowEndIndex + 1);
        rowEndIndex = pendingData.indexOf(this.EOL);
      }

      rows.length >= this.MIN_ROWS_LENGTH ? event.emit('rows:send') : null;
    };
  }
}
