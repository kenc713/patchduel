import { describe, it, expect, beforeEach } from 'vitest'
import useGame from '../src/state/useGame'
import useSession from '../src/state/session'

describe('recordPlace payload observability', () => {
  beforeEach(() => {
    // reset both stores
    useGame.setState({ markers: [
      { id: 'm-0', playerId: 'p1', x: 0, y: 0, placedAt: new Date().toISOString() }
    ], selected: null, activePlayer: 'p1' })
    useSession.setState({ history: [], sessionId: '', startedAt: '', activePlayer: '', ended: false })
  })

  it('records moved payload with prevPosition and moved:true when updating existing marker', () => {
    
    // マーカー設置前の状態を取得
    const before = useGame.getState().markers.find(m => m.playerId === 'p1')!

    // マーカーを新しい座標に移動
    const ok = useGame.getState().placeMarker('p1', 2, 2)
    expect(ok).toBe(true)

    // 履歴の最後のエントリが正しいペイロードを持つことを確認
    const hist = useSession.getState().history
    const last = hist[hist.length - 1]
    expect(last).toBeTruthy()
    expect(last.type).toBe('place')
    expect(last.playerId).toBe('p1')
    expect(last.payload).toHaveProperty('prevPosition')
    expect(last.payload).toHaveProperty('moved', true)
    expect(last.payload.prevPosition.x).toBe(before.x)
    expect(last.payload.prevPosition.y).toBe(before.y)
  })

  it('records new placement without moved flag for new markers', () => {
    
    // 他のプレイヤーが新しいマーカーを配置（先に activePlayer を p2 に切り替える）
    // 初期配置されているマーカーは p1 のものだけなので、p2 は新規配置となる
    useGame.setState({ activePlayer: 'p2' })
    const ok = useGame.getState().placeMarker('p2', 5, 5)
    expect(ok).toBe(true)

    // 履歴の最後のエントリが正しいペイロードを持つことを確認
    const hist = useSession.getState().history
    const last = hist[hist.length - 1]
    expect(last).toBeTruthy()
    expect(last.payload).toHaveProperty('markerId')
    expect(last.payload).not.toHaveProperty('moved')
  })
})
