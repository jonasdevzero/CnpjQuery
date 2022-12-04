export interface ZippedCsvReaderEvent {
  on(event: 'rows', listener: (data: string[]) => void): void;
  on(event: 'error', listener: (error: Error) => void): void;
  on(event: 'end', listener: () => void): void;
}

export interface ZippedCsvReader {
  read(url: string): Promise<ZippedCsvReaderEvent>;
}
