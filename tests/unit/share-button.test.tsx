/** @jest-environment jsdom */

import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ShareButton } from "@/components/result/share-button";
import type { SimulationParams } from "@/types/simulation";

const createSimulationMock = jest.fn();

jest.mock("@/lib/api", () => ({
  createSimulation: (...args: unknown[]) => createSimulationMock(...args),
}));

const params: SimulationParams = {
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

describe("ShareButton", () => {
  beforeEach(() => {
    createSimulationMock.mockReset();
  });

  it("creates and displays a share URL", async () => {
    createSimulationMock.mockResolvedValue({
      id: "test-share-id",
      url: "http://localhost:3000/result/test-share-id",
      expiresAt: "2026-07-28T07:00:00.000Z",
    });

    render(<ShareButton params={params} />);

    fireEvent.click(screen.getByRole("button", { name: "共有URLを作成" }));

    await waitFor(() => {
      expect(screen.getByText("共有URL")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("link", {
        name: "http://localhost:3000/result/test-share-id",
      }),
    ).toBeInTheDocument();
    expect(createSimulationMock).toHaveBeenCalledWith(params);
  });

  it("shows an error message when share creation fails", async () => {
    createSimulationMock.mockRejectedValue(new Error("failed"));

    render(<ShareButton params={params} />);

    fireEvent.click(screen.getByRole("button", { name: "共有URLを作成" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "共有URLの作成に失敗しました。時間をおいて再試行してください。",
        ),
      ).toBeInTheDocument();
    });
  });
});
