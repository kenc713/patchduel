import { describe, it, expect, beforeEach } from 'vitest'
import useGame from '../src/state/useGame'

describe('placeMarker input validation', () => {
  beforeEach(() => {
    useGame.setState({ markers: [
      { id: 'm-0', playerId: 'p1', x: 0, y: 0, placedAt: new Date().toISOString() }
    ], selected: null, activePlayer: 'p1' })
  })

  it('rejects placement when caller is not the active player', () => {
    // p2 が置こうとしても activePlayer が p1 のため拒否される
    const ok = useGame.getState().placeMarker('p2', 1, 1)
    expect(ok).toBe(false)
    // マーカーは変更されていない
    const markers = useGame.getState().markers
    expect(markers.length).toBe(1)
    expect(markers[0].playerId).toBe('p1')
    expect(markers[0].x).toBe(0)
    expect(markers[0].y).toBe(0)
  })

  it('rejects out-of-range coordinates', () => {
    const ok = useGame.getState().placeMarker('p1', -1, 0)
    expect(ok).toBe(false)
  })
})
