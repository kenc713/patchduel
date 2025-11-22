import React from 'react'
import useGame from '../state/useGame'

const SIZE = 8

export default function Board() {
  const board = useGame((s) => s.getBoard())

  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${SIZE}, 40px)` }}>
      {Array.from({ length: SIZE * SIZE }).map((_, i) => {
        const x = i % SIZE
        const y = Math.floor(i / SIZE)
        const marker = board.find((m) => m.x === x && m.y === y)
        return (
          <div key={`${x}-${y}`} className="cell" data-x={x} data-y={y}>
            {marker ? <div className="marker">●</div> : null}
          </div>
        )
      })}
    </div>
  )
}
