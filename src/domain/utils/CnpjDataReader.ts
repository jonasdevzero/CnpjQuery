export interface CnpjDataReaderEvent {
  on(event: 'download:start', listener: (totalLength: number) => void): void;
  on(event: 'download:chunk', listener: (length: number) => void): void;

  on(event: 'unzip:start', listener: (length: number) => void): void;
  on(event: 'unzip:chunk', listener: (length: number) => void): void;

  on(event: 'read:start', listener: (length: number) => void): void;
  on(event: 'read:chunk', listener: (length: number) => void): void;

  on(event: 'rows', listener: (data: string[]) => void): void;
  on(event: 'error', listener: (error: Error) => void): void;
  on(event: 'end', listener: () => void): void;

  emit(event: 'rows:next'): void;
}

export interface CnpjDataReader {
  read(url: string): Promise<CnpjDataReaderEvent>;
}
