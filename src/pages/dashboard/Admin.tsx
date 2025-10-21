// src/pages/dashboard/Admin.tsx (setelah diperbarui)

import { useEffect } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Dashboard } from "./Dashboard";

export default function Admin() {
  // Set document title
  useEffect(() => {
    document.title = "Dashboard - TaniMaju";
  }, []);

  return (

    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}