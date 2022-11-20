import http from 'node:http';
import https from 'node:https';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import { DownloaderAdapter } from './DownloaderAdapter';

jest.mock('node:http', () => ({
  request() {
    return {
      on: jest.fn((event: string, listener: (...args: any) => void) => {}),
    };
  },
}));

jest.mock('node:https', () => ({
  request() {
    return {
      on: jest.fn((event: string, listener: (...args: any) => void) => {}),
    };
  },
}));

const makeSut = (): DownloaderAdapter => new DownloaderAdapter();

describe('DownloaderAdapter Util', () => {
  test('Should throw if http.request throws', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    requestSpy.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.download('http://any_url.zip')).rejects.toThrow();

    requestSpy.mockClear();
  });

  test('Should call http.request with correct param', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    expect(requestSpy).toHaveBeenCalledWith('http://any_url.zip');
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

  test('Should handle request finish listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const onSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const [event, listener] = onSpy.mock.calls[2];

    expect(event).toBe('finish');
    expect(typeof listener).toBe('function');
  });

  test('Should throw if request error listener was called', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const onSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const listener = onSpy.mock.calls[1][1] as (error: Error) => void;

    await expect(listener(new Error())).rejects.toThrow();
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
});
