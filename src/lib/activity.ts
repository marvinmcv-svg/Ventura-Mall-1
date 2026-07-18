import { db } from "./db";

export async function logActivity(params: {
  action: string;
  entity: string;
  entityId?: string;
  entityName?: string;
  username: string;
  details?: string;
}) {
  try {
    await db.activityLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        entityName: params.entityName || null,
        username: params.username,
        details: params.details || null,
      },
    });
  } catch (e) {
    console.error("[logActivity] failed:", e);
  }
}
