import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const result = generateLinkedList([1, 2, 3]);

    const expected = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    expect(result).toStrictEqual(expected);
  });

  test('should generate linked list from values 2', () => {
    const result1 = generateLinkedList(['a', 'b', 'c']);
    const result2 = generateLinkedList([true, false]);
    const result3 = generateLinkedList([]);

    expect(result1).toMatchSnapshot('linked-list-strings');
    expect(result2).toMatchSnapshot('linked-list-booleans');
    expect(result3).toMatchSnapshot('linked-list-empty');
  });

  test('edge cases with regular comparison', () => {
    const singleElement = generateLinkedList([42]);
    expect(singleElement).toStrictEqual({
      value: 42,
      next: {
        value: null,
        next: null,
      },
    });

    const withNull = generateLinkedList([null, null]);
    expect(withNull).toStrictEqual({
      value: null,
      next: {
        value: null,
        next: {
          value: null,
          next: null,
        },
      },
    });
  });

  test('complex objects with snapshot testing', () => {
    const complexObjects = generateLinkedList([
      { id: 1, name: 'Object 1', nested: { prop: 'value' } },
      { id: 2, name: 'Object 2', nested: { prop: 'another value' } },
    ]);

    expect(complexObjects).toMatchSnapshot('linked-list-complex-objects');
  });
});
