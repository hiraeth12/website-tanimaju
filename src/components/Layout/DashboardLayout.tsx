// src/components/layout/DashboardLayout.tsx (responsive)

import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "@/pages/dashboard/Sidebar/Sidebar"; 
import { TopBar } from "@/pages/dashboard/TopBar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed width, full height */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:relative lg:transform-none lg:shadow-none lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile header - only show on mobile */}
        <div className="flex items-center justify-between px-4 py-4 border-b lg:hidden">
          <span className="text-lg font-semibold">Dashboard</span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100 text-xl"
          >
            ×
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Main content area - flex to fill remaining space */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header - only show on mobile */}
        <div className="lg:hidden bg-white border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-1 rounded-md hover:bg-gray-100 text-xl"
          >
            ☰
          </button>
          <span className="text-lg font-semibold">Dashboard</span>
          <div className="w-6" />
        </div>

        {/* TopBar - only show on desktop */}
        <div className="hidden lg:block flex-shrink-0">
          <TopBar />
        </div>
        
        {/* Page content - scrollable area */}
        <div className="flex-1 overflow-auto px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};