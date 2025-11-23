import { describe, it, expect, beforeEach } from 'vitest'
import useGame from '../src/state/useGame'

describe('session initialization', () => {

  // 各ケース実行前に状態を初期化
  beforeEach(() => {
    useGame.setState({ markers: [], selected: null, activePlayer: 'p2' })
  })

  // 単一プレイヤーのセッションを初期化する関数の検証
  it('provides initSession to initialize single-player session with marker at (0,0)', () => {

    // 関数の存在を確認
    const fn = useGame.getState().initSession
    expect(typeof fn).toBe('function')

    // player_id：'p1'でセッションを初期化
    fn('p1')

    // activePlayer変数が設定されていることを確認
    expect(useGame.getState().activePlayer).toBe('p1')

    // マーカーが0,0にあるかつ'p1'のものであることを確認
    const m = useGame.getState().getMarkerAt(0,0)
    expect(m).toBeTruthy()
    expect(m?.playerId).toBe('p1')
  })
})
