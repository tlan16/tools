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
  useSidebar,
} from "@/components/ui/sidebar"
import { Key, Home, Shield, Bug } from "lucide-react"
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
  const { isMobile, setOpenMobile } = useSidebar()

  const closeIfMobile = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">
            <Link href="/" onClick={closeIfMobile}>
              Tools
            </Link>
          </h2>
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
                      <item.icon />
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
