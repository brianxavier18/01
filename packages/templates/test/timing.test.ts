import { describe, expect, it } from 'vitest';
import { pulsePeriod, QA_FRAMES, SCENE_STARTS, TOTAL_FRAMES } from '../src/timing';

describe('timing', () => {
  it('totals exactly 450 frames (15 s @ 30 fps)', () => {
    expect(TOTAL_FRAMES).toBe(450);
  });
  it('scene starts match QA spec', () => {
    expect(SCENE_STARTS.products).toEqual([40, 143, 246]);
    expect(SCENE_STARTS.cta).toBe(349);
    expect(SCENE_STARTS.cta + 101).toBe(TOTAL_FRAMES);
  });
  it('QA frames fall inside their scenes', () => {
    expect(QA_FRAMES.product1).toBeGreaterThanOrEqual(SCENE_STARTS.products[0]!);
    expect(QA_FRAMES.product2).toBeGreaterThanOrEqual(SCENE_STARTS.products[1]!);
    expect(QA_FRAMES.product3).toBeGreaterThanOrEqual(SCENE_STARTS.products[2]!);
    expect(QA_FRAMES.cta).toBeGreaterThanOrEqual(SCENE_STARTS.cta);
  });
  it('pulse never exceeds 2 per second', () => {
    expect(pulsePeriod()).toBeGreaterThanOrEqual(15);
    expect(pulsePeriod(128)).toBeGreaterThanOrEqual(15);
    expect(pulsePeriod(240)).toBeGreaterThanOrEqual(15);
    expect(pulsePeriod(90)).toBe(20);
  });
});
