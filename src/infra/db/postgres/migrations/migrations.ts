/* eslint-disable no-await-in-loop */
import { join } from 'node:path';
import { FilesFinderAdapter } from '../../../../utils/FilesFinderAdapter';
import sql from '../db';

const validArguments = ['--up', '--down'];
const argument = process.argv[2];

if (!validArguments.includes(argument)) {
  throw new Error(`Invalid argument "${argument}", correct: --up OR --down`);
}

const command = argument.split('--')[1] as 'up' | 'down';

const rootPath = process.cwd();
const migrationsDirectory = join(rootPath, 'src', 'infra', 'db', 'postgres', 'migrations');
const filesFinderAdapter = new FilesFinderAdapter();

const migrations = filesFinderAdapter
  .find('src/infra/db/postgres/migrations', /([0-9]+).+(\.ts)$/g)
  .sort((a, b) => {
    const aParsed = Number(a.split(`${migrationsDirectory}\\`)[1].split('_')[0]);
    const bParsed = Number(b.split(`${migrationsDirectory}\\`)[1].split('_')[0]);

    return aParsed > bParsed ? 1 : -1;
  });

async function runMigrations() {
  for (const migrationPath of migrations) {
    const PgMigration = (await import(migrationPath)).default;
    await new PgMigration()[command](sql);
  }

  process.exit(0);
}

runMigrations();
