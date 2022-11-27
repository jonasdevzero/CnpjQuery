import postgres from 'postgres';

const defaultConnection = 'postgresql://postgres:postgres@localhost:5432/pg-query-cnpj';

const sql = postgres(defaultConnection);

export default sql;
