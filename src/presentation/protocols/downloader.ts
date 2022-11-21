export type DownloaderCallback = (error: Error, result: string) => void;

export interface DownloaderStream {
  on(event: 'data', listener: (data: string) => void): void;
  on(event: 'error', listener: (error: Error) => void): void;
  on(event: 'finish', listener: () => void): void;
}

export interface Downloader {
  download(url: string): Promise<DownloaderStream>;
}
