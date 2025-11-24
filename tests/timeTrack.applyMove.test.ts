import { describe, it, expect, beforeEach } from 'vitest'
import useGame from '../src/state/useGame'
import { GOAL_INDEX } from '../src/models/timeMarkerUtils'
// Note: timeTrack module and eventBus will be implemented; these tests assert their contracts.

describe('TimeTrack applyMove integration', () => {
  beforeEach(() => {
    // reset minimal game state: ensure any timeMarkers state is cleared if present
    // we assume implementation will create/use `setTimeMarkers` or similar; if not, tests will fail as expected (TDD RED)
    const s = useGame.getState()
    if ((s as any).setTimeMarkers) {
      ;(s as any).setTimeMarkers([])
    }
  })

  it('applyMove updates store and emits timeMarkerMoved', async () => {
    // subscribe to events
    const events: any[] = []
    const evt = await import('../src/state/eventBus')
    const unsubscribe = evt.eventBus.subscribe('timeMarkerMoved', (p: any) => events.push(p))

    const tt = await import('../src/models/timeTrack')

    // call applyMove for player p1 by 5 steps
    const res = await tt.applyMove('p1', 5)

    // result shape
    expect(res).toHaveProperty('playerId', 'p1')
    expect(res).toHaveProperty('previousIndex')
    expect(res).toHaveProperty('resultingIndex')
    expect(res.resultingIndex).toBe(Math.min(res.previousIndex + 5, GOAL_INDEX))

    // event emitted
    expect(events.length).toBeGreaterThan(0)
    const ev = events[0]
    expect(ev.playerId).toBe('p1')
    expect(ev.resultingIndex).toBe(res.resultingIndex)

    unsubscribe()
  })

  it('applyMove caps at GOAL_INDEX and emits gameEnded', async () => {
    const events: any[] = []
    const evt = await import('../src/state/eventBus')
    const unsub1 = evt.eventBus.subscribe('timeMarkerMoved', (p: any) => events.push(['moved', p]))
    const unsub2 = evt.eventBus.subscribe('gameEnded', (p: any) => events.push(['ended', p]))

    const tt = await import('../src/models/timeTrack')

    // set player's index near goal if helper exists
    const s = useGame.getState() as any
    if (s.setTimeMarkerIndex) {
      s.setTimeMarkerIndex('p1', GOAL_INDEX - 2)
    }

    const res = await tt.applyMove('p1', 10)

    expect(res.resultingIndex).toBe(GOAL_INDEX)

    // ensure both moved and ended events were emitted
    const hasEnded = events.some((e) => e[0] === 'ended')
    const hasMoved = events.some((e) => e[0] === 'moved')
    expect(hasMoved).toBe(true)
    expect(hasEnded).toBe(true)

    unsub1(); unsub2()
  })
})
