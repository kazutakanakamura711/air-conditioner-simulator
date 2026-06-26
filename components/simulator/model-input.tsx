"use client";

import type { ModelParams } from "@/types/simulation";

type ModelInputProps = {
  title: string;
  model: ModelParams;
  onChange: (next: ModelParams) => void;
};

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-emerald-300">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        className="w-full accent-emerald-400"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export function ModelInput({ title, model, onChange }: ModelInputProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg backdrop-blur">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        <SliderRow
          label="冷房 APF"
          value={model.coolingApf}
          min={3}
          max={8}
          step={0.1}
          unit=""
          onChange={(coolingApf) => onChange({ ...model, coolingApf })}
        />
        <SliderRow
          label="暖房 APF"
          value={model.heatingApf}
          min={3}
          max={8}
          step={0.1}
          unit=""
          onChange={(heatingApf) => onChange({ ...model, heatingApf })}
        />
        <SliderRow
          label="冷房能力"
          value={model.coolingKw}
          min={2.2}
          max={7.1}
          step={0.1}
          unit="kW"
          onChange={(coolingKw) => onChange({ ...model, coolingKw })}
        />
      </div>
    </section>
  );
}
