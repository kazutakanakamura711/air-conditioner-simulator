"use client";

import { cityData } from "@/lib/cityData";
import type { CityKey } from "@/types/simulation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CitySelectProps = {
  value: CityKey;
  onChange: (city: CityKey) => void;
};

export function CitySelect({ value, onChange }: CitySelectProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-300">使用都市</span>
      <Select value={value} onValueChange={(next) => onChange(next as CityKey)}>
        <SelectTrigger>
          <SelectValue placeholder="都市を選択" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(cityData).map(([key, city]) => (
            <SelectItem key={key} value={key}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
