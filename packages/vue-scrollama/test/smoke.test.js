import { describe, expect, it } from 'vitest';
import Scrollama from '../src/index';

describe('component contract', () => {
  it('exposes Scrollama with expected component contract', () => {
    expect(Scrollama).toBeTruthy();
    expect(Scrollama.name).toBe('Scrollama');
    expect(typeof Scrollama.setup).toBe('function');
    const emits = Array.isArray(Scrollama.emits)
      ? Scrollama.emits
      : Object.keys(Scrollama.emits ?? {});
    expect(emits).toEqual(expect.arrayContaining(['step-progress', 'step-enter', 'step-exit']));
    expect(emits).toHaveLength(3);
  });
});
