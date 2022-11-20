import http from 'node:http';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import { Downloader } from '../presentation/protocols/downloader';

export class DownloaderAdapter implements Downloader {
  async download(url: string): Promise<string> {
    const isValidUrl = /http[s]?:\/\/.+\.(zip)/g.test(url);

    if (!isValidUrl) {
      throw new InvalidParamError('url');
    }

    const request = http.request(url);

    request.on('response', () => {});

    request.on('error', async (error) => {
      throw error;
    });

    request.on('finish', () => {});

    return null;
  }
}
