// Utilities for spiral index <-> coordinate mapping on an N x N board
export const BOARD_SIZE = 8;
export const GOAL_INDEX = BOARD_SIZE * BOARD_SIZE - 1;

export type Coord = { row: number; col: number };

// Generate spiral coordinates from outer to inner, clockwise
function generateSpiral(n = BOARD_SIZE): Coord[] {
  const coords: Coord[] = [];
  let top = 0,
    left = 0,
    bottom = n - 1,
    right = n - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) coords.push({ row: top, col: c });
    top++;
    for (let r = top; r <= bottom; r++) coords.push({ row: r, col: right });
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) coords.push({ row: bottom, col: c });
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) coords.push({ row: r, col: left });
      left++;
    }
  }
  return coords;
}

const SPIRAL = generateSpiral(BOARD_SIZE);

export function indexToCoord(index: number): Coord {
  return SPIRAL[index] ?? { row: 0, col: 0 };
}

export function coordToIndex(row: number, col: number): number {
  for (let i = 0; i < SPIRAL.length; i++) {
    const c = SPIRAL[i];
    if (c.row === row && c.col === col) return i;
  }
  return -1;
}

export function computeNewIndex(currentIndex: number, steps: number): number {
  if (!Number.isInteger(steps) || steps <= 0) return currentIndex;
  const target = Math.min(currentIndex + steps, GOAL_INDEX);
  return target;
}

export default {
  BOARD_SIZE,
  GOAL_INDEX,
  indexToCoord,
  coordToIndex,
  computeNewIndex,
};
