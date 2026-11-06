import test from 'node:test';
import assert from 'node:assert/strict';
import {
  durationMilliseconds,
  formatDuration,
  fromDurationMilliseconds,
  parseDuration,
} from '../dist/esm/index.js';

test('parses exact day and time components as bigint milliseconds', () => {
  assert.equal(durationMilliseconds(parseDuration('P2DT3H4M5.25S')), 183_845_250n);
});
test('formats normalized components without floating-point loss', () => {
  assert.equal(
    formatDuration({ days: 1n, hours: 2n, minutes: 0n, seconds: 3n, milliseconds: 40n }),
    'P1DT2H3.04S',
  );
});
test('round-trips exact millisecond values including large durations', () => {
  const total = 123456789012345678901234n;
  assert.equal(durationMilliseconds(fromDurationMilliseconds(total)), total);
});
test('normalizes zero and omits zero-valued components', () => {
  assert.equal(formatDuration(fromDurationMilliseconds(0n)), 'PT0S');
  assert.equal(formatDuration(parseDuration('PT60S')), 'PT1M');
});
test('rejects calendar years and months, negatives, and empty durations', () => {
  for (const value of ['P1Y', 'P1M', '-PT1S', 'P', 'PT']) assert.throws(() => parseDuration(value));
});
test('normalizes overflow and rejects sub-millisecond precision', () => {
  assert.equal(formatDuration(parseDuration('PT24H')), 'P1D');
  assert.throws(() => parseDuration('PT1.0001S'), TypeError);
  assert.throws(
    () => formatDuration({ days: 0n, hours: 24n, minutes: 0n, seconds: 0n, milliseconds: 0n }),
    RangeError,
  );
});
