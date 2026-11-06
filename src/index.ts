export interface DurationParts {
  days: bigint;
  hours: bigint;
  minutes: bigint;
  seconds: bigint;
  milliseconds: bigint;
}
const MAX_INPUT = 256;

function validate(parts: DurationParts): DurationParts {
  for (const [name, value] of Object.entries(parts)) {
    if (typeof value !== 'bigint' || value < 0n)
      throw new RangeError(`${name} must be a non-negative bigint.`);
  }
  if (
    parts.hours > 23n ||
    parts.minutes > 59n ||
    parts.seconds > 59n ||
    parts.milliseconds > 999n
  ) {
    throw new RangeError('Hours, minutes, seconds, or milliseconds exceed normalized bounds.');
  }
  return parts;
}

export function parseDuration(value: string): DurationParts {
  if (typeof value !== 'string' || value.length > MAX_INPUT)
    throw new TypeError('Duration must be a string up to 256 characters.');
  const match =
    /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(?:\.(\d{1,3}))?S)?)?(?![\s\S])/.exec(value);
  if (
    !match ||
    !match.slice(1).some((part) => part !== undefined) ||
    value === 'P' ||
    value === 'PT'
  ) {
    throw new TypeError(
      'Expected non-negative ISO day/hour/minute/second duration; calendar years and months are unsupported.',
    );
  }
  if (value.includes('T') && !/[HMS]/.test(value.slice(value.indexOf('T') + 1)))
    throw new TypeError('T must be followed by a time component.');
  const days = BigInt(match[1] ?? '0');
  const hours = BigInt(match[2] ?? '0');
  const minutes = BigInt(match[3] ?? '0');
  const seconds = BigInt(match[4] ?? '0');
  const milliseconds = BigInt((match[5] ?? '').padEnd(3, '0') || '0');
  const total = (((days * 24n + hours) * 60n + minutes) * 60n + seconds) * 1000n + milliseconds;
  return fromDurationMilliseconds(total);
}

export function formatDuration(input: DurationParts): string {
  const parts = validate(input);
  let date = parts.days > 0n ? `${parts.days}D` : '';
  let time = '';
  if (parts.hours > 0n) time += `${parts.hours}H`;
  if (parts.minutes > 0n) time += `${parts.minutes}M`;
  if (parts.seconds > 0n || parts.milliseconds > 0n) {
    const fraction =
      parts.milliseconds > 0n
        ? `.${String(parts.milliseconds).padStart(3, '0').replace(/0+$/, '')}`
        : '';
    time += `${parts.seconds}${fraction}S`;
  }
  if (!date && !time) return 'PT0S';
  if (time) date += `T${time}`;
  return `P${date}`;
}

export function durationMilliseconds(input: DurationParts): bigint {
  const parts = validate(input);
  return (
    (((parts.days * 24n + parts.hours) * 60n + parts.minutes) * 60n + parts.seconds) * 1000n +
    parts.milliseconds
  );
}

export function fromDurationMilliseconds(total: bigint): DurationParts {
  if (typeof total !== 'bigint' || total < 0n)
    throw new RangeError('Milliseconds must be a non-negative bigint.');
  const days = total / 86_400_000n;
  let rest = total % 86_400_000n;
  const hours = rest / 3_600_000n;
  rest %= 3_600_000n;
  const minutes = rest / 60_000n;
  rest %= 60_000n;
  const seconds = rest / 1000n;
  return { days, hours, minutes, seconds, milliseconds: rest % 1000n };
}
