import http from 'node:http';
import https from 'node:https';
import unzipper, { Entry } from 'unzipper';
import { InvalidParamError } from '../presentation/errors/InvalidParamError';
import { ZippedCsvReaderAdapter } from './ZippedCsvReaderAdapter';

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

class SystemErrorStub extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

const makeFakeResponse = (): http.IncomingMessage => {
  return {
    pipe: jest.fn(() => ({
      on: jest.fn(),
    })),
    on: jest.fn(),
  } as unknown as http.IncomingMessage;
};

const makeFakeEntry = (): Entry => {
  return {
    on: jest.fn(),
    isPaused: jest.fn(() => false),
    pause: jest.fn(),
    resume: jest.fn(),
  } as unknown as Entry;
};

const makeSut = (): ZippedCsvReaderAdapter => new ZippedCsvReaderAdapter();

describe('ZippedCsvReaderAdapter Util', () => {
  beforeEach(() => {
    jest.spyOn(process, 'on').mockImplementation(jest.fn());
    jest.spyOn(process, 'removeListener').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.spyOn(http, 'request').mockClear();
    jest.spyOn(process, 'on').mockClear();
    jest.spyOn(process, 'removeListener').mockClear();
  });

  test('Should throw if an invalid url was given', async () => {
    const sut = makeSut();

    await expect(sut.read('invalid_url')).rejects.toThrow(new InvalidParamError('url'));
  });

  test('Should import correct url protocol', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(https, 'request');

    await sut.read('https://any_url.zip');

    expect(requestSpy).toHaveBeenCalledWith('https://any_url.zip');
  });

  test('Should throw if http.request throws', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    requestSpy.mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.read('http://any_url.zip')).rejects.toThrow();
  });

  test('Should call http.request with correct param', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    expect(requestSpy).toHaveBeenCalledWith('http://any_url.zip');
  });

  test('Should call request end', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const requestEndSpy = jest.spyOn(requestSpy.mock.results[0].value, 'end');

    expect(requestEndSpy).toHaveBeenCalledTimes(1);
  });

  test('Should handle request response listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const onSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const [event, listener] = onSpy.mock.calls[0];

    expect(event).toBe('response');
    expect(typeof listener).toBe('function');
  });

  test('Should handle request error listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const onSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const [event, listener] = onSpy.mock.calls[1];

    expect(event).toBe('error');
    expect(typeof listener).toBe('function');
  });

  test('Should call response pipe with correct param', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const unzipperParseSpy = jest.spyOn(unzipper, 'Parse');
    const responsePipeSpy = jest.spyOn(responseListener.mock.calls[0][0], 'pipe');

    const unzipperParseCallResult = unzipperParseSpy.mock.results[0].value;

    expect(responsePipeSpy).toHaveBeenCalledTimes(1);
    expect(responsePipeSpy).toHaveBeenCalledWith(unzipperParseCallResult);
  });

  test('Should handle response entry listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const responsePipeSpy = jest.spyOn(responseListener.mock.calls[0][0], 'pipe');

    const responsePipeOnSpy = jest.spyOn(responsePipeSpy.mock.results[0].value, 'on');

    const [event, listener] = responsePipeOnSpy.mock.calls[0];

    expect(event).toBe('entry');
    expect(typeof listener).toBe('function');
  });

  test('Should handle response error listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const responseOnSpy = jest.spyOn(responseListener.mock.calls[0][0], 'on');

    const [event, listener] = responseOnSpy.mock.calls[0];

    expect(event).toBe('error');
    expect(typeof listener).toBe('function');
  });

  test('Should handle entry data listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const responsePipeSpy = jest.spyOn(responseListener.mock.calls[0][0], 'pipe');

    const responsePipeOnSpy = jest.spyOn(responsePipeSpy.mock.results[0].value, 'on');

    const entryListener = jest.fn(responsePipeOnSpy.mock.calls[0][1] as (entry: Entry) => {});

    entryListener(makeFakeEntry());

    const entryOnSpy = jest.spyOn(entryListener.mock.calls[0][0], 'on');

    const [event, listener] = entryOnSpy.mock.calls[0];

    expect(event).toBe('data');
    expect(typeof listener).toBe('function');
  });

  test('Should handle entry end listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const responsePipeSpy = jest.spyOn(responseListener.mock.calls[0][0], 'pipe');

    const responsePipeOnSpy = jest.spyOn(responsePipeSpy.mock.results[0].value, 'on');

    const entryListener = jest.fn(responsePipeOnSpy.mock.calls[0][1] as (entry: Entry) => {});

    entryListener(makeFakeEntry());

    const entryOnSpy = jest.spyOn(entryListener.mock.calls[0][0], 'on');

    const [event, listener] = entryOnSpy.mock.calls[1];

    expect(event).toBe('end');
    expect(typeof listener).toBe('function');
  });

  test('Should emit error event if response error listener was called', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    const stream = await sut.read('http://any_url.zip');
    const errorListener = jest.fn();

    stream.on('error', errorListener);

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const responseOnSpy = jest.spyOn(responseListener.mock.calls[0][0], 'on');
    const responseErrorListener = jest.fn(responseOnSpy.mock.calls[0][1] as (error: Error) => void);

    const error = new Error('any_error');
    responseErrorListener(error);

    expect(errorListener).toHaveBeenCalledTimes(1);
    expect(errorListener).toHaveBeenCalledWith(error);
  });

  test('Should emit error event if request error listener was called', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    const stream = await sut.read('http://any_url.zip');
    const errorListener = jest.fn();

    stream.on('error', errorListener);

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const requestErrorListener = jest.fn(requestOnSpy.mock.calls[1][1] as (error: Error) => void);

    const error = new Error('any_error');
    requestErrorListener(error);

    expect(errorListener).toHaveBeenCalledTimes(1);
    expect(errorListener).toHaveBeenCalledWith(error);
  });

  test('Should emit end event if entry end listener was called', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    const event = await sut.read('http://any_url.zip');
    const endListener = jest.fn();

    event.on('end', endListener);

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const responsePipeSpy = jest.spyOn(responseListener.mock.calls[0][0], 'pipe');

    const responsePipeOnSpy = jest.spyOn(responsePipeSpy.mock.results[0].value, 'on');

    const entryListener = jest.fn(responsePipeOnSpy.mock.calls[0][1] as (entry: Entry) => {});

    entryListener(makeFakeEntry());

    const entryOnSpy = jest.spyOn(entryListener.mock.calls[0][0], 'on');
    const entryEndListener = jest.fn(entryOnSpy.mock.calls[1][1]);

    entryEndListener();

    expect(endListener).toHaveBeenCalledTimes(1);
  });

  test('Should reconnect the request if ECONNRESET exception throws', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const requestErrorListener = jest.fn(requestOnSpy.mock.calls[1][1] as (error: Error) => void);

    requestErrorListener(new SystemErrorStub('abort', 'ECONNRESET'));

    expect(requestSpy).toHaveBeenCalledTimes(2);
  });
});
