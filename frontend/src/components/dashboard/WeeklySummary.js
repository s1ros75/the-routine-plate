import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dumbbell, Droplets, CheckCircle2 } from 'lucide-react';
function StatCard({ icon: Icon, label, value, sub, accent, textAccent, badge }) {
    return (_jsxs("div", { className: "bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow", children: [_jsx("div", { className: `w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`, children: _jsx(Icon, { size: 22, className: "text-white" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-xs text-gray-400 truncate", children: label }), _jsx("p", { className: `text-xl font-bold leading-tight ${textAccent ?? 'text-gray-800'}`, children: value }), sub && _jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: sub })] }), badge && (_jsx("span", { className: `ml-auto text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${badge.style}`, children: badge.label }))] }));
}
function SkeletonCard() {
    return (_jsxs("div", { className: "bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-pulse", children: [_jsx("div", { className: "w-11 h-11 rounded-xl bg-gray-200 flex-shrink-0" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx("div", { className: "h-3 bg-gray-200 rounded w-1/2" }), _jsx("div", { className: "h-6 bg-gray-200 rounded w-1/3" }), _jsx("div", { className: "h-3 bg-gray-200 rounded w-2/3" })] })] }));
}
function proteinBadge(pct) {
    if (pct >= 80)
        return { label: `${pct}%`, style: 'bg-green-100 text-green-700' };
    if (pct >= 50)
        return { label: `${pct}%`, style: 'bg-blue-100 text-blue-600' };
    return { label: `${pct}%`, style: 'bg-gray-100 text-gray-500' };
}
function sodiumBadge(avg) {
    if (avg < 5)
        return { label: '良好', style: 'bg-sky-50 text-sky-600' };
    if (avg < 7)
        return { label: '注意', style: 'bg-yellow-50 text-yellow-600' };
    return { label: '超過', style: 'bg-red-50 text-red-500' };
}
function WeeklySummary({ summary, loading }) {
    if (loading || !summary) {
        return (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsx(SkeletonCard, {}), _jsx(SkeletonCard, {}), _jsx(SkeletonCard, {})] }));
    }
    const { total_protein_g, total_sodium_g, targets } = summary;
    const weeklyTarget = targets.weekly_protein_g;
    const dailyTarget = targets.daily_protein_g;
    const sodiumMax = targets.daily_sodium_g_max;
    const totalProtein = Math.round(total_protein_g * 10) / 10;
    const avgDailyProtein = Math.round((total_protein_g / 7) * 10) / 10;
    const avgDailySodium = Math.round((total_sodium_g / 7) * 100) / 100;
    const proteinPct = Math.round((total_protein_g / weeklyTarget) * 100);
    const sodiumAccent = avgDailySodium < 5 ? 'bg-sky-400' : avgDailySodium < 7 ? 'bg-yellow-400' : 'bg-red-400';
    const sodiumText = avgDailySodium >= 7 ? 'text-red-500' : undefined;
    return (_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsx(StatCard, { icon: Dumbbell, label: "\u4ECA\u9031\u306E\u7DCF\u30BF\u30F3\u30D1\u30AF\u8CEA", value: `${totalProtein}g`, sub: `週間目標 ${weeklyTarget}g`, accent: "bg-green-500", badge: proteinBadge(proteinPct) }), _jsx(StatCard, { icon: CheckCircle2, label: "1\u65E5\u5E73\u5747\u30BF\u30F3\u30D1\u30AF\u8CEA", value: `${avgDailyProtein}g`, sub: `目標 ${dailyTarget}g / 日`, accent: "bg-emerald-500" }), _jsx(StatCard, { icon: Droplets, label: "1\u65E5\u5E73\u5747\u5869\u5206", value: `${avgDailySodium}g`, sub: `上限目標 ${sodiumMax}g / 日`, accent: sodiumAccent, textAccent: sodiumText, badge: sodiumBadge(avgDailySodium) })] }));
}
export default WeeklySummary;
