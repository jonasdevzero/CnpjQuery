export interface FilesFinder {
  find(dir: string, match: string | RegExp): string[];
}
