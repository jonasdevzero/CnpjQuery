import { CnpjValidatorRegexAdapter } from './CnpjValidatorRegexAdapter';

describe('CnpjValidatorRegexAdapter', () => {
  test('Should return false if an invalid cnpj was provided', async () => {
    const sut = new CnpjValidatorRegexAdapter();

    const isValid = sut.isValid('invalid_cnpj');

    expect(isValid).toBe(false);
  });
});
