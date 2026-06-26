"use client";

import { monthLabels } from "@/lib/cityData";

type MonthSelectorProps = {
  value: number[];
  onChange: (months: number[]) => void;
};

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  const toggle = (month: number) => {
    if (value.includes(month)) {
      onChange(value.filter((item) => item !== month));
      return;
    }

    onChange([...value, month].sort((a, b) => a - b));
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-300">使用月</p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {monthLabels.map((label, index) => {
          const month = index + 1;
          const checked = value.includes(month);

          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(month)}
              className={`rounded-lg border px-2 py-1 text-sm transition ${
                checked
                  ? "border-emerald-300 bg-emerald-400/20 text-emerald-200"
                  : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
