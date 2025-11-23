import { describe, it, expect, beforeEach } from 'vitest'
import useGame from '../src/state/useGame'

describe('placeMarker constraints', () => {
  beforeEach(() => {
    // テスト前にセッションを初期化して初期マーカーを配置
    useGame.getState().initSession('p1')
  })

  // ボードの外にマーカーを置けないことを検証
  it('rejects out-of-bounds placements', () => {
    const s = useGame.getState()
    expect(s.placeMarker('p1', -1, 0)).toBe(false)
    expect(s.placeMarker('p1', 8, 0)).toBe(false)
    expect(s.placeMarker('p1', 0, -1)).toBe(false)
    expect(s.placeMarker('p1', 0, 8)).toBe(false)
  })

  // 既にマーカーがあるセルに別プレイヤーが置けないことを検証
  it('blocks placement on occupied cell', () => {
    useGame.setState({ markers: [{ id: 'm-1', playerId: 'p2', x: 1, y: 1, placedAt: new Date().toISOString() }], selected: null })
    const s = useGame.getState()
    expect(s.placeMarker('p1', 1, 1)).toBe(false)
  })
})
