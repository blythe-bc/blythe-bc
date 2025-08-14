import fs from "fs";
import path from "path";
import { parse as csvParse } from "csv-parse/sync";
import * as XLSX from "xlsx";

export type Table = { columns: string[]; rows: Record<string, unknown>[] };

export function readFileAsTable(absPath: string, opts?: { delimiter?: string; sheet?: string; maxRows?: number }): Table {
	const ext = path.extname(absPath).toLowerCase();
	if (ext === ".csv" || ext === ".tsv") {
		const delimiter = opts?.delimiter ?? (ext === ".tsv" ? "\t" : ",");
		const content = fs.readFileSync(absPath, "utf8");
		const records = csvParse(content, { columns: true, skip_empty_lines: true, delimiter }) as Record<string, unknown>[];
		const columns = records.length > 0 ? Object.keys(records[0]) : [];
		return { columns, rows: limitRows(records, opts?.maxRows) };
	}
	if (ext === ".xlsx" || ext === ".xls") {
		const wb = XLSX.read(fs.readFileSync(absPath));
		const sheetName = opts?.sheet ?? wb.SheetNames[0];
		const ws = wb.Sheets[sheetName];
		const json = XLSX.utils.sheet_to_json(ws, { defval: null }) as Record<string, unknown>[];
		const columns = json.length > 0 ? Object.keys(json[0]) : [];
		return { columns, rows: limitRows(json, opts?.maxRows) };
	}
	if (ext === ".json") {
		const text = fs.readFileSync(absPath, "utf8");
		const data = JSON.parse(text) as unknown;
		const rows: Record<string, unknown>[] = Array.isArray(data)
			? (data as unknown[]).map((r) => (isObjectRecord(r) ? r : { value: r }))
			: isObjectRecord(data)
				? [data]
				: [{ value: data }];
		const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
		return { columns, rows: limitRows(rows, opts?.maxRows) };
	}
	throw new Error(`Unsupported extension: ${ext}`);
}

function limitRows<T>(rows: T[], maxRows?: number): T[] {
	if (!maxRows || rows.length <= maxRows) return rows;
	return rows.slice(0, maxRows);
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}