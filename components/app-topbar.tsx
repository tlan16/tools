import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppTopbar() {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="w-full h-14 flex items-center px-4 border-b bg-white/80 backdrop-blur z-10">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className="mr-2"
      >
        <PanelLeftIcon className="w-6 h-6" />
      </Button>
    </header>
  );
}
