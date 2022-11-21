import Http from 'node:http';
import Event from 'events';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import {
  Downloader,
  DownloaderStream,
} from '../presentation/protocols/downloader';

export class DownloaderAdapter implements Downloader {
  async download(url: string): Promise<DownloaderStream> {
    const isValidUrl = /http[s]?:\/\/.+\.(zip)/g.test(url);

    if (!isValidUrl) {
      throw new InvalidParamError('url');
    }

    const [urlProtocol] = /(http[s]?)/g.exec(url);

    const http: typeof Http = await import(`node:${urlProtocol}`);
    const event = new Event();

    const request = http.request(url);

    request.on('response', (response) => {});

    request.on('error', (error) => {});

    request.end();

    return event;
  }
}
