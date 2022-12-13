import Http from 'node:http';
import Event from 'events';
import unzipper from 'unzipper';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import { ZippedCsvReader, ZippedCsvReaderEvent } from '../domain/utils';

export class ZippedCsvReaderAdapter implements ZippedCsvReader {
  private readonly EOL = '\n';
  readonly MIN_ROWS_LENGTH = 20000;

  async read(url: string): Promise<ZippedCsvReaderEvent> {
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
      this.clearInternalEvents(event);
      this.handleRequest(request, event);
    };
  }

  private clearInternalEvents(event: Event) {
    event.removeAllListeners('rows:send');
  }

  private handleRequest(request: Http.ClientRequest, event: Event) {
    const errorHandler = this.makeErrorHandler(event);

    request.on('response', this.makeResponseHandler(event));
    request.on('error', errorHandler);

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
    return (response: Http.IncomingMessage) => {
      const stream = response.pipe(unzipper.Parse());

      stream.on('entry', this.makeEntryHandler(event));
      response.on('error', this.makeErrorHandler(event));
    };
  }

  private makeEntryHandler(event: Event) {
    return (entry: unzipper.Entry) => {
      entry.on('data', this.makeEntryDataHandler(event));
      entry.on('end', () => event.emit('end'));
    };
  }

  private makeEntryDataHandler(event: Event) {
    let pendingData = '';
    let rows = [] as string[];
    let rowIndex = -1;

    event.on('rows:send', () => {
      event.emit('rows', rows);
      rows = [];
    });

    return (chunk: string) => {
      pendingData += chunk;
      rowIndex = pendingData.indexOf(this.EOL);

      while (rowIndex !== -1) {
        const row = pendingData.slice(0, rowIndex);
        rows.push(row);

        pendingData = pendingData.slice(rowIndex + 1);
        rowIndex = pendingData.indexOf(this.EOL);
      }

      rows.length >= this.MIN_ROWS_LENGTH ? event.emit('rows:send') : null;
    };
  }
}
