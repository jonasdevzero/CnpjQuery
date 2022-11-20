import http from 'node:http';
import { DownloaderAdapter } from './DownloaderAdapter';

jest.mock('node:http', () => ({
  request() {
    return {
      on: jest.fn((event: string, listener: () => void) => {}),
    };
  },
}));

describe('DownloaderAdapter Util', () => {
  test('Should call http.request with correct param', async () => {
    const sut = new DownloaderAdapter();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.com');

    expect(requestSpy).toHaveBeenCalledWith('http://any_url.com');
  });

  test('Should handle request response listener', async () => {
    const sut = new DownloaderAdapter();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.com');

    const onSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const [event, listener] = onSpy.mock.calls[0];

    expect(event).toBe('response');
    expect(typeof listener).toBe('function');
  });

  test('Should throw if http.request throws', async () => {
    const sut = new DownloaderAdapter();

    const requestSpy = jest.spyOn(http, 'request');

    requestSpy.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.download('http://any_url.com')).rejects.toThrow();
  });
});
