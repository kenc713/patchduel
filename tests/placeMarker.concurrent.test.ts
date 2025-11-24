import { describe, it, expect, beforeEach } from 'vitest'
import useGame from '../src/state/useGame'

describe('concurrent placeMarker calls', () => {
  beforeEach(() => {
    // 初期状態: p1 に初期マーカー、p2 は未配置
    useGame.setState({ markers: [
      { id: 'm-1', playerId: 'p1', x: 0, y: 0, placedAt: new Date().toISOString() }
    ], selected: null, activePlayer: 'p1' })
  })

  it('keeps one marker per player under rapid successive calls', async () => {
    const calls = [] as Promise<any>[]
    // 同一プレイヤー p1 が非同期に短時間の複数回配置を試みる
    for (let i = 1; i <= 10; i++) {
      // queue in microtask to simulate rapid succession
      calls.push(Promise.resolve().then(() => useGame.getState().placeMarker('p1', i, i)))
    }

    // 異なるプレイヤー p2 も同時に何度か非同期に置こうとする（切り替えてから配置）
    for (let i = 1; i <= 5; i++) {
      calls.push(Promise.resolve().then(() => {
        useGame.setState({ activePlayer: 'p2' })
        return useGame.getState().placeMarker('p2', 10 + i, 10 + i)
      }))
    }

    // すべての非同期処理の完了を待つ
    await Promise.all(calls)

    const markers = useGame.getState().markers
    // p1, p2 それぞれ最大1つずつのマーカーがあること
    const p1Count = markers.filter(m => m.playerId === 'p1').length
    const p2Count = markers.filter(m => m.playerId === 'p2').length
    expect(p1Count).toBeLessThanOrEqual(1)
    expect(p2Count).toBeLessThanOrEqual(1)
    // 少なくとも p1 のマーカーは存在する
    expect(p1Count).toBe(1)
  })
})
