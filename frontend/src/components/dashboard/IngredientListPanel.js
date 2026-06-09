import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, RefreshCw, Beef } from 'lucide-react';
// Ingredient の栄養素フィールドは Rails decimal → string のため Number() で変換
const SORT_OPTIONS = [
    { key: 'name', label: '名前順', fn: (a, b) => a.name.localeCompare(b.name, 'ja') },
    {
        key: 'protein',
        label: 'タンパク質順',
        fn: (a, b) => Number(b.protein_per_100g) - Number(a.protein_per_100g),
    },
    {
        key: 'sodium',
        label: '塩分順',
        fn: (a, b) => Number(a.sodium_per_100g) - Number(b.sodium_per_100g),
    },
    {
        key: 'calories',
        label: 'カロリー順',
        fn: (a, b) => Number(b.calories_per_100g) - Number(a.calories_per_100g),
    },
];
const NutritionRow = ({ label, value, unit, valueClass }) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-gray-400", children: label }), _jsxs("span", { className: `text-xs font-semibold ${valueClass}`, children: [value, unit] })] }));
const SkeletonCard = () => (_jsxs("div", { className: "bg-white rounded-2xl p-4 shadow-sm animate-pulse space-y-3", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" }), _jsx("div", { className: "space-y-2 pt-1", children: Array.from({ length: 5 }).map((_, i) => (_jsxs("div", { className: "flex justify-between", children: [_jsx("div", { className: "h-3 bg-gray-200 rounded w-1/3" }), _jsx("div", { className: "h-3 bg-gray-200 rounded w-1/4" })] }, i))) })] }));
function IngredientListPanel({ ingredients, loading, error, onRetry }) {
    const [query, setQuery] = useState('');
    const [sortKey, setSortKey] = useState('name');
    const currentSort = SORT_OPTIONS.find(o => o.key === sortKey) ?? SORT_OPTIONS[0];
    const filtered = ingredients.filter(ing => ing.name.includes(query)).sort(currentSort.fn);
    return (_jsxs("section", { className: "bg-white rounded-2xl shadow-sm overflow-hidden", children: [_jsxs("div", { className: "px-5 pt-5 pb-4 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0", children: _jsx(Beef, { size: 16, className: "text-green-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-bold text-gray-800", children: "\u767B\u9332\u98DF\u6750\u4E00\u89A7" }), _jsx("p", { className: "text-xs text-gray-400", children: "100g \u3042\u305F\u308A\u306E\u6804\u990A\u7D20" })] })] }), !loading && !error && (_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("div", { className: "relative flex-1 min-w-[160px] max-w-xs", children: [_jsx(Search, { size: 13, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" }), _jsx("input", { type: "text", value: query, onChange: e => setQuery(e.target.value), placeholder: "\u98DF\u6750\u3092\u691C\u7D22...", className: "w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-100 rounded-xl\n                           focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition" })] }), _jsx("div", { className: "flex gap-1 flex-wrap", children: SORT_OPTIONS.map(opt => (_jsx("button", { onClick: () => setSortKey(opt.key), className: `text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${sortKey === opt.key
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`, children: opt.label }, opt.key))) })] }))] }), _jsxs("div", { className: "px-5 pb-5", children: [loading && (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: Array.from({ length: 6 }).map((_, i) => (_jsx(SkeletonCard, {}, i))) })), !loading && error && (_jsxs("div", { className: "flex flex-col items-center gap-3 py-10", children: [_jsx("p", { className: "text-sm text-red-500", children: error }), _jsxs("button", { onClick: onRetry, className: "flex items-center gap-1.5 text-sm font-medium text-white\n                         bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl transition-colors", children: [_jsx(RefreshCw, { size: 14 }), "\u518D\u8A66\u884C"] })] })), !loading && !error && (_jsxs(_Fragment, { children: [filtered.length === 0 ? (_jsxs("p", { className: "text-sm text-gray-400 text-center py-10", children: ["\u300C", query, "\u300D\u306B\u4E00\u81F4\u3059\u308B\u98DF\u6750\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093"] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: filtered.map(ing => (_jsxs("div", { className: "bg-gray-50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2.5", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("span", { className: "text-sm font-bold text-gray-800 leading-snug", children: ing.name }), Number(ing.sodium_per_100g) === 0 && (_jsx("span", { className: "flex-shrink-0 text-[10px] font-semibold text-green-600\n                                         bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap", children: "\u5869\u5206\u30BC\u30ED" }))] }), _jsxs("div", { className: "space-y-1.5 border-t border-gray-100 pt-2.5", children: [_jsx(NutritionRow, { label: "\u30BF\u30F3\u30D1\u30AF\u8CEA", value: ing.protein_per_100g, unit: "g", valueClass: "text-green-600" }), _jsx(NutritionRow, { label: "\u8102\u8CEA", value: ing.fat_per_100g, unit: "g", valueClass: "text-yellow-600" }), _jsx(NutritionRow, { label: "\u70AD\u6C34\u5316\u7269", value: ing.carbohydrate_per_100g, unit: "g", valueClass: "text-orange-500" }), _jsx(NutritionRow, { label: "\u5869\u5206", value: ing.sodium_per_100g, unit: "g", valueClass: Number(ing.sodium_per_100g) === 0 ? 'text-green-500' : 'text-sky-600' }), _jsx(NutritionRow, { label: "\u30AB\u30ED\u30EA\u30FC", value: ing.calories_per_100g, unit: "kcal", valueClass: "text-gray-700" })] })] }, ing.id))) })), _jsxs("p", { className: "text-[10px] text-gray-300 text-right mt-3", children: [filtered.length, " / ", ingredients.length, " \u54C1\u76EE"] })] }))] })] }));
}
export default IngredientListPanel;
