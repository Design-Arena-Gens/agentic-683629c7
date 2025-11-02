"use client";

import { useCallback, useRef, useState } from "react";
import Papa from "papaparse";

export interface FileDropZoneProps {
  onParsed: (rows: Record<string, string>[], fields: string[]) => void;
}

export function FileDropZone({ onParsed }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) {
        return;
      }
      setError(null);

      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            setError("Failed to parse CSV. Please check the file format.");
            return;
          }
          const rows = results.data.filter((row) => Object.keys(row).length > 0);
          onParsed(rows, results.meta.fields ?? []);
        },
        error: () => {
          setError("Failed to read file. Try again with a valid CSV.");
        }
      });
    },
    [onParsed]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragging(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(event.target.files);
    },
    [handleFiles]
  );

  return (
    <div className="space-y-3">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-slate-900/60 px-6 py-10 text-center transition-all hover:border-indigo-400/80 hover:bg-slate-900 ${
          isDragging ? "border-indigo-400 text-indigo-200" : "border-slate-700"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onChange}
          className="hidden"
        />
        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-wide text-indigo-200">
          Upload CSV
        </span>
        <p className="mt-3 text-lg font-semibold text-slate-100">Drop your data file</p>
        <p className="text-sm text-slate-400">or click to browse your computer</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-400"
        >
          Choose file
        </button>
      </label>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
