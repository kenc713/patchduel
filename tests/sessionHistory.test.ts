import { describe, it, expect, beforeEach } from 'vitest'
import useGame from '../src/state/useGame'
import useSession from '../src/state/session'

describe('session history', () => {
  beforeEach(() => {
    // 初期セッションを開始して (0,0) に初期マーカーを置く
    useGame.getState().initSession('p1')
  })
  
  it('records initial placement in session.history', () => {
    const hist = useSession.getState().history
    expect(hist.length).toBeGreaterThanOrEqual(1)
    const first = hist[0]
    expect(first.type).toBe('place')
    expect(first.playerId).toBe('p1')
    expect(first.payload.x).toBe(0)
    expect(first.payload.y).toBe(0)
  })

  it('records placeMarker and endTurn actions', () => {
    const s = useGame.getState()
    // p2 はまだマーカーを持っていないので配置できる
    // ここで activePlayer を p2 に切り替えてから配置する
    useGame.setState({ activePlayer: 'p2' })
    const ok = s.placeMarker('p2', 1, 1)
    expect(ok).toBe(true)
    // 履歴に追加されていること
    const histAfterPlace = useSession.getState().history
    expect(histAfterPlace.find(h => h.type === 'place' && h.playerId === 'p2')).toBeTruthy()

    // endTurn が履歴に追加される
    s.endTurn('p1')
    const last = useSession.getState().history.slice(-1)[0]
    expect(last.type).toBe('endTurn')
    expect(last.playerId).toBe('p1')
  })
})
