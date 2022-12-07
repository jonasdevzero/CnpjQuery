import Http from 'node:http';
import Event from 'events';
import unzipper from 'unzipper';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import { ZippedCsvReader, ZippedCsvReaderEvent } from '../domain/utils';

export class ZippedCsvReaderAdapter implements ZippedCsvReader {
  private readonly EOL = '\n';

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
      this.handleRequest(request, event);
    };
  }

  private handleRequest(request: Http.ClientRequest, event: Event) {
    const errorHandler = this.makeErrorHandler(event);

    process.on('uncaughtException', errorHandler);

    request.on('response', this.makeResponseHandler(event));
    request.on('error', errorHandler);
    request.on('finish', () => process.removeListener('uncaughtException', errorHandler));

    request.end();
  }

  private makeErrorHandler(event: Event) {
    return (error: Error) => {
      if (error.message === 'ECONNRESET') {
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

    return (chunk: string) => {
      pendingData += chunk;
      const rows = [] as string[];

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
