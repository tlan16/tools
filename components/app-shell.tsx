"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import React from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-full h-svh">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <AppTopbar />
          <main className="flex-1 overflow-y-auto overflow-x-clip">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
