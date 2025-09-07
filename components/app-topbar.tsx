import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppTopbar() {
  const { toggleSidebar, isMobile, openMobile, open, state } = useSidebar();
  // Determine whether the sidebar is currently expanded/open.
  const isExpanded = isMobile ? openMobile : open;
  // Show the topbar toggle when on mobile or when the sidebar is collapsed on desktop
  const showTopbarToggle = (isMobile && !openMobile) || state === "collapsed";

  return (
    <header className="w-full h-14 flex items-center px-4 border-b bg-white/80 backdrop-blur z-10">
      {showTopbarToggle && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={isExpanded}
          onClick={toggleSidebar}
          className="mr-2"
        >
          {isExpanded ? (
            <X className="w-6 h-6 transition-opacity" />
          ) : (
            <Menu className="w-6 h-6 transition-opacity" />
          )}
        </Button>
      )}
    </header>
  );
}
