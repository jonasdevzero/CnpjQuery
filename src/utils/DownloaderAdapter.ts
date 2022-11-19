import http from 'node:http';
import { Downloader } from '../presentation/protocols/downloader';

export class DownloaderAdapter implements Downloader {
  async download(url: string): Promise<string> {
    http.request(url);

    return null;
  }
}
