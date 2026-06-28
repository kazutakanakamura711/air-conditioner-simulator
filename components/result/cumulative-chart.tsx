"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CumulativeCostPoint } from "@/types/simulation";

type CumulativeChartProps = {
  data: CumulativeCostPoint[];
};

function yen(value: number): string {
  return `${Math.round(value).toLocaleString("ja-JP")}円`;
}

function toNumber(
  value: number | string | readonly (number | string)[] | undefined,
): number {
  if (Array.isArray(value)) {
    return toNumber(value[0]);
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

export function CumulativeChart({ data }: CumulativeChartProps) {
  return (
    <div className="h-[360px] w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            width={40}
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${Math.round(value / 10000)}万`}
          />
          <Tooltip
            contentStyle={{
              background: "#020617",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
            }}
            formatter={(value) => yen(toNumber(value))}
          />
          <Line
            type="monotone"
            dataKey="modelA"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
            name="安価モデル"
          />
          <Line
            type="monotone"
            dataKey="modelB"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
            name="省エネモデル"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
