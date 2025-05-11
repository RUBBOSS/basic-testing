import {
  getBankAccount,
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from './index';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);

    expect(account).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(50);

    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(100)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const sourceAccount = getBankAccount(50);
    const destinationAccount = getBankAccount(20);

    expect(() => sourceAccount.transfer(100, destinationAccount)).toThrow(
      InsufficientFundsError,
    );
    expect(sourceAccount.getBalance()).toBe(50);
    expect(destinationAccount.getBalance()).toBe(20);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);

    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(50, account)).toThrow('Transfer failed');
    expect(account.getBalance()).toBe(100);
  });

  test('should deposit money', () => {
    const initialBalance = 100;
    const depositAmount = 50;
    const account = getBankAccount(initialBalance);

    const result = account.deposit(depositAmount);

    expect(account.getBalance()).toBe(initialBalance + depositAmount);
    expect(result).toBe(account);
  });

  test('should withdraw money', () => {
    const initialBalance = 100;
    const withdrawAmount = 50;
    const account = getBankAccount(initialBalance);

    const result = account.withdraw(withdrawAmount);

    expect(account.getBalance()).toBe(initialBalance - withdrawAmount);
    expect(result).toBe(account);
  });

  test('should transfer money', () => {
    const sourceInitialBalance = 100;
    const destInitialBalance = 50;
    const transferAmount = 30;

    const sourceAccount = getBankAccount(sourceInitialBalance);
    const destinationAccount = getBankAccount(destInitialBalance);

    const result = sourceAccount.transfer(transferAmount, destinationAccount);

    expect(sourceAccount.getBalance()).toBe(
      sourceInitialBalance - transferAmount,
    );
    expect(destinationAccount.getBalance()).toBe(
      destInitialBalance + transferAmount,
    );
    expect(result).toBe(sourceAccount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(100);
    const mockBalance = 150;

    (random as jest.Mock)
      .mockReturnValueOnce(mockBalance)
      .mockReturnValueOnce(1);

    const result = await account.fetchBalance();
    expect(result).toBe(mockBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(100);
    const mockBalance = 150;

    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(mockBalance);

    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(mockBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);
    const initialBalance = 100;

    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );

    await expect(account.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );

    expect(account.getBalance()).toBe(initialBalance);
  });
});
