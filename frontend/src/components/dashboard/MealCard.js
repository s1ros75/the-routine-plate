import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from 'lucide-react';
import NutritionProgressBar from '../nutrition/NutritionProgressBar';
import { MEAL_TARGETS } from '../../data/dummyMeals';
function MealCard({ meal, loading = false, onClick }) {
    if (loading) {
        return _jsx("div", { className: "w-full h-[100px] bg-gray-100 rounded-xl animate-pulse" });
    }
    if (!meal) {
        return (_jsxs("button", { onClick: onClick, className: "\n          w-full h-[100px] flex flex-col items-center justify-center gap-1\n          border border-dashed border-gray-200 rounded-xl\n          text-gray-300 text-xs\n          hover:border-green-300 hover:text-green-400 hover:bg-green-50/40\n          transition-all duration-200 cursor-pointer group\n        ", children: [_jsx(Plus, { size: 16, className: "transition-transform group-hover:scale-110" }), _jsx("span", { children: "\u672A\u8A2D\u5B9A" })] }));
    }
    return (_jsxs("div", { className: "\n      bg-white border border-gray-100 rounded-xl p-2.5\n      shadow-sm hover:shadow-md hover:-translate-y-px\n      transition-all duration-200 cursor-pointer\n    ", children: [_jsx("p", { className: "text-xs font-semibold text-gray-800 leading-snug line-clamp-2 mb-2.5", children: meal.name }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(NutritionProgressBar, { label: "\u30BF\u30F3\u30D1\u30AF\u8CEA", value: meal.protein_g, target: MEAL_TARGETS.protein_g, colorType: "protein" }), _jsx(NutritionProgressBar, { label: "\u5869\u5206", value: meal.sodium_g, target: MEAL_TARGETS.sodium_g, colorType: "sodium" })] })] }));
}
export default MealCard;
