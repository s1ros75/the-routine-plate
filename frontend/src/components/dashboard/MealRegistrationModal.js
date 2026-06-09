import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2, Loader2, Calculator, Sparkles, Search } from 'lucide-react';
import NutritionProgressBar from '../nutrition/NutritionProgressBar';
import RecipeSuggestionsList from './RecipeSuggestionsList';
import RecipeConfirmStep from './RecipeConfirmStep';
const MEAL_TYPE_LABEL = {
    breakfast: '朝食',
    lunch: '昼食',
    dinner: '夕食',
};
const MEAL_TIME = {
    breakfast: '08:00:00',
    lunch: '12:00:00',
    dinner: '19:00:00',
};
// Ingredient の栄養素フィールドは string のため Number() で変換
function computeNutrition(entries, ingredients) {
    const raw = entries.reduce((acc, entry) => {
        const ing = ingredients.find(i => i.id === entry.ingredient_id);
        if (!ing)
            return acc;
        const r = entry.amount_g / 100;
        return {
            protein_g: acc.protein_g + Number(ing.protein_per_100g) * r,
            fat_g: acc.fat_g + Number(ing.fat_per_100g) * r,
            carbohydrate_g: acc.carbohydrate_g + Number(ing.carbohydrate_per_100g) * r,
            sodium_g: acc.sodium_g + Number(ing.sodium_per_100g) * r,
            calories_kcal: acc.calories_kcal + Number(ing.calories_per_100g) * r,
        };
    }, { protein_g: 0, fat_g: 0, carbohydrate_g: 0, sodium_g: 0, calories_kcal: 0 });
    return {
        protein_g: Math.round(raw.protein_g * 10) / 10,
        fat_g: Math.round(raw.fat_g * 10) / 10,
        carbohydrate_g: Math.round(raw.carbohydrate_g * 10) / 10,
        sodium_g: Math.round(raw.sodium_g * 100) / 100,
        calories_kcal: Math.round(raw.calories_kcal),
    };
}
function IngredientPickerStep({ ingredients, onSearchRecipes, onManual, }) {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [query, setQuery] = useState('');
    const filtered = ingredients.filter(ing => ing.name.includes(query));
    const toggle = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            }
            else {
                next.add(id);
            }
            return next;
        });
    };
    const selectedIngredients = ingredients.filter(ing => selectedIds.has(ing.id));
    return (_jsxs("div", { className: "space-y-4", children: [selectedIngredients.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1.5", children: selectedIngredients.map(ing => (_jsxs("button", { onClick: () => toggle(ing.id), className: "flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1\n                         rounded-full font-medium hover:bg-green-200 transition-colors", children: [ing.name, _jsx(X, { size: 10 })] }, ing.id))) })), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 13, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" }), _jsx("input", { type: "text", value: query, onChange: e => setQuery(e.target.value), placeholder: "\u98DF\u6750\u3092\u7D5E\u308A\u8FBC\u3080...", className: "w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl\n                     focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition" })] }), _jsx("div", { className: "max-h-48 overflow-y-auto space-y-1 pr-1", children: filtered.length === 0 ? (_jsx("p", { className: "text-xs text-gray-400 text-center py-4", children: "\u98DF\u6750\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093" })) : (filtered.map(ing => {
                    const selected = selectedIds.has(ing.id);
                    return (_jsxs("button", { onClick: () => toggle(ing.id), className: `w-full flex items-center justify-between text-sm px-3 py-2 rounded-xl
                            transition-colors text-left ${selected
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-gray-50 border border-transparent text-gray-700 hover:bg-gray-100'}`, children: [_jsx("span", { children: ing.name }), selected && (_jsx("span", { className: "w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx("svg", { viewBox: "0 0 10 10", className: "w-2.5 h-2.5 text-white fill-none stroke-white stroke-2", children: _jsx("polyline", { points: "2,5 4,7 8,3" }) }) }))] }, ing.id));
                })) }), _jsxs("div", { className: "flex gap-2 pt-1", children: [_jsx("button", { onClick: onManual, className: "flex-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200\n                     py-2.5 rounded-xl transition-colors", children: "\u81EA\u7531\u5165\u529B\u3067\u767B\u9332" }), _jsxs("button", { onClick: () => onSearchRecipes(Array.from(selectedIds)), disabled: selectedIds.size === 0, className: "flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold\n                     text-white bg-green-500 hover:bg-green-600 disabled:opacity-40\n                     py-2.5 rounded-xl transition-colors", children: [_jsx(Sparkles, { size: 14 }), "\u30EC\u30B7\u30D4\u3092\u63D0\u6848\u3059\u308B"] })] })] }));
}
function ManualEntryStep({ ingredients, onBack, onSave }) {
    const [mealName, setMealName] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [amountG, setAmountG] = useState('100');
    const [entries, setEntries] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const nutrition = useMemo(() => computeNutrition(entries, ingredients), [entries, ingredients]);
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
        setError(null);
    };
    const removeEntry = (idx) => setEntries(prev => prev.filter((_, i) => i !== idx));
    const handleSave = async () => {
        if (!mealName.trim()) {
            setError('メニュー名を入力してください');
            return;
        }
        if (entries.length === 0) {
            setError('食材を1つ以上追加してください');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await onSave({
                name: mealName.trim(),
                ingredients: entries.map(({ ingredient_id, amount_g }) => ({ ingredient_id, amount_g })),
            });
        }
        catch (err) {
            const e = err;
            const msg = e.response?.data?.errors?.join('、') ?? e.message ?? '保存に失敗しました';
            setError(msg);
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-semibold text-gray-600 mb-1.5", children: ["\u30E1\u30CB\u30E5\u30FC\u540D ", _jsx("span", { className: "text-red-400", children: "*" })] }), _jsx("input", { type: "text", value: mealName, onChange: e => setMealName(e.target.value), placeholder: "\u4F8B\uFF1A\u30B5\u30FC\u30E2\u30F3\u3068\u7384\u7C73\u306E\u30D8\u30EB\u30B7\u30FC\u5B9A\u98DF", className: "w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5\n                     focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition", autoFocus: true })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-semibold text-gray-600 mb-1.5", children: ["\u98DF\u6750\u3092\u8FFD\u52A0 ", _jsx("span", { className: "text-red-400", children: "*" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("select", { value: selectedId, onChange: e => setSelectedId(e.target.value), className: "flex-1 min-w-0 text-sm border border-gray-200 rounded-xl px-3 py-2\n                       bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 transition", children: [_jsx("option", { value: "", children: "\u98DF\u6750\u3092\u9078\u629E..." }), ingredients.map(ing => (_jsx("option", { value: ing.id, children: ing.name }, ing.id)))] }), _jsxs("div", { className: "relative flex-shrink-0", children: [_jsx("input", { type: "number", value: amountG, onChange: e => setAmountG(e.target.value), onKeyDown: e => e.key === 'Enter' && addEntry(), min: "1", max: "9999", className: "w-20 text-sm border border-gray-200 rounded-xl px-3 py-2 pr-6 text-right\n                         bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 transition" }), _jsx("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none", children: "g" })] }), _jsxs("button", { onClick: addEntry, disabled: !selectedId || Number(amountG) <= 0, className: "flex items-center gap-1 text-sm font-medium text-white bg-green-500\n                       hover:bg-green-600 disabled:opacity-40 px-3 py-2 rounded-xl transition-colors flex-shrink-0", children: [_jsx(Plus, { size: 14 }), "\u8FFD\u52A0"] })] }), entries.length > 0 && (_jsx("ul", { className: "mt-2 space-y-1.5", children: entries.map((entry, idx) => (_jsxs("li", { className: "flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2", children: [_jsx("span", { className: "text-sm text-gray-700 truncate mr-2", children: entry.name }), _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [_jsxs("span", { className: "text-sm font-semibold text-gray-800", children: [entry.amount_g, "g"] }), _jsx("button", { onClick: () => removeEntry(idx), className: "text-gray-300 hover:text-red-400 transition-colors", "aria-label": "\u524A\u9664", children: _jsx(Trash2, { size: 13 }) })] })] }, idx))) }))] }), entries.length > 0 && (_jsxs("div", { className: "bg-green-50 border border-green-100 rounded-xl p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Calculator, { size: 13, className: "text-green-600" }), _jsx("p", { className: "text-xs font-semibold text-green-700", children: "\u6804\u990A\u7D20\u30D7\u30EC\u30D3\u30E5\u30FC\uFF08\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\uFF09" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(NutritionProgressBar, { label: "\u30BF\u30F3\u30D1\u30AF\u8CEA", value: nutrition.protein_g, target: 20, colorType: "protein" }), _jsx(NutritionProgressBar, { label: "\u5869\u5206", value: nutrition.sodium_g, target: 2, colorType: "sodium" })] }), _jsx("div", { className: "grid grid-cols-3 gap-2 pt-1", children: [
                            { label: '脂質', value: `${nutrition.fat_g}g`, color: 'text-yellow-600' },
                            {
                                label: '炭水化物',
                                value: `${nutrition.carbohydrate_g}g`,
                                color: 'text-orange-500',
                            },
                            {
                                label: 'カロリー',
                                value: `${nutrition.calories_kcal}kcal`,
                                color: 'text-gray-700',
                            },
                        ].map(({ label, value, color }) => (_jsxs("div", { className: "bg-white rounded-lg p-2 text-center shadow-sm", children: [_jsx("p", { className: "text-[10px] text-gray-400", children: label }), _jsx("p", { className: `text-xs font-bold ${color}`, children: value })] }, label))) })] })), error && (_jsx("p", { className: "text-xs text-red-500 text-center bg-red-50 rounded-xl py-2", children: error })), _jsxs("div", { className: "flex gap-2 pt-1", children: [_jsx("button", { onClick: onBack, className: "flex-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200\n                     py-2.5 rounded-xl transition-colors", children: "\u623B\u308B" }), _jsx("button", { onClick: handleSave, disabled: saving, className: "flex-1 flex items-center justify-center gap-2 text-sm font-semibold\n                     text-white bg-green-500 hover:bg-green-600 disabled:opacity-60\n                     py-2.5 rounded-xl transition-colors", children: saving ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { size: 14, className: "animate-spin" }), "\u4FDD\u5B58\u4E2D..."] })) : ('保存') })] })] }));
}
function MealRegistrationModal({ day, mealType, ingredients, onClose, onSave }) {
    const [step, setStep] = useState('ingredients');
    const [selectedIngredientIds, setSelectedIngredientIds] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);
    const handleSearchRecipes = (ids) => {
        setSelectedIngredientIds(ids);
        setStep('recipes');
    };
    const handleSelectRecipe = (recipe) => {
        setSelectedRecipe(recipe);
        setStep('confirm');
    };
    const handleSaveFromManual = async ({ name, ingredients: ings, }) => {
        await onSave({
            name,
            meal_type: mealType,
            scheduled_at: `${day.fullDate}T${MEAL_TIME[mealType]}`,
            ingredients: ings,
        });
    };
    const handleSaveFromConfirm = async (mealData) => {
        await onSave(mealData);
    };
    const stepTitles = {
        ingredients: '食材を選ぶ',
        recipes: 'レシピ候補',
        confirm: '確認・保存',
        manual: '自由入力',
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto", onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-sm font-bold text-gray-800", children: [MEAL_TYPE_LABEL[mealType], "\u3092\u767B\u9332"] }), _jsxs("p", { className: "text-xs text-gray-400 mt-0.5", children: [day.date, "\uFF08", day.label, "\uFF09\u2014 ", stepTitles[step]] })] }), _jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "p-5", children: [step === 'ingredients' && (_jsx(IngredientPickerStep, { ingredients: ingredients, onSearchRecipes: handleSearchRecipes, onManual: () => setStep('manual') })), step === 'recipes' && (_jsx(RecipeSuggestionsList, { ingredientIds: selectedIngredientIds, onSelectRecipe: handleSelectRecipe, onBack: () => setStep('ingredients') })), step === 'confirm' && selectedRecipe && (_jsx(RecipeConfirmStep, { recipe: selectedRecipe, scheduledAt: `${day.fullDate}T${MEAL_TIME[mealType]}`, mealType: mealType, onSave: handleSaveFromConfirm, onBack: () => setStep('recipes') })), step === 'manual' && (_jsx(ManualEntryStep, { ingredients: ingredients, onBack: () => setStep('ingredients'), onSave: handleSaveFromManual }))] })] }) }));
}
export default MealRegistrationModal;
