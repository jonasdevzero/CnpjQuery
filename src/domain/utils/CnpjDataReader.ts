export interface CnpjDataReaderEvent {
  on(event: 'rows', listener: (data: string[]) => void): void;
  on(event: 'error', listener: (error: Error) => void): void;
  on(event: 'end', listener: () => void): void;

  emit(event: 'rows:next'): void;
}

export interface CnpjDataReader {
  read(url: string): Promise<CnpjDataReaderEvent>;
}
