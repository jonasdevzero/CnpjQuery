import { container } from '@container';
import { CnpjValidator } from '@domain/utils';
import { CnpjValidatorRegexAdapter } from './CnpjValidatorRegexAdapter';

container.register<CnpjValidator>('CnpjValidator', CnpjValidatorRegexAdapter);
