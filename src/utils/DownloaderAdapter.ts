import Http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import {
  Downloader,
  DownloaderCallback,
} from '../presentation/protocols/downloader';

const destDir = path.join(process.cwd(), 'temp');

export class DownloaderAdapter implements Downloader {
  async download(
    url: string,
    callback: DownloaderCallback = () => {},
  ): Promise<void> {
    const isValidUrl = /http[s]?:\/\/.+\.(zip)/g.test(url);

    if (!isValidUrl) {
      throw new InvalidParamError('url');
    }

    const [urlProtocol] = /(http[s]?)/g.exec(url);

    const http: typeof Http = await import(`node:${urlProtocol}`);

    const request = http.request(url);

    request.on('response', (response) => {
      const splittedUrl = url.split('/');
      const lastUrlPath = splittedUrl[splittedUrl.length - 1];
      const destFilePath = path.join(destDir, lastUrlPath);

      const file = fs.createWriteStream(destFilePath);

      response.pipe(file);

      response.on('error', (error: Error) => {
        file.close();
        callback(error, null);
      });

      response.on('end', () => callback(null, destFilePath));

      file.on('finish', () => file.close());

      file.on('error', (error) => {
        file.close();
        callback(error, null);
      });
    });

    request.on('error', (error) => callback(error, null));

    request.on('finish', () => {});

    request.end();
  }
}
