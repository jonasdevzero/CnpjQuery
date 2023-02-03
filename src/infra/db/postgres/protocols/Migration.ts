import { PgSql } from './PgSql';

export interface Migration {
  up(sql: PgSql): Promise<void>;
  down(sql: PgSql): Promise<void>;
}
