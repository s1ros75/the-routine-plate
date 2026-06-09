import { render, screen } from '@testing-library/react'
import MealCard from './MealCard'
import type { Meal } from '@/types'

const mockMeal: Meal = {
  id: 1,
  name: '鶏むね肉の照り焼き',
  meal_type: 'lunch',
  scheduled_at: '2024-01-01T12:00:00',
  protein_g: 30,
  sodium_g: 1.2,
  calories_kcal: 350,
}

describe('MealCard', () => {
  it('meal が null のとき「未設定」が表示される', () => {
    render(<MealCard meal={null} />)
    expect(screen.getByText('未設定')).toBeInTheDocument()
  })

  it('meal が null のとき + アイコンが表示される', () => {
    const { container } = render(<MealCard meal={null} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('loading のときスケルトンが表示される', () => {
    const { container } = render(<MealCard meal={null} loading={true} />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('food データがある場合にメニュー名が表示される', () => {
    render(<MealCard meal={mockMeal} />)
    expect(screen.getByText('鶏むね肉の照り焼き')).toBeInTheDocument()
  })

  it('タンパク質ラベルが表示される', () => {
    render(<MealCard meal={mockMeal} />)
    expect(screen.getByText('タンパク質')).toBeInTheDocument()
  })

  it('塩分ラベルが表示される', () => {
    render(<MealCard meal={mockMeal} />)
    expect(screen.getByText('塩分')).toBeInTheDocument()
  })

  it('タンパク質の値が表示される', () => {
    render(<MealCard meal={mockMeal} />)
    expect(screen.getByText('30')).toBeInTheDocument()
  })
})
