import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
const ALLOWED = {
  image: ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"],
  video: ["mp4", "webm", "mov", "avi", "mkv", "ogg", "3gp"],
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "FormData inválido" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No se encontró el archivo (campo 'file')" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ ok: false, error: "El archivo está vacío" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { ok: false, error: `El archivo supera el límite de ${MAX_SIZE / 1024 / 1024} MB` },
      { status: 413 }
    );
  }

  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const isImage = ALLOWED.image.includes(ext);
  const isVideo = ALLOWED.video.includes(ext);
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { ok: false, error: `Extensión no permitida: .${ext}. Permitidas: ${[...ALLOWED.image, ...ALLOWED.video].join(", ")}` },
      { status: 415 }
    );
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "archivo";
    const hash = crypto.randomBytes(4).toString("hex");
    const filename = `${base}-${hash}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;
    await logActivity({
      action: "upload",
      entity: "media",
      entityName: filename,
      username: auth.username,
      details: `${isVideo ? "video" : "image"} · ${(file.size / 1024).toFixed(0)} KB`,
    });

    return NextResponse.json({
      ok: true,
      url,
      name: filename,
      size: file.size,
      type: isVideo ? "video" : "image",
    });
  } catch (error) {
    console.error("[upload POST]", error);
    return NextResponse.json({ ok: false, error: "No se pudo guardar el archivo" }, { status: 500 });
  }
}
