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

jest.useFakeTimers();

const makeFakeResponse = (): http.IncomingMessage => {
  return {
    pipe: jest.fn(() => ({
      on: jest.fn(),
    })),
    on: jest.fn(),
    isPaused: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
  } as unknown as http.IncomingMessage;
};

const makeFakeEntry = (): Entry => {
  return {
    on: jest.fn(),
  } as unknown as Entry;
};

const makeSut = (): ZippedCsvReaderAdapter => new ZippedCsvReaderAdapter();

describe('ZipLoaderAdapter Util', () => {
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

  test('Should handle request finish listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const onSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');

    const [event, listener] = onSpy.mock.calls[2];

    expect(event).toBe('finish');
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

  test('Should handle response end listener', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const responseOnSpy = jest.spyOn(responseListener.mock.calls[0][0], 'on');

    const [event, listener] = responseOnSpy.mock.calls[1];

    expect(event).toBe('end');
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

  test('Should emit data event with correct values if entry data listener was called', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    const stream = await sut.read('http://any_url.zip');
    const dataListener = jest.fn();

    stream.on('data', dataListener);

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
    const entryDataListener = jest.fn(entryOnSpy.mock.calls[0][1] as (chunk: string) => void);

    entryDataListener('any_data_1\nany_data_2\nany_data_3\nany_dat');

    expect(dataListener).toHaveBeenCalledTimes(3);
    expect(dataListener.mock.calls[0][0]).toBe('any_data_1');
    expect(dataListener.mock.calls[1][0]).toBe('any_data_2');
    expect(dataListener.mock.calls[2][0]).toBe('any_data_3');
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

  test('Should emit end event if response end listener was called', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    const stream = await sut.read('http://any_url.zip');
    const endListener = jest.fn();

    stream.on('end', endListener);

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const responseOnSpy = jest.spyOn(responseListener.mock.calls[0][0], 'on');
    const responseEndListener = jest.fn(responseOnSpy.mock.calls[1][1] as () => void);

    responseEndListener();

    expect(endListener).toHaveBeenCalledTimes(1);
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

  test('Should call setInterval on response', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');
    const intervalSpy = jest.spyOn(global, 'setInterval');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    expect(intervalSpy).toHaveBeenCalledTimes(1);
    expect(intervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
  });

  test('Should pause response if is not paused', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    jest.spyOn(responseListener.mock.calls[0][0], 'isPaused').mockImplementationOnce(() => false);

    const pauseSpy = jest.spyOn(responseListener.mock.calls[0][0], 'pause');
    const resumeSpy = jest.spyOn(responseListener.mock.calls[0][0], 'resume');

    jest.runOnlyPendingTimers();

    expect(pauseSpy).toHaveBeenCalledTimes(1);
    expect(resumeSpy).toHaveBeenCalledTimes(0);
  });

  test('Should resume response if is not resumed', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    jest.spyOn(responseListener.mock.calls[0][0], 'isPaused').mockImplementationOnce(() => true);

    const resumeSpy = jest.spyOn(responseListener.mock.calls[0][0], 'resume');
    const pauseSpy = jest.spyOn(responseListener.mock.calls[0][0], 'pause');

    jest.runOnlyPendingTimers();

    expect(resumeSpy).toHaveBeenCalledTimes(1);
    expect(pauseSpy).toHaveBeenCalledTimes(0);
  });

  test('Should call clearInterval on response end', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const responseListener = jest.fn(
      requestOnSpy.mock.calls[0][1] as (response: http.IncomingMessage) => void,
    );

    responseListener(makeFakeResponse());

    const setIntervalResult = setIntervalSpy.mock.results[0].value;

    const responseOnSpy = jest.spyOn(responseListener.mock.calls[0][0], 'on');
    const responseEndListener = jest.fn(responseOnSpy.mock.calls[1][1] as () => void);

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    responseEndListener();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    expect(clearIntervalSpy).toHaveBeenCalledWith(expect.any(Object));
  });

  test('Should handle process uncaught exception listener', async () => {
    const sut = makeSut();

    const processOnSpy = jest.spyOn(process, 'on');

    await sut.read('http://any_url.zip');

    const [event, listener] = processOnSpy.mock.calls[0];

    expect(event).toBe('uncaughtException');
    expect(typeof listener).toBe('function');
  });

  test('Should emit an error event if uncaught exception was handled', async () => {
    const sut = makeSut();

    const processOnSpy = jest.spyOn(process, 'on');

    const stream = await sut.read('http://any_url.zip');
    const errorListener = jest.fn();

    stream.on('error', errorListener);

    const uncaughtExceptionListener = processOnSpy.mock.calls[0][1] as (error: Error) => void;

    const error = new Error('uncaught_exception');
    uncaughtExceptionListener(error);

    expect(errorListener).toHaveBeenCalledTimes(1);
    expect(errorListener).toHaveBeenCalledWith(error);
  });

  test('Should remove process uncaughtException listener on request finish', async () => {
    const sut = makeSut();

    const requestSpy = jest.spyOn(http, 'request');

    await sut.read('http://any_url.zip');

    const requestOnSpy = jest.spyOn(requestSpy.mock.results[0].value, 'on');
    const finishListener = jest.fn(requestOnSpy.mock.calls[2][1] as () => void);

    const processRemoveListenerSpy = jest.spyOn(process, 'removeListener');

    finishListener();

    const [event, listener] = processRemoveListenerSpy.mock.calls[0];

    expect(event).toBe('uncaughtException');
    expect(typeof listener).toBe('function');
  });
});
