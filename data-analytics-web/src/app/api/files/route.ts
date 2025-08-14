import { NextRequest } from "next/server";
import { listFiles, type AllowedExtension } from "@/lib/fs";

export const runtime = "nodejs";

	export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const extsParam = (searchParams.get("exts") || ".csv,.tsv,.xlsx,.xls,.json").split(",").map((s) => s.trim().toLowerCase());
		const allowed = extsParam.filter(Boolean) as AllowedExtension[];
		const subPath = searchParams.get("path") || "";
		const files = listFiles(allowed, subPath);
		return Response.json({ ok: true, files });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return new Response(JSON.stringify({ ok: false, error: message }), { status: 500 });
	}
}