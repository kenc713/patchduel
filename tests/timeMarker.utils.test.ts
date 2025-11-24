import { describe, it, expect } from 'vitest'
import timeMarker, { GOAL_INDEX } from '../src/models/timeMarkerUtils'

describe('timeMarker utils', () => {
  it('indexToCoord と coordToIndex の逆変換が一致する', () => {
    for (let i = 0; i <= GOAL_INDEX; i++) {
      const { row, col } = timeMarker.indexToCoord(i)
      expect(timeMarker.coordToIndex(row, col)).toBe(i)
    }
  })

  it('index 63 は row:4, col:3 にマップされる', () => {
    const c = timeMarker.indexToCoord(GOAL_INDEX)
    expect(c).toEqual({ row: 4, col: 3 })
  })

  it('computeNewIndex は GOAL_INDEX を超えないようキャップする', () => {
    expect(timeMarker.computeNewIndex(60, 5)).toBe(GOAL_INDEX)
    expect(timeMarker.computeNewIndex(62, 1)).toBe(63)
    expect(timeMarker.computeNewIndex(10, 3)).toBe(13)
  })

  it('computeNewIndex は負のステップで例外を投げる', () => {
    expect(() => timeMarker.computeNewIndex(10, -1)).toThrow()
  })
})
