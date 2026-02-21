import { describe, expect, it } from 'vitest';
import Scrollama from '../src/index.js';

describe('component contract', () => {
  it('exposes Scrollama with expected component contract', () => {
    expect(Scrollama).toBeTruthy();
    expect(Scrollama.name).toBe('Scrollama');
    expect(typeof Scrollama.setup).toBe('function');
    expect(Scrollama.emits).toEqual(['step-progress', 'step-enter', 'step-exit']);
  });
});
