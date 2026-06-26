"use client";

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
      <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-400">安価モデル 年間電気代</p>
        <p className="mt-1 text-3xl font-semibold text-white">
          {yen(result.annualCostA)}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          APF冷{params.modelA.coolingApf.toFixed(1)} / 暖
          {params.modelA.heatingApf.toFixed(1)}
        </p>
      </article>

      <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-400">省エネモデル 年間電気代</p>
        <p className="mt-1 text-3xl font-semibold text-white">
          {yen(result.annualCostB)}
        </p>
        <p className="mt-1 text-sm text-slate-400">
          APF冷{params.modelB.coolingApf.toFixed(1)} / 暖
          {params.modelB.heatingApf.toFixed(1)}
        </p>
      </article>

      <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-400">年間電気代の差額</p>
        <p className="mt-1 text-3xl font-semibold text-emerald-300">
          {signedYen(result.annualDiff)}
        </p>
        <p className="mt-1 text-sm text-slate-400">安価モデル - 省エネモデル</p>
      </article>

      <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-400">本体価格差</p>
        <p className="mt-1 text-3xl font-semibold text-rose-300">
          {yen(result.priceDiff)}
        </p>
        <p className="mt-1 text-sm text-slate-400">省エネモデルが高い分</p>
      </article>
    </section>
  );
}
