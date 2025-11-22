import create from 'zustand'
import { TimeMarker } from '../models/timeMarker'

type State = {
  markers: TimeMarker[]
  placeMarker: (playerId: string, x: number, y: number) => boolean
  endTurn: (playerId: string) => void
  getBoard: () => TimeMarker[]
}

const useGame = create<State>((set, get) => ({
  markers: [
    {
      id: 'm-0',
      playerId: 'p1',
      x: 0,
      y: 0,
      placedAt: new Date().toISOString(),
    },
  ],
  placeMarker: (playerId, x, y) => {
    if (x < 0 || x > 7 || y < 0 || y > 7) return false
    const exists = get().markers.find((m) => m.x === x && m.y === y)
    if (exists) return false
    set((s) => ({ markers: [...s.markers, { id: `m-${Date.now()}`, playerId, x, y, placedAt: new Date().toISOString() }] }))
    return true
  },
  endTurn: (_playerId) => {
    // minimal implementation: no-op for now, could update state or record log
  },
  getBoard: () => get().markers,
}))

export default useGame
