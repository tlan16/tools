"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {Key, Home, Shield, Bug, ArrowLeftToLine} from "lucide-react"
import {Button} from "@/components/ui/button"
import Link from "next/link"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Basic Auth",
    url: "/basic-auth",
    icon: Shield,
  },
  {
    title: "Bot Detection",
    url: "/bot-detection",
    icon: Bug,
  },
  {
    title: "SSH Keygen",
    url: "/ssh-keygen",
    icon: Key,
  },
]

export function AppSidebar() {
  const {isMobile, setOpenMobile, state, openMobile} = useSidebar()

  const closeIfMobile = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            <Link href="/" onClick={closeIfMobile}>
              Tools
            </Link>
          </h2>
          {/* Sidebar trigger sits inside the sidebar on desktop */}
          <div className="hidden md:block">
            {state === "expanded" && <SidebarTrigger/>}
          </div>
          {/* Mobile close button visible when the mobile sheet is open */}
          {isMobile && openMobile && (
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close sidebar"
                onClick={() => setOpenMobile(false)}
                className="ml-2"
              >
                <ArrowLeftToLine className="w-4 h-4"/>
              </Button>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} prefetch={true}>
                      <item.icon/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
