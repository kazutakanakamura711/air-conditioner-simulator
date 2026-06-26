import { cityData, monthLabels } from "@/lib/cityData";
import type {
  CumulativeCostPoint,
  ModelParams,
  MonthlyCostPoint,
  SimulationParams,
  SimulationResult,
} from "@/types/simulation";

const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function roundYen(value: number): number {
  return Math.round(value);
}

function estimateLoadKw(temp: number): {
  mode: "cooling" | "heating" | "mid";
  loadKw: number;
} {
  if (temp > 24) {
    return { mode: "cooling", loadKw: 0.5 + (temp - 24) * 0.08 };
  }

  if (temp < 15) {
    return { mode: "heating", loadKw: 0.4 + (15 - temp) * 0.06 };
  }

  return { mode: "mid", loadKw: 0.2 };
}

function selectApf(
  model: ModelParams,
  mode: "cooling" | "heating" | "mid",
): number {
  if (mode === "cooling") {
    return model.coolingApf;
  }

  if (mode === "heating") {
    return model.heatingApf;
  }

  return (model.coolingApf + model.heatingApf) / 2;
}

function calcDailyUsageHours(params: SimulationParams): number {
  const weekdayHours = Math.min(24, Math.max(0, params.settings.weekdayHours));
  const weekendHours = Math.min(24, Math.max(0, params.settings.weekendHours));

  return weekdayHours * (5 / 7) + weekendHours * (2 / 7);
}

function calcMonthlyCost(
  model: ModelParams,
  monthIndex: number,
  temp: number,
  dailyUsageHours: number,
  unitPrice: number,
  activeMonths: number[],
): number {
  const month = monthIndex + 1;

  if (!activeMonths.includes(month)) {
    return 0;
  }

  const { mode, loadKw } = estimateLoadKw(temp);
  const scaledLoadKw = loadKw * (model.coolingKw / 2.2);
  const apf = Math.max(selectApf(model, mode), 0.1);
  const days = monthDays[monthIndex];
  const monthlyKwh = (scaledLoadKw / apf) * dailyUsageHours * days;

  return monthlyKwh * unitPrice;
}

function findBreakEvenYear(data: CumulativeCostPoint[]): number | null {
  const hit = data.find(
    (point) => point.year > 0 && point.modelB <= point.modelA,
  );
  return hit?.year ?? null;
}

export function simulate(params: SimulationParams): SimulationResult {
  const temps = cityData[params.settings.city].temps;
  const dailyUsageHours = calcDailyUsageHours(params);

  const monthlyCosts: MonthlyCostPoint[] = temps.map((temp, index) => {
    const modelA = calcMonthlyCost(
      params.modelA,
      index,
      temp,
      dailyUsageHours,
      params.settings.unitPrice,
      params.settings.activeMonths,
    );

    const modelB = calcMonthlyCost(
      params.modelB,
      index,
      temp,
      dailyUsageHours,
      params.settings.unitPrice,
      params.settings.activeMonths,
    );

    return {
      month: index + 1,
      label: monthLabels[index],
      temp,
      modelA: roundYen(modelA),
      modelB: roundYen(modelB),
    };
  });

  const annualCostA = roundYen(
    monthlyCosts.reduce((sum, month) => sum + month.modelA, 0),
  );
  const annualCostB = roundYen(
    monthlyCosts.reduce((sum, month) => sum + month.modelB, 0),
  );

  const cumulativeCosts: CumulativeCostPoint[] = Array.from({
    length: params.settings.years + 1,
  }).map((_, year) => ({
    year,
    label: year === 0 ? "購入時" : `${year}年後`,
    modelA: roundYen(params.modelA.price + annualCostA * year),
    modelB: roundYen(params.modelB.price + annualCostB * year),
  }));

  const breakEvenYear = findBreakEvenYear(cumulativeCosts);
  const finalPoint = cumulativeCosts[cumulativeCosts.length - 1];

  return {
    annualCostA,
    annualCostB,
    annualDiff: roundYen(annualCostA - annualCostB),
    priceDiff: roundYen(params.modelB.price - params.modelA.price),
    breakEvenYear,
    finalSavings: roundYen(finalPoint.modelA - finalPoint.modelB),
    monthlyCosts,
    cumulativeCosts,
  };
}
