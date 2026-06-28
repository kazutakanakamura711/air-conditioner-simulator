"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyCostPoint } from "@/types/simulation";

type MonthlyChartProps = {
  data: MonthlyCostPoint[];
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

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <div className="h-[360px] w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
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
          />
          <Tooltip
            contentStyle={{
              background: "#020617",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
            }}
            formatter={(value) => yen(toNumber(value))}
          />
          <Bar
            dataKey="modelA"
            name="安価モデル"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="modelB"
            name="省エネモデル"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
