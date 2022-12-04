import Http from 'node:http';
import Event from 'events';
import unzipper from 'unzipper';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import { ZippedCsvReader, ZippedCsvReaderEvent } from '../domain/utils';

export class ZippedCsvReaderAdapter implements ZippedCsvReader {
  private readonly EOL = '\n';

  async read(url: string): Promise<ZippedCsvReaderEvent> {
    const urlProtocol = this.getUrlProtocol(url);
    return this.init(url, urlProtocol);
  }

  private getUrlProtocol(url: string): 'http' | 'https' {
    const match = /(http[s]?):\/\/.+\.zip/g.exec(url);
    if (!match) throw new InvalidParamError('url');

    return match[1] as 'http' | 'https';
  }

  private async init(url: string, protocol: 'http' | 'https') {
    const http: typeof Http = await import(`node:${protocol}`);
    const request = http.request(url);
    return this.handleRequest(request);
  }

  private handleRequest(request: Http.ClientRequest) {
    const event = new Event();
    const errorHandler = this.makeErrorHandler(event);

    process.on('uncaughtException', errorHandler);

    request.on('response', this.makeResponseHandler(event));
    request.on('error', errorHandler);
    request.on('finish', () => process.removeListener('uncaughtException', errorHandler));

    request.end();

    return event;
  }

  private makeErrorHandler(event: Event) {
    return (error: Error) => event.emit('error', error);
  }

  private makeResponseHandler(event: Event) {
    return (response: Http.IncomingMessage) => {
      const stream = response.pipe(unzipper.Parse());

      stream.on('entry', this.makeEntryHandler(event));
      response.on('error', this.makeErrorHandler(event));
      response.on('end', () => event.emit('end'));
    };
  }

  private makeEntryHandler(event: Event) {
    return (entry: unzipper.Entry) => {
      const interval = setInterval(this.makeEntryStatusToggler(entry), 1000);

      entry.on('data', this.makeEntryDataHandler(event));
      entry.on('end', () => clearInterval(interval));
    };
  }

  private makeEntryStatusToggler(entry: unzipper.Entry) {
    return () => (entry.isPaused() ? entry.resume() : entry.pause());
  }

  private makeEntryDataHandler(event: Event) {
    let pendingData = '';
    const rows = [] as string[];

    return (chunk: string) => {
      pendingData += chunk;

      let rowIndex = pendingData.indexOf(this.EOL);

      while (rowIndex !== -1) {
        const row = pendingData.slice(0, rowIndex);
        rows.push(row);

        pendingData = pendingData.slice(rowIndex + 1);
        rowIndex = pendingData.indexOf(this.EOL);
      }

      event.emit('rows', rows);
    };
  }
}
