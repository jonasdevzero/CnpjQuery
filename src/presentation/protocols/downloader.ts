export interface Downloader {
  download(url: string): Promise<void>;
}
