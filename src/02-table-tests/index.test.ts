import { simpleCalculator, Action } from './index';

describe('simpleCalculator', () => {
  // Table-driven tests for valid operations
  describe('Valid operations', () => {
    const testCases = [
      {
        a: 5,
        b: 3,
        action: Action.Add,
        expected: 8,
        description: 'should add two numbers',
      },
      {
        a: 10,
        b: 4,
        action: Action.Subtract,
        expected: 6,
        description: 'should subtract two numbers',
      },
      {
        a: 7,
        b: 6,
        action: Action.Multiply,
        expected: 42,
        description: 'should multiply two numbers',
      },
      {
        a: 20,
        b: 5,
        action: Action.Divide,
        expected: 4,
        description: 'should divide two numbers',
      },
      {
        a: 2,
        b: 3,
        action: Action.Exponentiate,
        expected: 8,
        description: 'should exponentiate two numbers',
      },
    ];

    test.each(testCases)(
      '$description: $a $action $b = $expected',
      ({ a, b, action, expected }) => {
        const result = simpleCalculator({ a, b, action });
        expect(result).toBe(expected);
      },
    );
  });

  // Table-driven tests for invalid inputs
  describe('Invalid inputs', () => {
    const invalidTestCases = [
      {
        a: '5',
        b: 3,
        action: Action.Add,
        description: 'should return null when first argument is not a number',
      },
      {
        a: 5,
        b: '3',
        action: Action.Add,
        description: 'should return null when second argument is not a number',
      },
      {
        a: 5,
        b: 3,
        action: 'invalid',
        description: 'should return null when action is invalid',
      },
      {
        a: null,
        b: 3,
        action: Action.Add,
        description: 'should return null when first argument is null',
      },
      {
        a: 5,
        b: undefined,
        action: Action.Add,
        description: 'should return null when second argument is undefined',
      },
    ];

    test.each(invalidTestCases)('$description', ({ a, b, action }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBeNull();
    });
  });
});
