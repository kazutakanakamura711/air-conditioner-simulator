import { simulate } from "@/lib/calc";
import type { SimulationParams } from "@/types/simulation";

function createParams(overrides?: Partial<SimulationParams>): SimulationParams {
  return {
    modelA: {
      price: 50000,
      coolingApf: 4,
      heatingApf: 4,
      coolingKw: 2.2,
    },
    modelB: {
      price: 70000,
      coolingApf: 6,
      heatingApf: 6,
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
    ...overrides,
    modelA: {
      price: 50000,
      coolingApf: 4,
      heatingApf: 4,
      coolingKw: 2.2,
      ...overrides?.modelA,
    },
    modelB: {
      price: 70000,
      coolingApf: 6,
      heatingApf: 6,
      coolingKw: 2.2,
      ...overrides?.modelB,
    },
    settings: {
      unitPrice: 31,
      city: "tokyo",
      activeMonths: [1, 2, 3, 6, 7, 8, 9, 12],
      weekdayHours: 9,
      weekendHours: 16,
      years: 10,
      ...overrides?.settings,
    },
  };
}

describe("simulate", () => {
  it("returns monthly and cumulative data with expected lengths", () => {
    const result = simulate(
      createParams({ settings: { years: 5 } as SimulationParams["settings"] }),
    );

    expect(result.monthlyCosts).toHaveLength(12);
    expect(result.cumulativeCosts).toHaveLength(6);
    expect(result.priceDiff).toBe(20000);
    expect(result.annualCostA).toBeGreaterThan(result.annualCostB);
  });

  it("returns zero running cost when no active months are selected", () => {
    const result = simulate(
      createParams({
        settings: {
          activeMonths: [],
          years: 3,
        } as SimulationParams["settings"],
      }),
    );

    expect(result.annualCostA).toBe(0);
    expect(result.annualCostB).toBe(0);
    expect(
      result.monthlyCosts.every(
        (month) => month.modelA === 0 && month.modelB === 0,
      ),
    ).toBe(true);
    expect(result.cumulativeCosts.at(-1)).toEqual({
      year: 3,
      label: "3年後",
      modelA: 50000,
      modelB: 70000,
    });
  });

  it("clamps weekday and weekend hours into the 0-24 range", () => {
    const resultWithOutOfRangeHours = simulate(
      createParams({
        settings: {
          activeMonths: [1],
          weekdayHours: 99,
          weekendHours: -5,
        } as SimulationParams["settings"],
      }),
    );

    const resultWithClampedHours = simulate(
      createParams({
        settings: {
          activeMonths: [1],
          weekdayHours: 24,
          weekendHours: 0,
        } as SimulationParams["settings"],
      }),
    );

    expect(resultWithOutOfRangeHours.monthlyCosts[0]).toEqual(
      resultWithClampedHours.monthlyCosts[0],
    );
  });

  it("finds a break-even year when the efficient model recovers its upfront price", () => {
    const result = simulate(
      createParams({
        modelA: {
          price: 50000,
          coolingApf: 2,
          heatingApf: 2,
          coolingKw: 2.2,
        },
        modelB: {
          price: 60000,
          coolingApf: 8,
          heatingApf: 8,
          coolingKw: 2.2,
        },
        settings: {
          city: "sapporo",
          activeMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          weekdayHours: 16,
          weekendHours: 16,
          unitPrice: 50,
          years: 15,
        } as SimulationParams["settings"],
      }),
    );

    expect(result.breakEvenYear).not.toBeNull();
    expect(result.finalSavings).toBeGreaterThan(0);
  });
});
