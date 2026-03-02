/**
 * A tiny utility for constructing className strings conditionally.
 *
 * Example:
 * ```
 * cn('foo', 'bar', false && 'baz', 'qux')
 * // => "foo bar qux"
 * ```
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ')
}
