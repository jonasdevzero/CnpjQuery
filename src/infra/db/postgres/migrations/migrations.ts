/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import fs from 'node:fs';
import { join } from 'node:path';
import sql from '../db';

const validArguments = ['--up', '--down'];
const argument = process.argv[2];

if (!validArguments.includes(argument)) {
  throw new Error(`Invalid argument "${argument}", correct: --up OR --down`);
}

const command = argument.split('--')[1] as 'up' | 'down';
const rootPath = process.cwd();
const migrationsDirectory = join(rootPath, 'src', 'infra', 'db', 'postgres', 'migrations');

function getMigrations(dir: string): string[] {
  const files: string[] = [];

  fs.readdirSync(dir).forEach((file) => {
    if (/([0-9]+).+(\.ts)$/g.test(file)) files.push(join(dir, file));
  });

  return files;
}

const migrations = getMigrations(migrationsDirectory).sort((a, b) => {
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
