"use client";

import type { DatasetSummary } from "../lib/analysis";

interface SummaryCardsProps {
  summary: DatasetSummary;
}

const items: { key: keyof DatasetSummary; label: string; suffix?: string }[] = [
  { key: "rowCount", label: "Rows" },
  { key: "columnCount", label: "Columns" },
  { key: "numericColumns", label: "Numeric Columns" },
  { key: "missingCells", label: "Missing Cells" },
  { key: "completeness", label: "Data Completeness", suffix: "%" }
];

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => {
        const value = summary[item.key];
        return (
          <div
            key={item.key}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-5 shadow-lg shadow-indigo-500/5"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">
              {typeof value === "number" ? value.toLocaleString() : value}
              {item.suffix}
            </p>
          </div>
        );
      })}
    </div>
  );
}
