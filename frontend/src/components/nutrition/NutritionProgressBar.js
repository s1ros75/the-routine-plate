import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function NutritionProgressBar({ label, value, target, unit = 'g', colorType = 'protein' }) {
    const pct = Math.min((value / target) * 100, 100);
    const barColor = (() => {
        if (colorType === 'sodium') {
            if (pct < 60)
                return 'bg-green-400';
            if (pct < 90)
                return 'bg-yellow-400';
            return 'bg-red-400';
        }
        // protein — 多いほど緑に近づく
        if (pct >= 80)
            return 'bg-green-500';
        if (pct >= 50)
            return 'bg-green-300';
        return 'bg-gray-300';
    })();
    const isOver = value > target;
    return (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[10px] text-gray-400", children: label }), _jsxs("span", { className: "text-[10px] font-semibold text-gray-600", children: [value, _jsxs("span", { className: "font-normal text-gray-400", children: ["/", target, unit] }), isOver && colorType === 'protein' && _jsx("span", { className: "ml-1 text-green-500", children: "\u2713" }), isOver && colorType === 'sodium' && _jsx("span", { className: "ml-1 text-red-400", children: "!" })] })] }), _jsx("div", { className: "h-1.5 bg-gray-100 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-500 ${barColor}`, style: { width: `${pct}%` } }) })] }));
}
export default NutritionProgressBar;
