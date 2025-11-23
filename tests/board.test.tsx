import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Board from '../src/components/Board'
import React from 'react'

/**
 * ボードが正しく描画されていることを確認
 */
describe('Board', () => {
  it('renders 64 cells', () => {
    
    // ボードを描画
    render(<Board />)
    
    // セルを取得
    // gridcell roleを持つ（グリッドセルとしての機能を持つ）要素を取得
    const cells = screen.getAllByRole('gridcell')

    if (cells.length === 0) {
      // cellsが取得できない場合は、.cellクラスの要素を取得
      const els = document.querySelectorAll('.cell')

      // .cellクラスの要素が64個あることを検証
      expect(els.length).toBe(64)

    } else {

      // gridcell roleを持つ要素が64個あることを検証
      expect(cells.length).toBe(64)
    }
  })
})
