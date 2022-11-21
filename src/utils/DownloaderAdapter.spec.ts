import http from 'node:http';
import https from 'node:https';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import { DownloaderAdapter } from './DownloaderAdapter';

jest.mock('node:http', () => ({
  request() {
    return {
      on: jest.fn((event: string, listener: (...args: any) => void) => {}),
      end: jest.fn(),
    };
  },
}));

jest.mock('node:https', () => ({
  request() {
    return {
      on: jest.fn((event: string, listener: (...args: any) => void) => {}),
      end: jest.fn(),
    };
  },
}));

const makeSut = (): DownloaderAdapter => new DownloaderAdapter();

describe('DownloaderAdapter Util', () => {
  afterEach(() => {
    jest.spyOn(http, 'request').mockClear();
  });

  test('Should throw if an invalid url was given', async () => {
    const sut = makeSut();

    await expect(sut.download('invalid_url')).rejects.toThrow(
      new InvalidParamError('url'),
    );
  });

  test('Should import correct url protocol', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(https, 'request');

    await sut.download('https://any_url.zip');

    expect(requestSpy).toHaveBeenCalledWith('https://any_url.zip');
  });

  test('Should throw if http.request throws', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    requestSpy.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.download('http://any_url.zip')).rejects.toThrow();
  });

  test('Should call http.request with correct param', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    expect(requestSpy).toHaveBeenCalledWith('http://any_url.zip');
  });

  test('Should call request end', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const requestEndSpy = jest.spyOn(requestSpy.mock.results[0].value, 'end');

    expect(requestEndSpy).toHaveBeenCalledTimes(1);
  });

  test('Should handle request response listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const onSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const [event, listener] = onSpy.mock.calls[0];

    expect(event).toBe('response');
    expect(typeof listener).toBe('function');
  });

  test('Should handle request error listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const onSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const [event, listener] = onSpy.mock.calls[1];

    expect(event).toBe('error');
    expect(typeof listener).toBe('function');
  });
});
