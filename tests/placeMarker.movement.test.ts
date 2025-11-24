import { describe, it, expect, beforeEach } from 'vitest'
import useGame from '../src/state/useGame'

// Helper to reset store to known state
function resetStoreWithMarker(marker = { id: 'm-1', playerId: 'p1', x: 0, y: 0, placedAt: new Date().toISOString() }) {
  useGame.setState({
    markers: [marker],
    selected: null,
    activePlayer: marker.playerId,
  })
}

describe('placeMarker movement (in-place update)', () => {
  beforeEach(() => {
    // reset store to known state with one marker for p1 at (0,0)
    resetStoreWithMarker()
  })

  // 
  it('updates existing marker coordinates and keeps same id when same player places a new marker', () => {
    
    // マーカー設置前の状態を取得
    const before = useGame.getState().markers[0]
    const oldId = before.id

    // マーカーを新しい座標に移動
    const result = useGame.getState().placeMarker('p1', 2, 2)
    
    // マーカー移動が成功したことを確認
    expect(result).toBe(true)

    // マーカーの状態を取得
    const markers = useGame.getState().markers

    // 移動後もマーカーの数は1つであることを確認
    expect(markers.length).toBe(1)

    // マーカーのIDが変わっていないことを確認
    expect(markers[0].id).toBe(oldId)

    // 座標が更新されていることを確認
    expect(markers[0].x).toBe(2)
    expect(markers[0].y).toBe(2)
  })

  it('adds a new marker when another player places and does not affect existing marker', () => {
    
    // 他のプレイヤーが新しいマーカーを配置
    const result = useGame.getState().placeMarker('p2', 3, 3)
    expect(result).toBe(true)

    // マーカーが2つ存在することを確認
    const markers = useGame.getState().markers
    expect(markers.length).toBe(2)
    
    // 新しいプレイヤーのマーカーが正しく配置されていることを確認
    const p2 = markers.find(m => m.playerId === 'p2')
    expect(p2).toBeTruthy()
    expect(p2?.x).toBe(3)
    expect(p2?.y).toBe(3)
  })
})
