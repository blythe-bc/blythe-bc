import { NextRequest } from "next/server";
import { resolveWithinRoot } from "@/lib/fs";
import { readFileAsTable } from "@/lib/parse";

export const runtime = "nodejs";

	export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const relPath = searchParams.get("relPath");
		if (!relPath) return new Response(JSON.stringify({ ok: false, error: "relPath is required" }), { status: 400 });
		const abs = resolveWithinRoot(relPath);
		const table = readFileAsTable(abs, { maxRows: 100 });
		return Response.json({ ok: true, table });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return new Response(JSON.stringify({ ok: false, error: message }), { status: 500 });
	}
}