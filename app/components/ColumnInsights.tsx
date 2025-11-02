"use client";

import type { ColumnProfile } from "../lib/analysis";

interface ColumnInsightsProps {
  columns: ColumnProfile[];
}

export function ColumnInsights({ columns }: ColumnInsightsProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Column Insights</h2>
          <p className="text-sm text-slate-400">Automatic profiling of each field</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {columns.map((column) => (
          <div
            key={column.name}
            className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-100">{column.name}</h3>
                <p className="text-xs uppercase tracking-wide text-slate-500">{column.type}</p>
              </div>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
                {column.uniqueValues.toLocaleString()} unique
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-900/80 p-3">
                <dt className="text-xs uppercase text-slate-500">Empty</dt>
                <dd className="text-base font-medium text-slate-200">{column.emptyValues}</dd>
              </div>
              <div className="rounded-lg bg-slate-900/80 p-3">
                <dt className="text-xs uppercase text-slate-500">Sample</dt>
                <dd className="truncate text-sm text-slate-300">{column.samples.join(", ") || "—"}</dd>
              </div>
              {column.stats ? (
                <div className="col-span-2 grid grid-cols-2 gap-3 text-xs text-slate-400">
                  <div className="rounded-lg bg-slate-900/60 p-3">
                    <p className="text-slate-500">Min</p>
                    <p className="text-lg font-semibold text-slate-100">{column.stats.min}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/60 p-3">
                    <p className="text-slate-500">Max</p>
                    <p className="text-lg font-semibold text-slate-100">{column.stats.max}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/60 p-3">
                    <p className="text-slate-500">Mean</p>
                    <p className="text-lg font-semibold text-slate-100">{column.stats.mean}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/60 p-3">
                    <p className="text-slate-500">Median</p>
                    <p className="text-lg font-semibold text-slate-100">{column.stats.median}</p>
                  </div>
                </div>
              ) : null}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
