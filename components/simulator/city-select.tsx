"use client";

import { cityData } from "@/lib/cityData";
import type { CityKey } from "@/types/simulation";

type CitySelectProps = {
  value: CityKey;
  onChange: (city: CityKey) => void;
};

export function CitySelect({ value, onChange }: CitySelectProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-300">使用都市</span>
      <select
        className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none transition focus:border-emerald-400"
        value={value}
        onChange={(event) => onChange(event.target.value as CityKey)}
      >
        {Object.entries(cityData).map(([key, city]) => (
          <option key={key} value={key}>
            {city.name}
          </option>
        ))}
      </select>
    </label>
  );
}
