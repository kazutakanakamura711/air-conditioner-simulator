export type CityKey =
  | "sapporo"
  | "sendai"
  | "tokyo"
  | "nagoya"
  | "osaka"
  | "hiroshima"
  | "matsuyama"
  | "fukuoka"
  | "naha";

export type ModelParams = {
  price: number;
  coolingApf: number;
  heatingApf: number;
  coolingKw: number;
};

export type SimulationSettings = {
  unitPrice: number;
  city: CityKey;
  activeMonths: number[];
  weekdayHours: number;
  weekendHours: number;
  years: number;
};

export type SimulationParams = {
  modelA: ModelParams;
  modelB: ModelParams;
  settings: SimulationSettings;
};

export type MonthlyCostPoint = {
  month: number;
  label: string;
  temp: number;
  modelA: number;
  modelB: number;
};

export type CumulativeCostPoint = {
  year: number;
  label: string;
  modelA: number;
  modelB: number;
};

export type SimulationResult = {
  annualCostA: number;
  annualCostB: number;
  annualDiff: number;
  priceDiff: number;
  breakEvenYear: number | null;
  finalSavings: number;
  monthlyCosts: MonthlyCostPoint[];
  cumulativeCosts: CumulativeCostPoint[];
};
