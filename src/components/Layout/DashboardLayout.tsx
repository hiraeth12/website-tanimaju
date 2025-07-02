// src/components/layout/DashboardLayout.tsx (disarankan)

import type { ReactNode } from "react";
import { Sidebar } from "@/pages/dashboard/Sidebar/Sidebar"; 
import { TopBar } from "@/pages/dashboard/TopBar"; // 1. Impor TopBar

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="grid gap-4 p-4 grid-cols-[220px,_1fr] font-body">
      <Sidebar />
      {/* Kolom konten utama */}
      <div className="flex flex-col gap-4">
        {/* 2. Letakkan TopBar di sini */}
        <TopBar />
        
        {/* 3. Konten halaman akan dirender di bawah TopBar */}
        <div>{children}</div>
      </div>
    </main>
  );
};