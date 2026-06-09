import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import DayColumn from './DayColumn';
import MealRegistrationModal from './MealRegistrationModal';
import { getMeals, createMeal } from '../../api/meals';
// 指定週オフセットの月〜日を生成
function getWeekDays(offset = 0) {
    const today = new Date();
    const dow = today.getDay(); // 0=日〜6=土
    const toMon = dow === 0 ? -6 : 1 - dow; // 今週月曜への差分
    const monday = new Date(today);
    monday.setDate(today.getDate() + toMon + offset * 7);
    const LABELS = ['月', '火', '水', '木', '金', '土', '日'];
    const KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    return LABELS.map((label, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const mm = d.getMonth() + 1;
        const dd = d.getDate();
        const yyyy = d.getFullYear();
        return {
            key: KEYS[i],
            label,
            date: `${mm}/${dd}`,
            fullDate: `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`,
            isToday: d.toDateString() === today.toDateString(),
        };
    });
}
function getWeekLabel(days) {
    const d = new Date(days[0].fullDate);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const weekOfMonth = Math.ceil(d.getDate() / 7);
    return `${year}年${month}月 第${weekOfMonth}週`;
}
function WeeklyCalendar({ ingredients = [], onRefetch }) {
    const [weekOffset, setWeekOffset] = useState(0);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState(null);
    const days = getWeekDays(weekOffset);
    const fetchMeals = useCallback(async () => {
        try {
            const data = await getMeals();
            setMeals(data);
        }
        catch (err) {
            console.error('[WeeklyCalendar] meals fetch failed:', err);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchMeals();
    }, [fetchMeals]);
    const getMealForSlot = (fullDate, mealType) => meals.find(m => m.scheduled_at?.slice(0, 10) === fullDate && m.meal_type === mealType) ?? null;
    const handleOpenModal = (day, mealType) => setModalState({ day, mealType });
    const handleCloseModal = () => setModalState(null);
    const handleSaveMeal = async (mealData) => {
        await createMeal(mealData); // throws on error → caught by Modal
        await fetchMeals();
        onRefetch?.();
        setModalState(null);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "bg-white rounded-2xl shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-gray-50", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CalendarDays, { size: 18, className: "text-green-500" }), _jsx("h2", { className: "text-sm font-bold text-gray-700", children: "\u9031\u9593\u30E1\u30CB\u30E5\u30FC" })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-xs text-gray-500 mr-2", children: getWeekLabel(days) }), _jsx("button", { onClick: () => setWeekOffset(o => o - 1), className: "p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors", children: _jsx(ChevronLeft, { size: 16 }) }), _jsx("button", { onClick: () => setWeekOffset(0), className: "px-3 py-1 rounded-lg text-xs text-green-600 font-medium bg-green-50 hover:bg-green-100 transition-colors", children: "\u4ECA\u9031" }), _jsx("button", { onClick: () => setWeekOffset(o => o + 1), className: "p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors", children: _jsx(ChevronRight, { size: 16 }) })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsx("div", { className: "grid grid-cols-7 gap-3 p-4 min-w-[700px]", children: days.map(day => (_jsx(DayColumn, { day: day, meals: {
                                    breakfast: getMealForSlot(day.fullDate, 'breakfast'),
                                    lunch: getMealForSlot(day.fullDate, 'lunch'),
                                    dinner: getMealForSlot(day.fullDate, 'dinner'),
                                }, loading: loading, onAddMeal: mealType => handleOpenModal(day, mealType) }, day.key))) }) }), _jsxs("div", { className: "px-5 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1", children: [_jsx("span", { className: "text-[11px] text-gray-400", children: "\u30D7\u30ED\u30B0\u30EC\u30B9\u30D0\u30FC\u306E\u898B\u65B9:" }), [
                                { color: 'bg-green-500', label: 'タンパク質 達成' },
                                { color: 'bg-green-400', label: '塩分 低め' },
                                { color: 'bg-yellow-400', label: '塩分 注意' },
                                { color: 'bg-red-400', label: '塩分 超過' },
                            ].map(item => (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: `w-3 h-1.5 rounded-full inline-block ${item.color}` }), _jsx("span", { className: "text-[11px] text-gray-400", children: item.label })] }, item.label)))] })] }), modalState && (_jsx(MealRegistrationModal, { day: modalState.day, mealType: modalState.mealType, ingredients: ingredients, onClose: handleCloseModal, onSave: handleSaveMeal }))] }));
}
export default WeeklyCalendar;
