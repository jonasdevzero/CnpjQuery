import http from 'node:http';
import { Downloader } from '../presentation/protocols/downloader';

export class DownloaderAdapter implements Downloader {
  async download(url: string): Promise<string> {
    const request = http.request(url);

    request.on('response', () => {});

    request.on('error', () => {});

    return null;
  }
}
