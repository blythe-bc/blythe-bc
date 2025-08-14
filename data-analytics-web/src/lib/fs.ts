import fs from "fs";
import path from "path";

export type AllowedExtension = ".csv" | ".tsv" | ".xlsx" | ".xls" | ".json";

export function getDataRootDir(): string {
	const envPath = process.env.DATA_ROOT_DIR || "";
	const absPath = path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath);
	if (!absPath) {
		throw new Error("DATA_ROOT_DIR is not set");
	}
	return absPath;
}

export function isAllowedExtension(fileName: string, allowed: AllowedExtension[]): boolean {
	const ext = path.extname(fileName).toLowerCase();
	return allowed.includes(ext as AllowedExtension);
}

export function listFiles(allowed: AllowedExtension[], subPath: string = ""): { name: string; absPath: string; relPath: string; size: number; mtimeMs: number }[] {
	const root = getDataRootDir();
	const base = path.join(root, subPath);
	if (!fs.existsSync(base)) return [];
	const entries = fs.readdirSync(base, { withFileTypes: true });
	const files: { name: string; absPath: string; relPath: string; size: number; mtimeMs: number }[] = [];
	for (const entry of entries) {
		if (entry.isFile()) {
			if (isAllowedExtension(entry.name, allowed)) {
				const abs = path.join(base, entry.name);
				const stat = fs.statSync(abs);
				files.push({
					name: entry.name,
					absPath: abs,
					relPath: path.relative(root, abs),
					size: stat.size,
					mtimeMs: stat.mtimeMs,
				});
			}
		}
	}
	files.sort((a, b) => b.mtimeMs - a.mtimeMs);
	return files;
}

export function resolveWithinRoot(relPath: string): string {
	const root = getDataRootDir();
	const resolved = path.resolve(root, relPath);
	if (!resolved.startsWith(path.resolve(root))) {
		throw new Error("Path traversal detected");
	}
	return resolved;
}