import type { Sql } from 'postgres';

export interface Migration {
  up(sql: Sql): Promise<void>;
  down(sql: Sql): Promise<void>;
}
