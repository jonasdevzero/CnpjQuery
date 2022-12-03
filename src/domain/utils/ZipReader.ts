export type DownloaderCallback = (error: Error, result: string) => void;

export interface ZipReaderStream {
  on(event: 'data', listener: (data: string) => void): void;
  on(event: 'error', listener: (error: Error) => void): void;
  on(event: 'end', listener: () => void): void;
}

export interface ZipReader {
  read(url: string): Promise<ZipReaderStream>;
}
