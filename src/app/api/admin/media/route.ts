import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readdir, stat } from "fs/promises";
import path from "path";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    let entries: string[] = [];
    try { entries = await readdir(dir); } catch { return NextResponse.json({ ok: true, files: [] }); }
    const files = await Promise.all(entries.filter((f) => !f.startsWith(".")).map(async (name) => {
      const s = await stat(path.join(dir, name));
      const ext = name.split(".").pop()?.toLowerCase() || "";
      return { name, url: `/uploads/${name}`, size: s.size, type: ["mp4","webm","mov","avi","mkv","ogg","3gp"].includes(ext) ? "video" : "image", mtime: s.mtime.toISOString() };
    }));
    files.sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime());
    return NextResponse.json({ ok: true, files });
  } catch (error) { console.error("[media GET]", error); return NextResponse.json({ ok: false, error: "Error" }, { status: 500 }); }
}
