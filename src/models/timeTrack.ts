import timeMarker from './timeMarkerUtils'
import useGame from '../state/useGame'
import { eventBus } from '../state/eventBus'

export type MoveResult = {
  playerId: string
  previousIndex: number
  stepsMoved: number
  resultingIndex: number
  goalReached: boolean
}

/**
 * 
 * @param playerId 
 * @param steps 
 * @returns 
 */
export async function applyMove(playerId: string, steps: number): Promise<MoveResult> {
  
  // 引数チェック  
  if (!Number.isInteger(steps)) throw new TypeError('steps must be integer')
  if (steps <= 0) throw new RangeError('steps must be positive')

  // 現在のグローバル状態を取得
  const store: any = useGame.getState()

  // playerIdのタイムマーカーの現在のインデックスと、移動先の新しいインデックスを計算
  const prevIndex = store.getTimeMarkerIndex?.(playerId) ?? 0
  const newIndex = timeMarker.computeNewIndex(prevIndex, steps)

  // タイムマーカーのインデックスを更新
  if (store.setTimeMarkerIndex) {
    // 専用のセッターがあればそれを使う
    store.setTimeMarkerIndex(playerId, newIndex)
    // ボード上のマーカー座標も更新する（UI 表示用）
    try {
      
      // 新たなインデックスから移動先の座標を計算
      const coord = timeMarker.indexToCoord(newIndex)

      // グローバル状態を更新
      useGame.setState((s: any) => {
        const next = s.markers ? s.markers.slice() : []

        // 自分のいる位置をインデックスで取得
        const mi = next.findIndex((m: any) => m.playerId === playerId)

        const ts = new Date().toISOString()

        // 自分のマーカー更新を反映したマーカー配列nextを返却
        if (mi >= 0) next[mi] = { ...next[mi], x: coord.col, y: coord.row, placedAt: ts }
        else next.push({ id: `m-${Date.now()}`, playerId, x: coord.col, y: coord.row, placedAt: ts })
        return { markers: next }
      })
    } catch (e) {
      // indexToCoord may throw if out of range; swallow here for robustness
    }
  } else {
    // セッターがなければ timeMarkers 配列を直接更新
    
    // timeMarkers 配列のコピーを作成
    const tm = store.timeMarkers ? store.timeMarkers.slice() : []

    // playerId に対応するタイムマーカーのindexを検索
    const i = tm.findIndex((t: any) => t.playerId === playerId)

    // インデックスが見つかったら既存データを更新、見つからなければ新規追加
    if (i >= 0) tm[i] = { ...tm[i], index: newIndex }
    else tm.push({ playerId, index: newIndex })

    // グローバル状態を更新
    useGame.setState({ timeMarkers: tm })
  }

  const stepsMoved = newIndex - prevIndex
  const goalReached = newIndex === timeMarker.GOAL_INDEX
  const payload = { playerId, previousIndex: prevIndex, stepsMoved, resultingIndex: newIndex }

  // タイムマーカー移動イベントを発行
  eventBus.publish('timeMarkerMoved', payload)
  
  // ゴール到達イベントを発行
  if (goalReached) {
    eventBus.publish('gameEnded', { winnerPlayerId: playerId, reason: 'goal-reached', finalIndex: newIndex })
  }

  return {
    playerId,
    previousIndex: prevIndex,
    stepsMoved,
    resultingIndex: newIndex,
    goalReached,
  }
}

export default { applyMove }
