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

    // タイムマーカーを配置しようとするマスがボードの範囲外ならfalseを返却
    if (x < 0 || x > 7 || y < 0 || y > 7) return false

    // 指定のマスに既にマーカーが存在するか確認
    const exists = get().markers.find((m) => m.x === x && m.y === y)

    // 既に他プレイヤーのマーカーが存在する場合は配置できない
    if (exists && exists.playerId !== playerId) return false

    // 自分のマーカーを取得
    const ownIndex = get().markers.findIndex((m) => m.playerId === playerId)
    
      // 現在のアクティブプレイヤーのみが配置できるようにする
      if (playerId !== get().activePlayer) return false

    // 記録用のタイムスタンプを生成
    const ts = new Date().toISOString()

    // すでに自分のマーカーが存在する場合はin-placeで座標を更新する
    if (ownIndex >= 0) {
      let prev: TimeMarker | undefined
      set((s) => {
        
        // 変更前のマーカー情報を保存
        prev = s.markers[ownIndex]  
        
        // 全プレイヤーのマーカーを含むマーカー配列をコピー 
        const next = s.markers.slice()

        // 自分のマーカーの座標と配置日時を更新
        next[ownIndex] = { ...next[ownIndex], x, y, placedAt: ts }
        
        // 更新後のマーカー配列を返し、stateを更新
        return { markers: next }
      })
      
      // セッションストアに移動として記録（後方互換の optional フィールドを利用）
      if (prev) {
        useSession.getState().recordPlace(playerId, { markerId: prev.id, prevPosition: { x: prev.x, y: prev.y }, x, y, moved: true })
      }
      return true
    }

    // 新規配置（他プレイヤーによる占有は既に弾いている）
    if (exists && exists.playerId === playerId) return false
    const markerId = `m-${Date.now()}`
    set((s) => ({ markers: [...s.markers, { id: markerId, playerId, x, y, placedAt: ts }] }))
    // セッションストアに記録
    useSession.getState().recordPlace(playerId, { x, y, markerId })
    return true
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
