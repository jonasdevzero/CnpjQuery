import http from 'node:http';
import https from 'node:https';
import unzipper from 'unzipper';
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

jest.mock('unzipper', () => ({
  Parse: jest.fn(() => 'any_stream'),
}));

const makeFakeResponse = (): http.IncomingMessage => {
  return {
    pipe: jest.fn(),
    on: jest.fn(),
  } as unknown as http.IncomingMessage;
};

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

  test('Should call response pipe with correct param', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const unzipperParseSpy = jest.spyOn(unzipper, 'Parse');
    const responsePipeSpy = jest.spyOn(
      responseListener.mock.calls[0][0],
      'pipe',
    );

    const unzipperParseCallResult = unzipperParseSpy.mock.results[0].value;

    expect(responsePipeSpy).toHaveBeenCalledTimes(1);
    expect(responsePipeSpy).toHaveBeenCalledWith(unzipperParseCallResult);
  });

  test('Should handle response entry listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const responseOnSpy = jest.spyOn(responseListener.mock.calls[0][0], 'on');

    const [event, listener] = responseOnSpy.mock.calls[0];

    expect(event).toBe('entry');
    expect(typeof listener).toBe('function');
  });

  test('Should handle response error listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const responseOnSpy = jest.spyOn(responseListener.mock.calls[0][0], 'on');

    const [event, listener] = responseOnSpy.mock.calls[1];

    expect(event).toBe('error');
    expect(typeof listener).toBe('function');
  });

  test('Should handle response end listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const responseOnSpy = jest.spyOn(responseListener.mock.calls[0][0], 'on');

    const [event, listener] = responseOnSpy.mock.calls[2];

    expect(event).toBe('end');
    expect(typeof listener).toBe('function');
  });
});
