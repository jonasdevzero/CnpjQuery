import { CnpjValidatorRegexAdapter } from './CnpjValidatorRegexAdapter';

describe('CnpjValidatorRegexAdapter', () => {
  test('Should return false if an invalid cnpj was provided', async () => {
    const sut = new CnpjValidatorRegexAdapter();

    const isValid = sut.isValid('invalid_cnpj');

    expect(isValid).toBe(false);
  });

  test('Should return true if a valid cnpj was provided', async () => {
    const sut = new CnpjValidatorRegexAdapter();

    const isValid = sut.isValid('00000000383260');

    expect(isValid).toBe(true);
  });
});
