"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

export interface DataTableProps {
  rows: Record<string, string>[];
}

export function DataTable({ rows }: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Record<string, string>>[]>(() => {
    if (!rows.length) return [];
    return Object.keys(rows[0]).map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info) => info.getValue() as string
    }));
  }, [rows]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      sorting
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const value = row.getValue<string>(columnId);
      return value?.toString().toLowerCase().includes(String(filterValue).toLowerCase());
    }
  });

  if (!rows.length) {
    return null;
  }

  const truncatedRows = table.getRowModel().rows.slice(0, 200);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Data Explorer</h2>
          <p className="text-sm text-slate-400">Showing up to 200 rows</p>
        </div>
        <input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Search across all columns..."
          className="w-full rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 shadow-inner shadow-slate-900/60 focus:border-indigo-400 focus:outline-none focus:ring-0 sm:w-64"
        />
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-800 text-left text-xs uppercase text-slate-400">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer px-3 py-2 font-medium hover:text-indigo-200"
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" ? "▲" : null}
                      {header.column.getIsSorted() === "desc" ? "▼" : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {truncatedRows.map((row) => (
              <tr key={row.id} className="border-b border-slate-800/60 text-slate-200 hover:bg-slate-900/80">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2">
                    <span className="line-clamp-2 break-words text-slate-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
