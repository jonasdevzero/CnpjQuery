import fs from 'node:fs';
import { FilesFinderAdapter } from './FilesFinderAdapter';

jest.mock('node:fs', () => ({
  readdirSync: jest.fn(() => []),
}));

const makeSut = (): FilesFinderAdapter => {
  return new FilesFinderAdapter();
};

describe('FilesFinderAdapter Util', () => {
  test('Should call fs.readdirSync with correct value', () => {
    const sut = makeSut();

    const readdirSpy = jest.spyOn(fs, 'readdirSync');

    sut.find('any_dir', 'any_match');

    const readdirPath = readdirSpy.mock.calls[0][0].toString();

    expect(readdirSpy).toHaveBeenCalledTimes(1);
    expect(readdirPath.endsWith('any_dir'));
  });

  test('Should with string matcher return files on success', () => {
    const sut = makeSut();

    jest.spyOn(fs, 'readdirSync').mockImplementationOnce(() => {
      const mockedFiles = ['any_file.routes.ts', 'any_file.ts', 'any_folder'];
      return mockedFiles as any;
    });

    const files = sut.find('any_dir', '*.routes.ts');

    expect(files.length).toBe(1);
    expect(files[0].endsWith('any_dir\\any_file.routes.ts')).toBeTruthy();
  });

  test('Should with RegExp matcher return files on success', () => {
    const sut = makeSut();

    jest.spyOn(fs, 'readdirSync').mockImplementationOnce(() => {
      const mockedFiles = ['any_file.routes.ts', 'any_file.ts', 'any_folder'];
      return mockedFiles as any;
    });

    const files = sut.find('any_dir', /(.+)\.routes\.ts/g);

    expect(files.length).toBe(1);
    expect(files[0].endsWith('any_dir\\any_file.routes.ts')).toBeTruthy();
  });
});
