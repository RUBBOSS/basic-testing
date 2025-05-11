import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({
      a: 5,
      b: 3,
      action: Action.Add,
    });
    expect(result).toBe(8);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({
      a: 10,
      b: 4,
      action: Action.Subtract,
    });
    expect(result).toBe(6);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({
      a: 7,
      b: 6,
      action: Action.Multiply,
    });
    expect(result).toBe(42);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({
      a: 20,
      b: 5,
      action: Action.Divide,
    });
    expect(result).toBe(4);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({
      a: 2,
      b: 3,
      action: Action.Exponentiate,
    });
    expect(result).toBe(8);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({
      a: 5,
      b: 3,
      action: 'invalid',
    });
    expect(result).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const result1 = simpleCalculator({
      a: '5',
      b: 3,
      action: Action.Add,
    });
    expect(result1).toBeNull();

    const result2 = simpleCalculator({
      a: 5,
      b: '3',
      action: Action.Add,
    });
    expect(result2).toBeNull();

    const result3 = simpleCalculator({
      a: null,
      b: 3,
      action: Action.Add,
    });
    expect(result3).toBeNull();

    const result4 = simpleCalculator({
      a: 5,
      b: undefined,
      action: Action.Add,
    });
    expect(result4).toBeNull();
  });
});
