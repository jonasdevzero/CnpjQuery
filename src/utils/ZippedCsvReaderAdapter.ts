import Http from 'node:http';
import Event from 'events';
import unzipper from 'unzipper';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import { ZippedCsvReader, ZippedCsvReaderEvent } from '../domain/utils';

export class ZippedCsvReaderAdapter implements ZippedCsvReader {
  private readonly lineBreak = '\n';

  async read(url: string): Promise<ZippedCsvReaderEvent> {
    const urlProtocol = this.validateUrlAndReturnProtocol(url);
    const http: typeof Http = await import(`node:${urlProtocol}`);

    const request = http.request(url);
    const event = new Event();

    request.on('response', (response) => this.handleResponse(response, event));
    request.on('error', (error) => this.handleError(error, event));
    request.on('finish', () => {
      process.removeListener('uncaughtException', (error) => this.handleError(error, event));
    });

    process.on('uncaughtException', (error) => this.handleError(error, event));

    request.end();

    return event;
  }

  private validateUrlAndReturnProtocol(url: string) {
    const isValidUrl = /http[s]?:\/\/.+\.(zip)/g.test(url);

    if (!isValidUrl) {
      throw new InvalidParamError('url');
    }

    const [urlProtocol] = /(http[s]?)/g.exec(url) as RegExpExecArray;

    return urlProtocol;
  }

  private handleResponse(response: Http.IncomingMessage, event: Event) {
    const interval = setInterval(() => {
      response.isPaused() ? response.resume() : response.pause();
    }, 1000);

    response.pipe(unzipper.Parse()).on('entry', (entry: unzipper.Entry) => {
      this.handleUnzipperEntry(entry, event);
    });

    response.on('error', (error) => this.handleError(error, event));

    response.on('end', () => {
      event.emit('end');
      clearInterval(interval);
    });
  }

  private handleUnzipperEntry(entry: unzipper.Entry, event: Event) {
    let pendingData = '';

    entry.on('data', (chunk) => {
      pendingData += chunk;

      let rowIndex = pendingData.indexOf(this.lineBreak);

      while (rowIndex !== -1) {
        const row = pendingData.slice(0, rowIndex);
        event.emit('data', row);

        pendingData = pendingData.slice(rowIndex + 1);
        rowIndex = pendingData.indexOf(this.lineBreak);
      }
    });
  }

  private handleError(error: Error, event: Event) {
    event.emit('error', error);
  }
}
