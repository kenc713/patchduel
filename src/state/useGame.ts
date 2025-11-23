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
  
  // 指定座標のマーカーを返すヘルパー
  getMarkerAt: (x: number, y: number) => TimeMarker | undefined
  
  // 現在選択されたセル (UI 共有用)
  selected: { x: number; y: number } | null

  // 選択セルを設定する (nullで解除)
  setSelected: (pos: { x: number; y: number } | null) => void
  
  // アクティブプレイヤーID（UIがどのプレイヤーとして操作するか）
  activePlayer: string
  setActivePlayer: (id: string) => void
  
  // セッション初期化用: 単一プレイヤーセッションを初期化する
  initSession: (playerId: string) => void
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

  // 初期のアクティブプレイヤー（UIの操作主体）。デフォルトは 'p2' とする。
  activePlayer: 'p2',
  setActivePlayer: (id) => set(() => ({ activePlayer: id })),

  // セッション初期化: 単一プレイヤーセッションを初期化し、(0,0) に初期マーカーを配置する
  initSession: (playerId: string) => {
    set(() => ({
      markers: [
        { id: `m-init-${Date.now()}`, playerId, x: 0, y: 0, placedAt: new Date().toISOString() }
      ],
      activePlayer: playerId,
      selected: null
    }))
  },

  // ボードにタイムマーカーを配置する関数を定義
  placeMarker: (playerId, x, y) => {
    if (x < 0 || x > 7 || y < 0 || y > 7) return false
    const exists = get().markers.find((m) => m.x === x && m.y === y)
    if (exists) return false
    // 各プレイヤーは1つのみマーカーを持つ不変条件を強制
    const own = get().markers.find((m) => m.playerId === playerId)
    if (own) return false
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

  // 指定座標のマーカーを返すヘルパー関数を定義
  getMarkerAt: (x, y) => get().markers.find(m => m.x === x && m.y === y),
}))

export default useGame
