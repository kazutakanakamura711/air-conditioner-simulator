"use client";

import { Slider } from "@/components/ui/slider";

type TimeRangePickerProps = {
  label: string;
  hours: number;
  onChange: (hours: number) => void;
};

function formatHours(value: number): string {
  if (Number.isInteger(value)) {
    return `${value}時間`;
  }

  return `${value.toFixed(1)}時間`;
}

export function TimeRangePicker({
  label,
  hours,
  onChange,
}: TimeRangePickerProps) {
  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/60 p-3">
      <p className="text-sm font-medium text-slate-300">{label}</p>
      <div>
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>1日あたり</span>
          <span>{formatHours(hours)}</span>
        </div>
        <Slider
          min={0}
          max={24}
          step={0.5}
          value={[hours]}
          onValueChange={(value) => onChange(value[0] ?? 0)}
        />
      </div>
    </div>
  );
}
