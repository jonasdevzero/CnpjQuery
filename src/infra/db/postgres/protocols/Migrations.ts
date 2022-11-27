import { PgSql } from '.';

export interface Migration {
  up(sql: PgSql): Promise<void>;
  down(sql: PgSql): Promise<void>;
}
