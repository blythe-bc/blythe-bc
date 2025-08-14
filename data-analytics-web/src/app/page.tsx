"use client";

import { useEffect, useMemo, useState } from "react";
import Chart from "@/components/Chart";
import type { Table } from "@/lib/parse";

type FileItem = { name: string; relPath: string; size: number; mtimeMs: number };

export default function Home() {
	const [files, setFiles] = useState<FileItem[]>([]);
	const [selectedRelPath, setSelectedRelPath] = useState<string>("");
	const [table, setTable] = useState<Table | null>(null);
	const [xCol, setXCol] = useState<string>("");
	const [yCols, setYCols] = useState<string[]>([]);

	useEffect(() => {
		fetch(`/api/files?exts=.csv,.tsv,.xlsx,.xls,.json`).then((r) => r.json()).then((d) => {
			if (d.ok) setFiles(d.files);
		});
	}, []);

	useEffect(() => {
		if (!selectedRelPath) return;
		fetch(`/api/preview?relPath=${encodeURIComponent(selectedRelPath)}`).then((r) => r.json()).then((d) => {
			if (d.ok) {
				setTable(d.table);
				if (!xCol && d.table.columns.length > 0) setXCol(d.table.columns[0]);
				if (yCols.length === 0 && d.table.columns.length > 1) setYCols(d.table.columns.slice(1, Math.min(4, d.table.columns.length)));
			}
		});
	}, [selectedRelPath]);

	const xValues = useMemo(() => {
		if (!table || !xCol) return [] as (string | number)[];
		return table.rows.map((r) => toCategoryValue(r[xCol]));
	}, [table, xCol]);

	const series = useMemo(() => {
		if (!table) return [] as { name: string; data: (number | null)[] }[];
		return yCols.map((col) => ({ name: col, data: table.rows.map((r) => toNumericValue(r[col])) }));
	}, [table, yCols]);

	return (
		<div className="min-h-screen p-6 sm:p-10 space-y-6">
			<h1 className="text-2xl font-semibold">Data Analytics Web</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-1 space-y-3">
					<label className="text-sm font-medium">Files</label>
					<select className="w-full border rounded p-2" value={selectedRelPath} onChange={(e) => setSelectedRelPath(e.target.value)}>
						<option value="">Select a file...</option>
						{files.map((f) => (
							<option key={f.relPath} value={f.relPath}>{f.name}</option>
						))}
					</select>

					{table && (
						<div className="space-y-2">
							<label className="text-sm font-medium">X Column</label>
							<select className="w-full border rounded p-2" value={xCol} onChange={(e) => setXCol(e.target.value)}>
								{table.columns.map((c) => (
									<option key={c} value={c}>{c}</option>
								))}
							</select>
							<label className="text-sm font-medium">Y Columns</label>
							<select multiple className="w-full border rounded p-2 h-40" value={yCols} onChange={(e) => setYCols(Array.from(e.target.selectedOptions).map((o) => o.value))}>
								{table.columns.filter((c) => c !== xCol).map((c) => (
									<option key={c} value={c}>{c}</option>
								))}
							</select>
						</div>
					)}
				</div>
				<div className="md:col-span-2">
					<Chart title={selectedRelPath ? selectedRelPath : "Preview"} x={xValues} series={series} height={420} />
				</div>
			</div>
		</div>
	);
}

function toCategoryValue(v: unknown): string | number {
	if (v == null) return "";
	if (typeof v === "number") return v;
	if (v instanceof Date) return v.toISOString();
	return String(v);
}

function toNumericValue(v: unknown): number | null {
	if (v == null) return null;
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : null;
}
