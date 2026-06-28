"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SimulationParams, SimulationResult } from "@/types/simulation";

type ResultCardsProps = {
  params: SimulationParams;
  result: SimulationResult;
};

function yen(value: number): string {
  return `${value.toLocaleString("ja-JP")}円`;
}

function signedYen(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("ja-JP")}円`;
}

export function ResultCards({ params, result }: ResultCardsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="bg-white/5">
        <CardHeader>
          <CardDescription>安価モデル 年間電気代</CardDescription>
          <CardTitle className="text-3xl">{yen(result.annualCostA)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            APF冷{params.modelA.coolingApf.toFixed(1)} / 暖
            {params.modelA.heatingApf.toFixed(1)}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/5">
        <CardHeader>
          <CardDescription>省エネモデル 年間電気代</CardDescription>
          <CardTitle className="text-3xl">{yen(result.annualCostB)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            APF冷{params.modelB.coolingApf.toFixed(1)} / 暖
            {params.modelB.heatingApf.toFixed(1)}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/5">
        <CardHeader>
          <CardDescription>年間電気代の差額</CardDescription>
          <CardTitle className="text-3xl text-emerald-300">
            {signedYen(result.annualDiff)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">安価モデル - 省エネモデル</p>
        </CardContent>
      </Card>

      <Card className="bg-white/5">
        <CardHeader>
          <CardDescription>本体価格差</CardDescription>
          <CardTitle className="text-3xl text-rose-300">
            {yen(result.priceDiff)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">省エネモデルが高い分</p>
        </CardContent>
      </Card>
    </section>
  );
}
