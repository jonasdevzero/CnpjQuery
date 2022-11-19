import http from 'node:http';
import { DownloaderAdapter } from './DownloaderAdapter';

describe('DownloaderAdapter Util', () => {
  test('Should throw if http.request throws', async () => {
    const sut = new DownloaderAdapter();

    const requestSpy = jest.spyOn(http, 'request');

    requestSpy.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.download('http://any_url.com')).rejects.toThrow();
  });
});
