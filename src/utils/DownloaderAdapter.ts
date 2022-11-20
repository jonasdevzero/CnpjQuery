import Http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import { Downloader } from '../presentation/protocols/downloader';

const destDir = path.join(process.cwd(), 'temp');

export class DownloaderAdapter implements Downloader {
  async download(url: string): Promise<string> {
    const isValidUrl = /http[s]?:\/\/.+\.(zip)/g.test(url);

    if (!isValidUrl) {
      throw new InvalidParamError('url');
    }

    const [urlProtocol] = /(http[s]?)/g.exec(url);
    const urlPath = /http[s]?:\/\/(.+)/g.exec(url)[1];

    const http: typeof Http = await import(`node:${urlProtocol}`);

    const request = http.request(url);

    request.on('response', (response) => {
      const destFilePath = path.join(destDir, urlPath);
      const file = fs.createWriteStream(destFilePath);

      response.pipe(file);
    });

    request.on('error', async (error) => {
      throw error;
    });

    request.on('finish', () => {});

    return null;
  }
}
