import http from 'node:http';
import { DownloaderAdapter } from './DownloaderAdapter';

jest.mock('node:http', () => ({
  request() {
    return null;
  },
}));

describe('DownloaderAdapter Util', () => {
  test('Should throw if http.request throws', async () => {
    const sut = new DownloaderAdapter();

    const requestSpy = jest.spyOn(http, 'request');

    requestSpy.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.download('http://any_url.com')).rejects.toThrow();
  });

  test('Should call http.request with correct param', async () => {
    const sut = new DownloaderAdapter();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.com');

    expect(requestSpy).toHaveBeenCalledWith('http://any_url.com');
  });
});
