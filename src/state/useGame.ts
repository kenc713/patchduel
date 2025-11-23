import { create } from 'zustand'
import { TimeMarker } from '../models/timeMarker'
/**
 * Zustandを使ったグローバルステート管理
 */
type State = {

  // ゲームボード上の全てのタイムマーカー
  markers: TimeMarker[]

  // ボードにタイムマーカーを配置する関数
  placeMarker: (playerId: string, x: number, y: number) => boolean

  // ターンを終了する関数
  endTurn: (playerId: string) => void

  // タイムマーカーの配置状況を取得する関数
  getBoard: () => TimeMarker[]
  
  // 現在選択されたセル (UI 共有用)
  selected: { x: number; y: number } | null

  // 選択セルを設定する (nullで解除)
  setSelected: (pos: { x: number; y: number } | null) => void
}

/**
 * ZustandのuseGameフック
 */
const useGame = create<State>((set, get) => ({

  // 初期状態として1つのマーカーを配置
  markers: [
    {
      id: 'm-0',
      playerId: 'p1',
      x: 0,
      y: 0,
      placedAt: new Date().toISOString(),
    },
  ],

  // 選択は共有ステートとして保持（初期は未選択）
  selected: null,

  // ボードにタイムマーカーを配置する関数を定義
  placeMarker: (playerId, x, y) => {
    if (x < 0 || x > 7 || y < 0 || y > 7) return false
    const exists = get().markers.find((m) => m.x === x && m.y === y)
    if (exists) return false
    set((s) => ({ markers: [...s.markers, { id: `m-${Date.now()}`, playerId, x, y, placedAt: new Date().toISOString() }] }))
    return true
  },

  // ターンを終了する関数を定義（現状は最小限の実装）
  endTurn: (_playerId) => {
    // minimal implementation: no-op for now, could update state or record log
  },

  // 選択セルを設定
  setSelected: (pos) => set(() => ({ selected: pos })),

  // 配置されているマーカーを取得する関数を定義
  getBoard: () => get().markers,
}))

export default useGame
