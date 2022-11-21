import Http from 'node:http';
import Event from 'events';
import unzipper from 'unzipper';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import {
  ZipLoader,
  ZipLoaderStream,
} from '../presentation/protocols/zipLoader';

export class ZipLoaderAdapter implements ZipLoader {
  async load(url: string): Promise<ZipLoaderStream> {
    const isValidUrl = /http[s]?:\/\/.+\.(zip)/g.test(url);

    if (!isValidUrl) {
      throw new InvalidParamError('url');
    }

    const [urlProtocol] = /(http[s]?)/g.exec(url);

    const http: typeof Http = await import(`node:${urlProtocol}`);
    const event = new Event();

    const request = http.request(url);

    request.on('response', (response) => {
      response.pipe(unzipper.Parse());

      response.on('entry', (entry: unzipper.Entry) => {
        entry.on('data', () => {});
      });

      response.on('error', () => {});

      response.on('end', () => {});
    });

    request.on('error', (error) => {});

    request.end();

    return event;
  }
}
