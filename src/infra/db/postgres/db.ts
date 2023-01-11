import postgres from 'postgres';
import 'dotenv/config';

const connection =
  process.env.DB_CNPJ_URL || 'postgresql://postgres:postgres@localhost:5432/query-cnpj';

const sql = postgres(connection, { transform: { undefined: null } });

export default sql;
