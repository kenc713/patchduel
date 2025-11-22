import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Board from '../src/components/Board'
import React from 'react'

describe('Board', () => {
  it('renders 64 cells', () => {
    render(<Board />)
    const cells = screen.getAllByRole('gridcell')
    // fallback: if role isn't present, count elements with class
    if (cells.length === 0) {
      const els = document.querySelectorAll('.cell')
      expect(els.length).toBe(64)
    } else {
      expect(cells.length).toBe(64)
    }
  })
})
