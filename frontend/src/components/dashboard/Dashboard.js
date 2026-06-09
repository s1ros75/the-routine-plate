import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from '../ui/Header';
import WeeklySummary from './WeeklySummary';
import WeeklyCalendar from './WeeklyCalendar';
import IngredientListPanel from './IngredientListPanel';
import NutritionCalculatorDemo from './NutritionCalculatorDemo';
import { useIngredients } from '../../hooks/useIngredients';
import { useWeeklySummary } from '../../hooks/useWeeklySummary';
function Dashboard() {
    const { data: ingredients, loading: ingredientsLoading, error: ingredientsError, retry, } = useIngredients();
    const { data: summary, loading: summaryLoading, refetch: refetchSummary } = useWeeklySummary();
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx(Header, {}), _jsxs("main", { className: "flex-1 w-full max-w-screen-xl mx-auto px-4 py-6 space-y-5", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-gray-800", children: "\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9" }), _jsx("p", { className: "text-sm text-gray-400 mt-0.5", children: "\u4ECA\u9031\u306E\u98DF\u4E8B\u30D7\u30E9\u30F3\u3068\u6804\u990A\u30D0\u30E9\u30F3\u30B9\u306E\u6982\u8981" })] }), _jsx(WeeklySummary, { summary: summary, loading: summaryLoading }), _jsx(WeeklyCalendar, { ingredients: ingredients, onRefetch: refetchSummary }), _jsx(IngredientListPanel, { ingredients: ingredients, loading: ingredientsLoading, error: ingredientsError, onRetry: retry }), _jsx(NutritionCalculatorDemo, { ingredients: ingredients, loading: ingredientsLoading })] })] }));
}
export default Dashboard;
