"use client";

import { useMemo, useState } from "react";
import { FileDropZone } from "./components/FileDropZone";
import { SummaryCards } from "./components/SummaryCards";
import { ColumnInsights } from "./components/ColumnInsights";
import { DataTable } from "./components/DataTable";
import { analyzeDataset } from "./lib/analysis";

const demoCSV = `region,category,sales,profit,date
West,Technology,1200,140,2023-01-12
East,Furniture,890,60,2023-02-01
South,Office Supplies,450,35,2023-02-18
North,Technology,980,110,2023-03-02
West,Furniture,620,55,2023-03-10
East,Office Supplies,720,85,2023-04-21
South,Technology,1520,220,2023-05-05
North,Furniture,410,18,2023-05-16
West,Office Supplies,510,42,2023-06-03
East,Technology,1320,180,2023-06-22`;

const demoRows = parseDemoCsv(demoCSV);

function parseDemoCsv(csv: string): Record<string, string>[] {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const cells = line.split(",");
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = cells[index] ?? "";
      return acc;
    }, {});
  });
}

export default function Page() {
  const [rows, setRows] = useState<Record<string, string>[]>(demoRows);
  const [fields, setFields] = useState<string[]>(() => Object.keys(demoRows[0] ?? {}));

  const { summary, columns } = useMemo(() => analyzeDataset(rows), [rows]);

  const onParsed = (items: Record<string, string>[], newFields: string[]) => {
    setRows(items);
    setFields(newFields.length ? newFields : Object.keys(items[0] ?? {}));
  };

  const hasData = rows.length > 0 && fields.length > 0;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-300/80">CSV Analyzer</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-50 sm:text-5xl">Minimalist Data Dashboard</h1>
        </div>
        <p className="max-w-2xl text-sm text-slate-400">
          Drop a CSV file to instantly explore its structure. The dashboard auto-detects data types,
          surfaces summary metrics, and gives you a quick scan of your dataset without leaving the browser.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const loadedRows = parseDemoCsv(demoCSV);
              setRows(loadedRows);
              setFields(Object.keys(loadedRows[0] ?? {}));
            }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-100 backdrop-blur transition hover:border-indigo-300 hover:bg-indigo-500/20"
          >
            Load demo dataset
          </button>
          {hasData ? (
            <button
              type="button"
              onClick={() => {
                setRows([]);
                setFields([]);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-slate-200"
            >
              Clear data
            </button>
          ) : null}
        </div>
      </header>

      <section>
        <FileDropZone onParsed={onParsed} />
      </section>

      {hasData ? (
        <section className="space-y-6">
          <SummaryCards summary={summary} />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DataTable rows={rows} />
            </div>
            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <h2 className="text-lg font-semibold text-slate-100">Quick Facts</h2>
                <dl className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-lg bg-slate-950/70 px-3 py-2">
                    <dt className="text-slate-400">Detected columns</dt>
                    <dd className="font-medium text-slate-100">{fields.length}</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-950/70 px-3 py-2">
                    <dt className="text-slate-400">Rows analysed</dt>
                    <dd className="font-medium text-slate-100">{rows.length.toLocaleString()}</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-950/70 px-3 py-2">
                    <dt className="text-slate-400">Completeness</dt>
                    <dd className="font-medium text-emerald-300">{summary.completeness}%</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
          <ColumnInsights columns={columns} />
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
          <p>No data loaded yet. Upload a CSV to get started, or try the demo dataset.</p>
        </section>
      )}
    </main>
  );
}
