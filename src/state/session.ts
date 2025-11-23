import { create } from 'zustand'

// セッションとして記録される1件分のレコードの型
type HistoryEntry = { type: 'place' | 'endTurn'; playerId: string; payload?: any; timestamp: string }

// セッションとして記録するデータモデルを定義
type SessionState = {
  sessionId: string
  startedAt: string
  activePlayer: string
  ended: boolean
  history: HistoryEntry[]

  initSession: (playerId: string, payload?: any) => void
  recordPlace: (playerId: string, payload: any) => void
  endTurn: (playerId: string) => boolean
}

// セッション用のzustandストアを作成
const useSession = create<SessionState>((set) => ({
  
  // フィールドの初期化    
  sessionId: '',
  startedAt: '',
  activePlayer: '',
  ended: false,
  history: [],
  
  // セッション初期化用の関数を定義
  initSession: (playerId, payload) => {
    const ts = new Date().toISOString()
    set(() => ({
      sessionId: `s-${Date.now()}`,
      startedAt: ts,
      activePlayer: playerId,
      ended: false,
      history: payload ? [{ type: 'place', playerId, payload, timestamp: ts }] : []
    }))
  },

  // マーカーの位置をセッションに記録　
  recordPlace: (playerId, payload) => {
    const ts = new Date().toISOString()
    set((s) => ({ history: [...s.history, { type: 'place', playerId, payload, timestamp: ts }] }))
  },

  // ターン終了をセッションに記録し、成功か否かを返却
  endTurn: (playerId) => {
    const ts = new Date().toISOString()
    set((s) => ({ history: [...s.history, { type: 'endTurn', playerId, timestamp: ts }] }))
    return true
  }
}))

export default useSession
