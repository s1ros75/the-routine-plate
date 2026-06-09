import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
function RecipeConfirmStep({ recipe, scheduledAt, mealType, onSave, onBack }) {
    const [mealName, setMealName] = useState(recipe.name);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const { nutrition } = recipe;
    const handleSave = async () => {
        if (!mealName.trim()) {
            setError('メニュー名を入力してください');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await onSave({
                name: mealName.trim(),
                meal_type: mealType,
                scheduled_at: scheduledAt,
                ingredients: recipe.ingredients.map(ing => ({
                    ingredient_id: ing.id,
                    amount_g: ing.amount_g,
                })),
            });
        }
        catch (err) {
            const e = err;
            const msg = e.response?.data?.errors?.join('、') ?? e.message ?? '保存に失敗しました';
            setError(msg);
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: onBack, className: "p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors", children: _jsx(ArrowLeft, { size: 16 }) }), _jsx("h3", { className: "text-sm font-bold text-gray-800", children: "\u78BA\u8A8D\u30FB\u4FDD\u5B58" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-semibold text-gray-600 mb-1.5", children: ["\u30E1\u30CB\u30E5\u30FC\u540D ", _jsx("span", { className: "text-red-400", children: "*" })] }), _jsx("input", { type: "text", value: mealName, onChange: e => setMealName(e.target.value), className: "w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5\n                     focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition", autoFocus: true })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-600 mb-1.5", children: "\u542B\u307E\u308C\u308B\u98DF\u6750" }), _jsx("ul", { className: "space-y-1.5", children: recipe.ingredients.map(ing => (_jsxs("li", { className: "flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2", children: [_jsx("span", { className: "text-sm text-gray-700", children: ing.name }), _jsxs("span", { className: "text-sm font-semibold text-gray-800", children: [ing.amount_g, "g"] })] }, ing.id))) })] }), _jsxs("div", { className: "bg-green-50 border border-green-100 rounded-xl p-3", children: [_jsx("p", { className: "text-xs font-semibold text-green-700 mb-2", children: "\u5408\u8A08\u6804\u990A\u7D20" }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsxs("div", { className: "bg-white rounded-lg p-2 text-center shadow-sm", children: [_jsx("p", { className: "text-[10px] text-gray-400", children: "\u30BF\u30F3\u30D1\u30AF\u8CEA" }), _jsxs("p", { className: "text-xs font-bold text-green-600", children: [nutrition.protein_g, "g"] })] }), _jsxs("div", { className: "bg-white rounded-lg p-2 text-center shadow-sm", children: [_jsx("p", { className: "text-[10px] text-gray-400", children: "\u5869\u5206" }), _jsxs("p", { className: "text-xs font-bold text-blue-600", children: [nutrition.sodium_g, "g"] })] }), _jsxs("div", { className: "bg-white rounded-lg p-2 text-center shadow-sm", children: [_jsx("p", { className: "text-[10px] text-gray-400", children: "\u30AB\u30ED\u30EA\u30FC" }), _jsxs("p", { className: "text-xs font-bold text-gray-700", children: [nutrition.calories_kcal, "kcal"] })] })] })] }), error && (_jsx("p", { className: "text-xs text-red-500 text-center bg-red-50 rounded-xl py-2", children: error })), _jsxs("div", { className: "flex gap-2 pt-1", children: [_jsx("button", { onClick: onBack, className: "flex-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200\n                     py-2.5 rounded-xl transition-colors", children: "\u623B\u308B" }), _jsx("button", { onClick: handleSave, disabled: saving, className: "flex-1 flex items-center justify-center gap-2 text-sm font-semibold\n                     text-white bg-green-500 hover:bg-green-600 disabled:opacity-60\n                     py-2.5 rounded-xl transition-colors", children: saving ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { size: 14, className: "animate-spin" }), "\u4FDD\u5B58\u4E2D..."] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { size: 14 }), "\u4FDD\u5B58\u3059\u308B"] })) })] })] }));
}
export default RecipeConfirmStep;
