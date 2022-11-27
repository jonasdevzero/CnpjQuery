import fs from 'node:fs';
import { FilesFinderAdapter } from './FilesFinderAdapter';

jest.mock('node:fs', () => ({
  readdirSync: jest.fn(),
}));

describe('FilesFinderAdapter Util', () => {
  test('Should call fs.readdirSync with correct value', () => {
    const sut = new FilesFinderAdapter();

    const readdirSpy = jest.spyOn(fs, 'readdirSync');

    sut.find('any_dir', 'any_match');

    const readdirPath = readdirSpy.mock.calls[0][0].toString();

    expect(readdirSpy).toHaveBeenCalledTimes(1);
    expect(readdirPath.endsWith('any_dir'));
  });
});
