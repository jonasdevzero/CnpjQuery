/* eslint-disable no-bitwise */
import signale from 'signale';
import ProgressBar from 'progress';
import { DataUrlType } from '@domain/models';
import { CnpjDataReaderEvent } from '@domain/utils';
import {
  UpsertCityPostgresRepository,
  UpsertCnaePostgresRepository,
  UpsertCompanyPostgresRepository,
  UpsertCountryPostgresRepository,
  ListDataUrlPostgresRepository,
  UpsertEstablishmentPostgresRepository,
  UpsertLegalNaturePostgresRepository,
  UpsertQualificationPostgresRepository,
  UpsertReasonPostgresRepository,
  UpsertSimplesPostgresRepository,
} from '@infra/db/postgres/repositories';
import { CnpjDataReaderAdapter, CnpjRawDataParserAdapter } from '@utils/index';

const listDataUrlRepository = new ListDataUrlPostgresRepository();
const cnpjDataReader = new CnpjDataReaderAdapter();
const cnpjRawDataParser = new CnpjRawDataParserAdapter();

const upsertCountryRepository = new UpsertCountryPostgresRepository();
const upsertCityRepository = new UpsertCityPostgresRepository();
const upsertCnaeRepository = new UpsertCnaePostgresRepository();
const upsertReasonRepository = new UpsertReasonPostgresRepository();
const upsertLegalNatureRepository = new UpsertLegalNaturePostgresRepository();
const upsertQualificationRepository = new UpsertQualificationPostgresRepository();
const upsertCompanyRepository = new UpsertCompanyPostgresRepository();
const upsertEstablishmentRepository = new UpsertEstablishmentPostgresRepository();
const upsertSimplesRepository = new UpsertSimplesPostgresRepository();
const upsertPartnerRepository = new UpsertSimplesPostgresRepository();

const upsertTypes = {
  COUNTRIES: upsertCountryRepository.upsert,
  CITIES: upsertCityRepository.upsert,
  CNAE: upsertCnaeRepository.upsert,
  REASONS: upsertReasonRepository.upsert,
  NATURES: upsertLegalNatureRepository.upsert,
  QUALIFICATIONS: upsertQualificationRepository.upsert,
  COMPANY: upsertCompanyRepository.upsert,
  ESTABLISHMENT: upsertEstablishmentRepository.upsert.bind(upsertEstablishmentRepository),
  SIMPLES: upsertSimplesRepository.upsert,
  PARTNER: upsertPartnerRepository.upsert.bind(upsertPartnerRepository),
} as { [key in DataUrlType]: (o: Object) => Promise<void> };

async function main() {
  const urls = await listDataUrlRepository.list();

  for (const { url, type } of urls) {
    process.stdout.write('\n');
    signale.info('Loading: ', url);

    await loadUrl(url, type);

    process.stdout.write('\n');
    signale.complete('Load end: ', url);
  }

  process.stdout.write('\n');
  signale.success('\nUpsert of all cnpj data');
}

async function loadUrl(url: string, type: DataUrlType) {
  const upsert = upsertTypes[type];

  const event = await cnpjDataReader.read(url);

  return new Promise<void>((resolve) => {
    loadDownloadProgress(event);
    loadUnzipProgress(event);
    loadReadProgress(event);

    event.on('rows', async (rows) => {
      const parsedRows = rows.map((r) => cnpjRawDataParser.parse(r, type));
      await Promise.all(parsedRows.map(upsert));

      event.emit('rows:next');
    });

    event.on('error', (error) => {
      signale.fatal(error);
      process.exit(0);
    });

    event.on('end', resolve);
  });
}

function loadDownloadProgress(event: CnpjDataReaderEvent) {
  let downloadProgress: ProgressBar;

  event.on('download:start', (length) => {
    downloadProgress = makeProgress('downloading', length);
  });

  event.on('download:chunk', (length) => downloadProgress.tick(length));
}

function loadUnzipProgress(event: CnpjDataReaderEvent) {
  let unzipProgress: ProgressBar;

  event.on('unzip:start', (length) => {
    unzipProgress = makeProgress('unzipping  ', length);
  });

  event.on('unzip:chunk', (length) => {
    unzipProgress.tick(length);
  });
}

function loadReadProgress(event: CnpjDataReaderEvent) {
  let readProgress: ProgressBar;

  event.on('read:start', (length) => {
    readProgress = makeProgress('reading    ', length);
  });

  event.on('read:chunk', (length) => readProgress.tick(length));
}

function makeProgress(label: string, total: number) {
  return new ProgressBar(`- ${label} [:bar] :rate/bps :percent :etas`, {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total,
  });
}

main().then(() => process.exit());
