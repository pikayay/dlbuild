import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should remove falsy values', () => {
    expect(cn('foo', false, 'bar', null, undefined, 'baz')).toBe('foo bar baz')
  })

  it('should handle an empty argument list', () => {
    expect(cn()).toBe('')
  })

  it('should return a single class name', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('should handle leading and trailing spaces', () => {
    const className = cn('  foo  ', '  bar  ')
    expect(className).toBe('  foo     bar  ')
  })
})
