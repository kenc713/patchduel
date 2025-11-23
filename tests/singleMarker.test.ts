import { describe, it, expect } from 'vitest'
import useGame from '../src/state/useGame'

describe('single marker per player', () => {
  beforeEach(() => {
    useGame.setState({ markers: [
      { id: 'm-0', playerId: 'p1', x: 0, y: 0, placedAt: new Date().toISOString() }
    ], selected: null })
  })

  it('prevents placing a second marker for the same player', () => {
    const ok1 = useGame.getState().placeMarker('p1', 1, 0)
    expect(ok1).toBe(false)
    expect(useGame.getState().markers.filter(m => m.playerId === 'p1').length).toBe(1)
  })
})
