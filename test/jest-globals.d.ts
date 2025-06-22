/// <reference types="jest" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDefined(): R;
      toBeUndefined(): R;
      toHaveLength(expected: number): R;
      toBeGreaterThan(expected: number): R;
      toBe(expected: any): R;
    }
  }
}
