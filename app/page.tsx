import { SimulatorForm } from "@/components/simulator/simulator-form";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <section className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-300/80">
            Air Conditioner Simulator
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            エアコンコスト比較シミュレーター
          </h1>
        </div>
        <p className="max-w-md text-sm text-slate-300">
          安価モデルと省エネモデルを比較し、年間電気代と累積コストの差をグラフで確認できます。
        </p>
      </section>

      <SimulatorForm />
    </main>
  );
}
