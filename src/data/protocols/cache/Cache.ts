export interface Cache {
  get(key: string): Promise<string | null>;

  set(key: string, data: string | number | Buffer): Promise<void>;

  exists(key: string): Promise<boolean>;
}
