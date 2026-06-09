import { render, screen } from '@testing-library/react'
import NutritionProgressBar from './NutritionProgressBar'

describe('NutritionProgressBar', () => {
  it('正しいラベルが表示される', () => {
    render(<NutritionProgressBar label="タンパク質" value={10} target={20} />)
    expect(screen.getByText('タンパク質')).toBeInTheDocument()
  })

  it('value と target に応じてパーセンテージが計算される', () => {
    render(<NutritionProgressBar label="タンパク質" value={10} target={20} />)
    const bar = document.querySelector('[style]') as HTMLElement
    expect(bar.style.width).toBe('50%')
  })

  it('value が target を超えた場合に 100% でキャップされる', () => {
    render(<NutritionProgressBar label="タンパク質" value={30} target={20} />)
    const bar = document.querySelector('[style]') as HTMLElement
    expect(bar.style.width).toBe('100%')
  })

  it('target が 0 の場合にクラッシュしない', () => {
    expect(() => {
      render(<NutritionProgressBar label="タンパク質" value={0} target={0} />)
    }).not.toThrow()
  })

  it('value と target の数値が表示される', () => {
    render(<NutritionProgressBar label="塩分" value={2} target={5} unit="g" />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})
