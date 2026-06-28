"use client";

import { useMemo, useState } from "react";
import { cityData } from "@/lib/cityData";
import { simulate } from "@/lib/calc";
import type { SimulationParams } from "@/types/simulation";
import { CumulativeChart } from "@/components/result/cumulative-chart";
import { MonthlyChart } from "@/components/result/monthly-chart";
import { ResultCards } from "@/components/result/result-cards";
import { ShareButton } from "@/components/result/share-button";
import { CitySelect } from "@/components/simulator/city-select";
import { ModelInput } from "@/components/simulator/model-input";
import { MonthSelector } from "@/components/simulator/month-selector";
import { TimeRangePicker } from "@/components/simulator/time-range-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultParams: SimulationParams = {
  modelA: {
    price: 50000,
    coolingApf: 4.5,
    heatingApf: 4.5,
    coolingKw: 2.2,
  },
  modelB: {
    price: 120000,
    coolingApf: 6.5,
    heatingApf: 6.5,
    coolingKw: 2.2,
  },
  settings: {
    unitPrice: 31,
    city: "tokyo",
    activeMonths: [1, 2, 3, 6, 7, 8, 9, 12],
    weekdayHours: 9,
    weekendHours: 16,
    years: 10,
  },
};

type ChartTab = "cumulative" | "monthly";

function yenShort(value: number): string {
  if (value >= 10000) {
    return `${Math.round(value / 1000) / 10}万円`;
  }

  return `${value.toLocaleString("ja-JP")}円`;
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  suffix,
  testId,
  thumbTestId,
  valueTestId,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  testId?: string;
  thumbTestId?: string;
  valueTestId?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-white" data-testid={valueTestId}>
          {value.toLocaleString("ja-JP")}
          {suffix}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        aria-label={label}
        data-testid={testId}
        thumbTestId={thumbTestId}
        onValueChange={(next) => onChange(next[0] ?? min)}
      />
    </div>
  );
}

type SimulatorFormProps = {
  initialParams?: SimulationParams;
};

export function SimulatorForm({ initialParams }: SimulatorFormProps) {
  const [params, setParams] = useState<SimulationParams>(
    initialParams ?? defaultParams,
  );
  const [activeChart, setActiveChart] = useState<ChartTab>("cumulative");

  const result = useMemo(() => simulate(params), [params]);
  const cityName = cityData[params.settings.city].name;

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl bg-slate-950/70 shadow-2xl shadow-emerald-950/20">
        <CardHeader>
          <CardTitle className="text-xl">パラメータ設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <SliderRow
              label="安価モデル 本体価格"
              value={params.modelA.price}
              min={30000}
              max={300000}
              step={1000}
              suffix="円"
              testId="slider-model-a-price"
              thumbTestId="slider-model-a-price-thumb"
              valueTestId="slider-model-a-price-value"
              onChange={(price) =>
                setParams((prev) => ({
                  ...prev,
                  modelA: { ...prev.modelA, price },
                }))
              }
            />
            <SliderRow
              label="省エネモデル 本体価格"
              value={params.modelB.price}
              min={30000}
              max={300000}
              step={1000}
              suffix="円"
              testId="slider-model-b-price"
              thumbTestId="slider-model-b-price-thumb"
              valueTestId="slider-model-b-price-value"
              onChange={(price) =>
                setParams((prev) => ({
                  ...prev,
                  modelB: { ...prev.modelB, price },
                }))
              }
            />
            <SliderRow
              label="電気代単価"
              value={params.settings.unitPrice}
              min={20}
              max={50}
              step={1}
              suffix="円/kWh"
              testId="slider-unit-price"
              thumbTestId="slider-unit-price-thumb"
              valueTestId="slider-unit-price-value"
              onChange={(unitPrice) =>
                setParams((prev) => ({
                  ...prev,
                  settings: { ...prev.settings, unitPrice },
                }))
              }
            />
            <SliderRow
              label="比較年数"
              value={params.settings.years}
              min={1}
              max={20}
              step={1}
              suffix="年"
              testId="slider-years"
              thumbTestId="slider-years-thumb"
              valueTestId="slider-years-value"
              onChange={(years) =>
                setParams((prev) => ({
                  ...prev,
                  settings: { ...prev.settings, years },
                }))
              }
            />
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <label
              htmlFor="comparison-years-select"
              className="block text-sm text-slate-300"
            >
              比較年数を直接選択
            </label>
            <div className="mt-2 flex items-center gap-3">
              <select
                id="comparison-years-select"
                data-testid="comparison-years-select"
                value={params.settings.years}
                onChange={(event) => {
                  const nextYears = Number(event.currentTarget.value);
                  setParams((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      years: nextYears,
                    },
                  }));
                }}
                className="w-28 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none transition focus:border-emerald-400"
              >
                {Array.from({ length: 20 }, (_, index) => index + 1).map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
              <span className="text-sm text-slate-400">年</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <ModelInput
              title="安価モデル"
              model={params.modelA}
              onChange={(modelA) => setParams((prev) => ({ ...prev, modelA }))}
            />
            <ModelInput
              title="省エネモデル"
              model={params.modelB}
              onChange={(modelB) => setParams((prev) => ({ ...prev, modelB }))}
            />
          </div>

          <p className="mt-3 text-xs text-slate-400">
            APFは冷暖房の通年効率の目安です。都市 {cityName}{" "}
            の月平均気温から月別負荷を推定して計算します。
          </p>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <CitySelect
                value={params.settings.city}
                onChange={(city) =>
                  setParams((prev) => ({
                    ...prev,
                    settings: { ...prev.settings, city },
                  }))
                }
              />
              <MonthSelector
                value={params.settings.activeMonths}
                onChange={(activeMonths) =>
                  setParams((prev) => ({
                    ...prev,
                    settings: { ...prev.settings, activeMonths },
                  }))
                }
              />
            </div>

            <div className="space-y-3">
              <TimeRangePicker
                label="平日の使用時間"
                hours={params.settings.weekdayHours}
                onChange={(weekdayHours) =>
                  setParams((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      weekdayHours,
                    },
                  }))
                }
              />
              <TimeRangePicker
                label="休日の使用時間"
                hours={params.settings.weekendHours}
                onChange={(weekendHours) =>
                  setParams((prev) => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      weekendHours,
                    },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <ResultCards params={params} result={result} />

      <ShareButton params={params} />

      <Card className="rounded-3xl bg-slate-950/70">
        <CardContent className="pt-5 sm:pt-6">
          <Tabs
            value={activeChart}
            onValueChange={(value) => setActiveChart(value as ChartTab)}
          >
            <TabsList>
              <TabsTrigger value="cumulative">累積コスト比較</TabsTrigger>
              <TabsTrigger value="monthly">月別電気代</TabsTrigger>
            </TabsList>
            <TabsContent value="cumulative">
              <CumulativeChart data={result.cumulativeCosts} />
            </TabsContent>
            <TabsContent value="monthly">
              <MonthlyChart data={result.monthlyCosts} />
            </TabsContent>
          </Tabs>

          <p className="mt-3 text-sm text-slate-300">
            {result.breakEvenYear === null
              ? `設定した${params.settings.years}年では損益分岐に達しません。比較終了時点の差額は ${yenShort(
                  Math.abs(result.finalSavings),
                )} です。`
              : `約${result.breakEvenYear}年後が損益分岐の目安です。${params.settings.years}年後の累積差額は ${yenShort(
                  Math.abs(result.finalSavings),
                )} です。`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
