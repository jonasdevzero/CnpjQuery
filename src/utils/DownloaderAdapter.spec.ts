import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
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

jest.mock('node:fs', () => ({
  createWriteStream: jest.fn((url: string) => ({
    on: jest.fn((event: string, listener: (...args: any) => void) => {}),
    close: jest.fn(),
  })),
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

  test('Should call fs.createWriteStream with correct value', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const onSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const listener = jest.fn(
      onSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    listener({ pipe: jest.fn((_stream: fs.WriteStream) => null) } as any);

    const fsSpy = jest.spyOn(fs, 'createWriteStream');
    const calledUrl = fsSpy.mock.calls[0][0].toString();

    expect(calledUrl.endsWith('temp\\any_url.zip')).toBeTruthy();
  });

  test('Should call response.pipe with correct value', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const onSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const listener = jest.fn(
      onSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    listener({ pipe: jest.fn((_file: fs.WriteStream) => null) } as any);

    const responseParam = listener.mock.calls[0][0];

    const pipeSpy = jest.spyOn(responseParam, 'pipe');
    const writeStreamSpy = jest.spyOn(fs, 'createWriteStream');

    const pipeCalledParam = pipeSpy.mock.calls[0][0];
    const fileStream = writeStreamSpy.mock.results[0].value;

    expect(JSON.stringify(pipeCalledParam)).toBe(JSON.stringify(fileStream));
  });

  test('Should handle stream finish listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const requestListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    requestListener({ pipe: jest.fn((_stream) => null) } as any);

    const writeStreamSpy = jest.spyOn(fs, 'createWriteStream');

    const fileOnSpy = jest.spyOn(writeStreamSpy.mock.results[0].value, 'on');

    const [event, fileListener] = fileOnSpy.mock.calls[0];

    expect(event).toBe('finish');
    expect(typeof fileListener).toBe('function');
  });

  test('Should close stream on finish listener was called', async () => {
    const sut = makeSut();

    await sut.download('http://any_url.zip');

    const requestSpy = jest.spyOn(http, 'request');
    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener({ pipe: () => {} } as any);

    const writeStreamSpy = jest.spyOn(fs, 'createWriteStream');
    const fileOnSpy = jest.spyOn(writeStreamSpy.mock.results[0].value, 'on');

    const finishListener = jest.fn(fileOnSpy.mock.calls[0][1] as () => void);
    finishListener();

    const fileCloseSpy = jest.spyOn(
      writeStreamSpy.mock.results[0].value,
      'close',
    );

    expect(fileCloseSpy).toHaveBeenCalledTimes(1);
  });

  test('Should handle stream error listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.download('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener({ pipe: () => {} } as any);

    const writeStreamSpy = jest.spyOn(fs, 'createWriteStream');
    const fileOnSpy = jest.spyOn(writeStreamSpy.mock.results[0].value, 'on');

    const [event, listener] = fileOnSpy.mock.calls[1];

    expect(event).toBe('error');
    expect(typeof listener).toBe('function');
  });
});
