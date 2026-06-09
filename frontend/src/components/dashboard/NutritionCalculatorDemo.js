import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Calculator, Plus, Trash2, Loader2 } from 'lucide-react';
import { calculateNutrition } from '../../api/meals';
import NutritionProgressBar from '../nutrition/NutritionProgressBar';
const PROTEIN_TARGET = 60; // g — 1食あたりの目安
const SODIUM_LIMIT = 2; // g — 1食あたりの上限目安
function NutritionCalculatorDemo({ ingredients, loading: ingredientsLoading }) {
    const [selectedId, setSelectedId] = useState('');
    const [amountG, setAmountG] = useState('100');
    const [entries, setEntries] = useState([]);
    const [result, setResult] = useState(null);
    const [calculating, setCalculating] = useState(false);
    const [calcError, setCalcError] = useState(null);
    const addEntry = () => {
        const id = Number(selectedId);
        const amount = Number(amountG);
        if (!id || !amount || amount <= 0)
            return;
        const ingredient = ingredients.find(i => i.id === id);
        if (!ingredient)
            return;
        setEntries(prev => [...prev, { ingredient_id: id, amount_g: amount, name: ingredient.name }]);
        setSelectedId('');
        setAmountG('100');
        setResult(null);
        setCalcError(null);
    };
    const removeEntry = (idx) => {
        setEntries(prev => prev.filter((_, i) => i !== idx));
        setResult(null);
        setCalcError(null);
    };
    const handleCalculate = async () => {
        if (entries.length === 0)
            return;
        setCalculating(true);
        setCalcError(null);
        setResult(null);
        try {
            const data = await calculateNutrition(entries.map(e => ({ ingredient_id: e.ingredient_id, amount_g: e.amount_g })));
            setResult(data.nutrition);
        }
        catch (err) {
            const e = err;
            setCalcError(e.response?.data?.error ?? e.message ?? '計算に失敗しました');
        }
        finally {
            setCalculating(false);
        }
    };
    return (_jsxs("section", { className: "bg-white rounded-2xl shadow-sm p-5 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center", children: _jsx(Calculator, { size: 16, className: "text-green-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-bold text-gray-800", children: "\u6804\u990A\u8A08\u7B97\u3092\u30C6\u30B9\u30C8\u3059\u308B" }), _jsx("p", { className: "text-xs text-gray-400", children: "\u98DF\u6750\u3068g\u6570\u3092\u7D44\u307F\u5408\u308F\u305B\u3066\u5408\u8A08\u6804\u990A\u7D20\u3092\u78BA\u8A8D" })] })] }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsxs("select", { value: selectedId, onChange: e => setSelectedId(e.target.value), disabled: ingredientsLoading || ingredients.length === 0, className: "flex-1 min-w-[160px] text-sm border border-gray-200 rounded-xl px-3 py-2\n                     bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300\n                     disabled:opacity-40 transition", children: [_jsx("option", { value: "", children: "\u98DF\u6750\u3092\u9078\u629E..." }), ingredients.map(ing => (_jsx("option", { value: ing.id, children: ing.name }, ing.id)))] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", value: amountG, onChange: e => setAmountG(e.target.value), onKeyDown: e => e.key === 'Enter' && addEntry(), min: "1", max: "9999", disabled: ingredientsLoading, className: "w-24 text-sm border border-gray-200 rounded-xl px-3 py-2 pr-7 text-right\n                       bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300\n                       disabled:opacity-40 transition" }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none", children: "g" })] }), _jsxs("button", { onClick: addEntry, disabled: !selectedId || !amountG || Number(amountG) <= 0 || ingredientsLoading, className: "flex items-center gap-1 text-sm font-medium text-white bg-green-500\n                     hover:bg-green-600 disabled:opacity-40 px-3 py-2 rounded-xl transition-colors", children: [_jsx(Plus, { size: 15 }), "\u8FFD\u52A0"] })] }), entries.length > 0 && (_jsx("ul", { className: "space-y-1.5", children: entries.map((entry, idx) => (_jsxs("li", { className: "flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2", children: [_jsx("span", { className: "text-sm text-gray-700", children: entry.name }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-sm font-semibold text-gray-800", children: [entry.amount_g, "g"] }), _jsx("button", { onClick: () => removeEntry(idx), className: "text-gray-300 hover:text-red-400 transition-colors", "aria-label": "\u524A\u9664", children: _jsx(Trash2, { size: 14 }) })] })] }, idx))) })), _jsx("button", { onClick: handleCalculate, disabled: entries.length === 0 || calculating, className: "w-full flex items-center justify-center gap-2 text-sm font-semibold\n                   text-white bg-green-500 hover:bg-green-600 disabled:opacity-40\n                   py-2.5 rounded-xl transition-colors", children: calculating ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { size: 16, className: "animate-spin" }), "\u8A08\u7B97\u4E2D..."] })) : (_jsxs(_Fragment, { children: [_jsx(Calculator, { size: 16 }), "\u5408\u8A08\u6804\u990A\u7D20\u3092\u8A08\u7B97\u3059\u308B"] })) }), calcError && _jsx("p", { className: "text-sm text-red-500 text-center", children: calcError }), result && (_jsxs("div", { className: "border border-green-100 bg-green-50 rounded-2xl p-4 space-y-4", children: [_jsx("p", { className: "text-xs font-semibold text-green-700", children: "\u8A08\u7B97\u7D50\u679C\uFF08\u5408\u8A08\uFF09" }), _jsxs("div", { className: "space-y-2.5", children: [_jsx(NutritionProgressBar, { label: "\u30BF\u30F3\u30D1\u30AF\u8CEA", value: result.protein_g, target: PROTEIN_TARGET, colorType: "protein" }), _jsx(NutritionProgressBar, { label: "\u5869\u5206", value: result.sodium_g, target: SODIUM_LIMIT, colorType: "sodium" })] }), _jsx("div", { className: "grid grid-cols-3 gap-2 pt-1", children: [
                            { label: '脂質', value: result.fat_g, unit: 'g', color: 'text-yellow-600' },
                            {
                                label: '炭水化物',
                                value: result.carbohydrate_g,
                                unit: 'g',
                                color: 'text-orange-500',
                            },
                            {
                                label: 'カロリー',
                                value: result.calories_kcal,
                                unit: 'kcal',
                                color: 'text-gray-700',
                            },
                        ].map(({ label, value, unit, color }) => (_jsxs("div", { className: "bg-white rounded-xl p-3 text-center shadow-sm", children: [_jsx("p", { className: "text-[10px] text-gray-400 mb-0.5", children: label }), _jsxs("p", { className: `text-sm font-bold ${color}`, children: [value, _jsx("span", { className: "text-[10px] font-normal text-gray-400 ml-0.5", children: unit })] })] }, label))) })] }))] }));
}
export default NutritionCalculatorDemo;
