const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365.25

type Unit =
	| 'Years' | 'Year' | 'Yrs' | 'Yr' | 'Y'
	| 'Weeks' | 'Week' | 'W'
	| 'Days' | 'Day' | 'D'
	| 'Hours' | 'Hour' | 'Hrs' | 'Hr' | 'H'
	| 'Minutes' | 'Minute' | 'Mins' | 'Min' | 'M'
	| 'Seconds' | 'Second' | 'Secs' | 'Sec' | 'S'
	| 'Milliseconds' | 'Millisecond' | 'Msecs' | 'Msec' | 'Ms'

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>

export type StringValue =
	| `${number}`
	| `${number}${UnitAnyCase}`
	| `${number} ${UnitAnyCase}`

// ms('1 minute'); // return 600000
// ms('2 hours'); // return 7200000
// ms('500 ms'); // return 500
export function ms(str: StringValue): number {
	if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
		throw new Error('Value provided to ms() must be a valid string (1-99 chars).')
	}

	const cleanedStr = str.replace(/\s+/g, ' ').trim() // Видаляє зайві пробіли

	const match =
		/^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
			cleanedStr
		)

	const groups = match?.groups as { value: string; type: string } | undefined
	if (!groups) return NaN

	const n = parseFloat(groups.value)
	const type = (groups.type || 'ms').toLowerCase() as Lowercase<Unit>

	switch (type) {
		case 'years': case 'year': case 'yrs': case 'yr': case 'y': return n * y
		case 'weeks': case 'week': case 'w': return n * w
		case 'days': case 'day': case 'd': return n * d
		case 'hours': case 'hour': case 'hrs': case 'hr': case 'h': return n * h
		case 'minutes': case 'minute': case 'mins': case 'min': case 'm': return n * m
		case 'seconds': case 'second': case 'secs': case 'sec': case 's': return n * s
		case 'milliseconds': case 'millisecond': case 'msecs': case 'msec': case 'ms': return n
		default: return NaN
	}
}
