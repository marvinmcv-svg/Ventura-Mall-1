"use client";

import { useEffect } from "react";
import { AdminPortal } from "@/components/admin/admin-portal";
import { useAdmin } from "@/stores/admin-store";

export default function AdminPage() {
  const { openAdmin } = useAdmin();

  // Open the portal on mount
  useEffect(() => {
    openAdmin();
  }, [openAdmin]);

  return <AdminPortal />;
}
