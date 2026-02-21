import { describe, expect, it } from 'vitest';
import Scrollama from '../src/index.js';

describe('component contract', () => {
  it('exposes Scrollama with expected lifecycle hooks', () => {
    expect(Scrollama).toBeTruthy();
    expect(Scrollama.name).toBe('Scrollama');
    expect(typeof Scrollama.mounted).toBe('function');
    expect(typeof Scrollama.beforeUnmount).toBe('function');
  });
});
