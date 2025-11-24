export const BOARD_SIZE = 8
export const GOAL_INDEX = BOARD_SIZE * BOARD_SIZE - 1 // 63

/**
 * 
 * @param size 
 * @returns スパイラルで訪問する順番に、座標を格納する配列
 */
export function generateSpiralCoords(size = BOARD_SIZE) {

  // rowとcolをメンバにもつオブジェクトの配列
  // スパイラルで訪問する順番に、座標を格納する
  const res: { row: number; col: number }[] = []

  // 訪問済みマスの管理用2次元配列
  const visited = Array.from({ length: size }, () => Array(size).fill(false))

  // 進行方向のベクトル配列
  const dirs = [ [0,1], [1,0], [0,-1], [-1,0] ] // 右, 下, 左, 上

  // 現在の方向インデックス、現在位置
  let dir = 0
  let r = 0, c = 0

  for (let step = 0; step < size * size; step++) {
    
    // 今いる座標を記録
    res.push({ row: r, col: c })
    visited[r][c] = true

    // 現在の方向に1マス進んだ先の座標を計算
    const nr = r + dirs[dir][0]
    const nc = c + dirs[dir][1]

    if (nr < 0 || nr >= size || nc < 0 || nc >= size || visited[nr][nc]) {
      // 進もうとした先が範囲外または既訪問なら方向転換
      dir = (dir + 1) % 4
      r += dirs[dir][0]
      c += dirs[dir][1]
    } else {
      // 進もうとした先が有効ならそのまま進む
      r = nr
      c = nc
    }
  }
  return res
}

/**
 * 指定された `indexToCoord` 配列とサイズから、row,col -> index の変換テーブルを生成する。
 * @param indexToCoord インデックス順に並んだ座標配列
 * @param size ボードの一辺の長さ
 * @returns size x size の 2 次元配列、未割当は -1
 */
function createCoordToIndexMapFrom(indexToCoord: { row: number; col: number }[], size: number): number[][] {
  const map: number[][] = Array.from({ length: size }, () => Array(size).fill(-1))
  for (let i = 0; i < indexToCoord.length; i++) {
    const { row, col } = indexToCoord[i]
    map[row][col] = i
  }
  return map
}

/**
 * TimeMarker に関するユーティリティをサイズ指定で生成するファクトリ。
 * これを使えば別サイズのボードやテスト用インスタンスを作成できます。
 * @param size ボードの一辺の長さ
 */
export function createTimeMarkerUtils(size = BOARD_SIZE) {
  const indexToCoordInst = generateSpiralCoords(size)
  const coordToIndexInst = createCoordToIndexMapFrom(indexToCoordInst, size)
  const goalIndexInst = size * size - 1

  /**
   * タイムトラックの1次元インデックスを2次元座標に変換する関数
   * @param index 
   * @returns indexに対応する{ row, col }
   */
  function indexToCoordLocal(index: number) {
    if (!Number.isInteger(index)) throw new TypeError(
      `index must be an integer, got ${index}`
    )
    if (index < 0 || index >= size * size) throw new RangeError(
      'index out of range: ' + index +
        ` (expected 0..${size * size - 1})`
    )
    return indexToCoordInst[index]
  }

  /**
   * タイムトラックの2次元座標を1次元インデックスに変換する関数
   * @param row 
   * @param col 
   * @returns rowとcolに対応する1次元インデックス
   */
  function coordToIndexLocal(row: number, col: number) {
    if (!Number.isInteger(row) || !Number.isInteger(col)) throw new TypeError(
      'row and col must be integers: ' +
        `row=${row}, col=${col}`
    )
    if (row < 0 || row >= size || col < 0 || col >= size) throw new RangeError(
      'coords out of range: ' +
        `row=${row}, col=${col} (expected 0..${size - 1})`
    )
    const idx = coordToIndexInst[row][col]
    if (idx === -1 || idx === undefined) throw new RangeError(
      'coords not mapped to an index: ' +
        `row=${row}, col=${col}`
    )
    return idx
  }

  /**
   * タイムトラック上で、現在のマスと次に進むマスの数から、到達するマスの1次元インデックスを計算する関数
   * @param currentIndex 
   * @param steps 
   * @returns currentIndexが指す現在のマスからsteps進んだ先の1次元インデックス
   */
  function computeNewIndexLocal(currentIndex: number, steps: number) {
    if (!Number.isInteger(currentIndex) || !Number.isInteger(steps)) throw new TypeError(
      'currentIndex and steps must be integers: ' +
        `currentIndex=${currentIndex}, steps=${steps}`
    )
    if (steps < 0) throw new RangeError('negative steps not allowed: ' + steps)
    const target = currentIndex + steps
    return Math.min(target, goalIndexInst)
  }

  return {
    BOARD_SIZE: size,
    GOAL_INDEX: goalIndexInst,
    indexToCoord: indexToCoordLocal,
    coordToIndex: coordToIndexLocal,
    computeNewIndex: computeNewIndexLocal,
  }
}

/**
 * タイムトラックの1次元インデックスを2次元座標に変換する関数
 * @param index 
 * @returns indexに対応する{ row, col }
 */
// デフォルトインスタンスを作成して既存 API を提供する
export const timeMarker = createTimeMarkerUtils()

// モジュールのデフォルトエクスポートはデフォルトの timeMarker とする
export default timeMarker
