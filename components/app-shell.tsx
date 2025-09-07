"use client";
import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {AppTopbar} from "@/components/app-topbar";
import React from "react";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";


export default function AppShell({children}: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())


  return (
    <SidebarProvider>
      <QueryClientProvider client={queryClient}>
        <div className="flex w-full h-svh">
          <AppSidebar/>
          <div className="flex flex-col flex-1 min-w-0">
            <AppTopbar/>
            <main className="flex-1 overflow-y-auto overflow-x-clip">
              {children}
            </main>
          </div>
        </div>
      </QueryClientProvider>
    </SidebarProvider>
  );
}
