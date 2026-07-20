import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

/**
 * Centralized Prisma error → HTTP status mapping.
 *
 * Returns a NextResponse with the appropriate status for known Prisma errors,
 * or null if the error isn't a recognized Prisma error (caller should handle).
 */
export function prismaErrorResponse(error: unknown): NextResponse | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2025: record not found — on delete/update of a non-existent ID
    if (error.code === "P2025") {
      return NextResponse.json({ ok: false, error: "Registro no encontrado." }, { status: 404 });
    }
    // P2002: unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json({ ok: false, error: "Ya existe un registro con esos valores únicos." }, { status: 409 });
    }
    // P2003: foreign key constraint violation
    if (error.code === "P2003") {
      return NextResponse.json({ ok: false, error: "No se puede eliminar: hay registros dependientes." }, { status: 409 });
    }
  }
  return null;
}
