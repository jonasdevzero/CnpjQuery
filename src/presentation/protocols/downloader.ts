export type DownloaderCallback = (error: Error, result: string) => void;

export interface Downloader {
  download(url: string, callback?: DownloaderCallback): Promise<void>;
}
