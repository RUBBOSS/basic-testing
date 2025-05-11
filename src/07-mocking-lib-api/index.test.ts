jest.mock('lodash', () => {
  const originalLodash = jest.requireActual('lodash');
  return {
    ...originalLodash,
    throttle: jest.fn((fn) => fn),
  };
});

jest.mock('axios');

import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi Core Functionality', () => {
  beforeEach(() => {
    mockedAxios.create.mockClear();
  });

  test('should create an axios instance with the correct base URL', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: 'mock data' });
    mockedAxios.create.mockReturnValue({
      get: mockGet,
    } as unknown as AxiosInstance);

    await throttledGetDataFromApi('/test');

    expect(mockedAxios.create).toHaveBeenCalledTimes(1);
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform a GET request to the correct relative URL', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: 'mock data' });
    const mockAxiosInstance = {
      get: mockGet,
    } as unknown as AxiosInstance;
    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    const relativePath = '/users';
    await throttledGetDataFromApi(relativePath);

    expect(mockedAxios.create).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return data from the API response', async () => {
    const expectedData = { id: 1, name: 'Test User' };
    const mockGet = jest.fn().mockResolvedValue({ data: expectedData });
    mockedAxios.create.mockReturnValue({
      get: mockGet,
    } as unknown as AxiosInstance);

    const result = await throttledGetDataFromApi('/users/1');

    expect(result).toEqual(expectedData);
  });
});
