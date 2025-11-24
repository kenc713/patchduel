import { create } from 'zustand'
import { TimeMarker } from '../models/timeMarker'
import useSession from './session'
/**
 * Zustandを使ったグローバルステート管理
 */
type State = {

  // ゲームボード上の全てのタイムマーカー
  markers: TimeMarker[]

  // ボードにタイムマーカーを配置する関数
  placeMarker: (playerId: string, x: number, y: number) => boolean

  // ターンを終了する関数
  endTurn: (playerId: string) => boolean

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
    const markerId = `m-init-${Date.now()}`
    const now = new Date().toISOString()
    // set markers and active player
    set(() => ({
      markers: [
        { id: markerId, playerId, x: 0, y: 0, placedAt: now }
      ],
      activePlayer: playerId,
      selected: null,
    }))
    // delegate session metadata to useSession
    useSession.getState().initSession(playerId, { x: 0, y: 0, markerId })
  },

  // ボードにタイムマーカーを配置する関数を定義
  placeMarker: (playerId, x, y) => {
    
    let success = false
    let sessionPayload: any = null
    
    // 状態更新処理をすべて single updater 内で行うことで、操作を atomic に保証する
    set((s) => {
      
      // 指定の座標がボード範囲内であることを確認
      if (x < 0 || x > 7 || y < 0 || y > 7) return s

      // ターンチェック: アクティブプレイヤーのみ配置可能
      if (playerId !== s.activePlayer) return s

      // 他のプレイヤーが占有しているセルには置けない
      const existsIndex = s.markers.findIndex((m) => m.x === x && m.y === y)
      const exists = existsIndex >= 0 ? s.markers[existsIndex] : undefined
      if (exists && exists.playerId !== playerId) return s

      // 自分のマーカーが既に存在するか確認
      const ownIndex = s.markers.findIndex((m) => m.playerId === playerId)

      // 記録用のタイムスタンプを生成
      const ts = new Date().toISOString()

      if (ownIndex >= 0) {
        // 既存のマーカーをインプレースで移動
        const prev = s.markers[ownIndex]
        const next = s.markers.slice()
        next[ownIndex] = { ...next[ownIndex], x, y, placedAt: ts }
        sessionPayload = { markerId: prev.id, prevPosition: { x: prev.x, y: prev.y }, x, y, moved: true }
        success = true
        return { markers: next }
      }

      // 新規配置は上の移動処理が実行されなかった場合のみ行う
      else if (!exists) {
        const markerId = `m-${Date.now()}`
        sessionPayload = { x, y, markerId }
        success = true
        return { markers: [...s.markers, { id: markerId, playerId, x, y, placedAt: ts }] }
      }

      // fallback: no change
      return s
    })

    if (success && sessionPayload) {
      useSession.getState().recordPlace(playerId, sessionPayload)
    }
    return success
  },

  // ターンを終了する関数を定義（現状は最小限の実装）
  endTurn: (playerId) => {
    // delegate to session store
    return useSession.getState().endTurn(playerId)
  },

  // 選択セルを設定
  setSelected: (pos) => set(() => ({ selected: pos })),

  // 配置されているマーカーを取得する関数を定義
  getBoard: () => get().markers,

  // 指定座標のマーカーを返すヘルパー関数を定義
  getMarkerAt: (x, y) => get().markers.find(m => m.x === x && m.y === y),
}))

export default useGame
