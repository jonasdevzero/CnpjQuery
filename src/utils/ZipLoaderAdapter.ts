import Http from 'node:http';
import Event from 'events';
import unzipper from 'unzipper';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import {
  ZipLoader,
  ZipLoaderStream,
} from '../presentation/protocols/ZipLoader';

export class ZipLoaderAdapter implements ZipLoader {
  private readonly event = new Event();
  private readonly lineBreak = '\n';
  private pendingData = '';

  async load(url: string): Promise<ZipLoaderStream> {
    const urlProtocol = this.validateUrlAndReturnProtocol(url);
    const http: typeof Http = await import(`node:${urlProtocol}`);

    const request = http.request(url);

    request.on('response', this.handleResponse.bind(this));
    request.on('error', this.handleError.bind(this));
    request.end();

    return this.event;
  }

  private validateUrlAndReturnProtocol(url: string) {
    const isValidUrl = /http[s]?:\/\/.+\.(zip)/g.test(url);

    if (!isValidUrl) {
      throw new InvalidParamError('url');
    }

    const [urlProtocol] = /(http[s]?)/g.exec(url);

    return urlProtocol;
  }

  private handleResponse(response: Http.IncomingMessage) {
    response
      .pipe(unzipper.Parse())
      .on('entry', this.handleUnzipperEntry.bind(this));
    response.on('error', this.handleError.bind(this));
    response.on('end', () => this.event.emit('end'));
  }

  private handleUnzipperEntry(entry: unzipper.Entry) {
    entry.on('data', this.handleUnzipperEntryData.bind(this));
  }

  private handleUnzipperEntryData(chunk: string) {
    this.pendingData += chunk;
    this.processData();
  }

  private processData() {
    let rowIndex = this.pendingData.indexOf(this.lineBreak);

    while (rowIndex !== -1) {
      const row = this.pendingData.slice(0, rowIndex);
      this.event.emit('data', row);

      this.pendingData = this.pendingData.slice(rowIndex + 1);
      rowIndex = this.pendingData.indexOf(this.lineBreak);
    }
  }

  private handleError(error: Error) {
    this.event.emit('error', error);
  }
}
