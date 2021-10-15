import * as lib from '../processing';

describe('slidingAverage', () => {
  it('with odd data points', () => {
    const input = [3, 5, 7];
    const result = lib.slidingAverage(3)(input);
    const exp = [4, 5, 6];
    expect(result).toEqual(exp);
  });

  it('with even data points', () => {
    const input = [0, 1, 5, 6];
    const result = lib.slidingAverage(3)(input);
    const exp = [0.5, 2, 4, 11 / 2];
    expect(result).toEqual(exp);
  });
});
