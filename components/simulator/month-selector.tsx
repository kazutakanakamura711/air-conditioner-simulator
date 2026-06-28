"use client";

import { Button } from "@/components/ui/button";
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
            <Button
              key={label}
              type="button"
              onClick={() => toggle(month)}
              variant={checked ? "default" : "outline"}
              size="sm"
              className={`h-8 px-2 text-sm ${
                checked
                  ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                  : "text-slate-300"
              }`}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
