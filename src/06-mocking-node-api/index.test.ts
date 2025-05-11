import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, timeout);

    expect(global.setTimeout).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;

    jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, interval);

    expect(global.setInterval).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    const pathToFile = 'test.txt';
    const mockJoin = path.join as jest.Mock;
    mockJoin.mockReturnValue('/mock/path/test.txt');
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    await readFileAsynchronously(pathToFile);

    expect(mockJoin).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'non-existent.txt';
    (path.join as jest.Mock).mockReturnValue('/mock/path/non-existent.txt');
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
    expect(fsPromises.readFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'existing.txt';
    const fileContent = 'This is the file content';
    const mockBuffer = Buffer.from(fileContent);

    (path.join as jest.Mock).mockReturnValue('/mock/path/existing.txt');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsPromises.readFile as jest.Mock).mockResolvedValue(mockBuffer);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(fileContent);
    expect(fsPromises.readFile).toHaveBeenCalledWith('/mock/path/existing.txt');
  });
});
