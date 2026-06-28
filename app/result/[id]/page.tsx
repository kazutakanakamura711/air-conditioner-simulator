"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SimulatorForm } from "@/components/simulator/simulator-form";
import { getSimulation } from "@/lib/api";
import type { SimulationParams } from "@/types/simulation";

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const isInvalidId = !id;

  const [loading, setLoading] = useState(!isInvalidId);
  const [error, setError] = useState<string | null>(null);
  const [initialParams, setInitialParams] = useState<SimulationParams | null>(
    null,
  );

  useEffect(() => {
    if (isInvalidId) {
      return;
    }

    const abortController = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getSimulation(id);
        if (!abortController.signal.aborted) {
          setInitialParams(data.params);
        }
      } catch {
        if (!abortController.signal.aborted) {
          setError(
            "共有データを取得できませんでした。URLが無効か、期限切れの可能性があります。",
          );
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      abortController.abort();
    };
  }, [id, isInvalidId]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <section className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-300/80">
            Shared Result
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            共有シミュレーション結果
          </h1>
        </div>
        {id ? <p className="text-xs text-slate-400">ID: {id}</p> : null}
      </section>

      {isInvalidId ? (
        <section className="rounded-3xl border border-rose-400/30 bg-rose-900/15 p-8 text-sm text-rose-200">
          共有IDが不正です。
        </section>
      ) : null}

      {!isInvalidId && loading ? (
        <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 text-sm text-slate-300">
          読み込み中です...
        </section>
      ) : null}

      {!isInvalidId && error ? (
        <section className="rounded-3xl border border-rose-400/30 bg-rose-900/15 p-8 text-sm text-rose-200">
          {error}
        </section>
      ) : null}

      {!isInvalidId && !loading && !error && initialParams ? (
        <SimulatorForm initialParams={initialParams} />
      ) : null}
    </main>
  );
}
