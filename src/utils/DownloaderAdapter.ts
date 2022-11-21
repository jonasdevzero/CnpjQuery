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
  async download(url: string, callback?: DownloaderCallback): Promise<void> {
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

      response.on('error', (error: Error) => {
        file.close();

        if (typeof callback === 'function') {
          callback(error, null);
        }
      });

      response.on('end', () => {
        if (typeof callback === 'function') {
          callback(null, destFilePath);
        }
      });

      file.on('finish', () => {
        file.close();
      });

      file.on('error', (error) => {
        file.close();

        if (typeof callback === 'function') {
          callback(error, null);
        }
      });
    });

    request.on('error', (error) => {
      if (typeof callback === 'function') {
        callback(error, null);
      }
    });

    request.on('finish', () => {});

    request.end();
  }
}
