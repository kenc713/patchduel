import { describe, it, expect, beforeEach } from 'vitest'
import useGame from '../src/state/useGame'

describe('endTurn behavior', () => {
  beforeEach(() => {
    // セッション初期化で初期マーカーを配置
    useGame.getState().initSession('p1')
  })

  // 新たなマーカーを配置せずにターン終了できることを検証
  it('allows ending turn without placing a new marker and preserves initial markers', () => {
    
    // 状態を取得して endTurn を呼び出す
    const s = useGame.getState()
    const result = s.endTurn('p1')

    // 成功していることを確認
    expect(result).toBe(true)

    // セッション履歴に endTurn イベントが追加されていることを確認
    const last = useGame.getState().session.history.slice(-1)[0]
    expect(last.type).toBe('endTurn')
    expect(last.playerId).toBe('p1')
    const markers = useGame.getState().markers.filter(m => m.playerId === 'p1')
    expect(markers.length).toBeGreaterThanOrEqual(1)
  })
})
