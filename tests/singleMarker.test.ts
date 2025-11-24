import { describe, it, expect, beforeEach } from 'vitest'
import useGame from '../src/state/useGame'

describe('single marker per player', () => {
  beforeEach(() => {
    useGame.setState({ markers: [
      { id: 'm-0', playerId: 'p1', x: 0, y: 0, placedAt: new Date().toISOString() }
    ], selected: null })
  })

  it('prevents placing a second marker for the same player', () => {
    // マーカー設置前の状態を取得
    const before = useGame.getState().markers.find(m => m.playerId === 'p1')!
    const oldId = before.id

    // マーカーを新しい座標に移動
    const ok1 = useGame.getState().placeMarker('p1', 1, 0)
    expect(ok1).toBe(true)

    // マーカーの数が1つであることを確認
    expect(useGame.getState().markers.filter(m => m.playerId === 'p1').length).toBe(1)
    
    // 移動後のマーカー状態を確認
    const after = useGame.getState().markers.find(m => m.playerId === 'p1')!
    expect(after.x).toBe(1)
    expect(after.id).toBe(oldId)
  })
})
