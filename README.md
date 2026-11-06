# @lp-labs/duration-codec

Exact fixed-unit ISO duration codec. Exact bigint millisecond parsing and formatting for fixed day/hour/minute/second ISO durations.

## Install

```sh
npm install @lp-labs/duration-codec
```

## Quick start

```js
import { formatDuration, parseDuration } from '@lp-labs/duration-codec';
console.log(formatDuration(parseDuration('P1DT2.5S'))); // P1DT2.5S
```

## Runtime exports

- `parseDuration`
- `formatDuration`
- `durationMilliseconds`
- `fromDurationMilliseconds`

The package supplies independent ESM and CommonJS builds, bundled declarations, and no runtime or peer dependencies.

## Complete public TypeScript declarations

```ts
export interface DurationParts {
  days: bigint;
  hours: bigint;
  minutes: bigint;
  seconds: bigint;
  milliseconds: bigint;
}
export declare function parseDuration(value: string): DurationParts;
export declare function formatDuration(input: DurationParts): string;
export declare function durationMilliseconds(input: DurationParts): bigint;
export declare function fromDurationMilliseconds(total: bigint): DurationParts;
```

## Scope and limits

Parses and formats non-negative durations made from days, hours, minutes, seconds, and up to three decimal second places. Arithmetic and millisecond conversion use bigint only; parsing normalizes overflow into canonical days/hours/minutes/seconds.

## Errors and bounds

Wrong/unsupported textual grammar raises TypeError. Negative bigint inputs or unnormalized parts passed to formatDuration raise RangeError.

## Customization

parseDuration accepts fixed-unit fields such as PT60S and normalizes to PT1M. fromDurationMilliseconds and durationMilliseconds preserve exact integer milliseconds with no floating-point conversions.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
