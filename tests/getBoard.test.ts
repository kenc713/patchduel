import { describe, it, expect, beforeEach } from 'vitest'
import useGame from '../src/state/useGame'

/**
 * getBoard と関連ヘルパー関数のテスト
 */
describe('getBoard and helpers', () => {

  // 各テスト前にZustand ストアのマーカー状態をリセット
  beforeEach(() => {
    useGame.setState({ markers: [
      { id: 'm-0', playerId: 'p1', x: 0, y: 0, placedAt: new Date().toISOString() }
    ], selected: null })
  })

  // getBoardがマーカー配列を返すことを確認
  // 左上の初期マーカー配置のみを返すことを検証
  it('getBoard returns markers array', () => {
    const board = useGame.getState().getBoard()
    expect(Array.isArray(board)).toBe(true)
    expect(board.find(m => m.x === 0 && m.y === 0)).toBeTruthy()
  })

  // getMarkerAtが指定座標のマーカーを返すか、存在しない場合はundefinedを返すことを確認
  it('getMarkerAt returns marker at coordinates or undefined', () => {
    
    // getMarkerAtが関数として存在するか確認
    const fn = useGame.getState().getMarkerAt
    expect(typeof fn).toBe('function')
    
    // 初期位置にマーカーが存在することを確認
    const found = fn(0,0)
    expect(found).toBeTruthy()
    
    // 初期位置でない位置にマーカーが存在しないことを確認
    expect(fn(1,1)).toBeUndefined()
  })
})
