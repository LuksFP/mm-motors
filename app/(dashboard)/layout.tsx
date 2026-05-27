"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Bike,
  Users,
  DollarSign,
  Bell,
  LogOut,
  Menu,
  X,
  CalendarCheck,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/estoque", label: "Estoque", icon: Bike },
  { href: "/crm", label: "CRM", icon: Users },
  { href: "/agendamentos", label: "Test Drive", icon: CalendarCheck },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 flex-col bg-[#0f1117] border-r border-white/5">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Sidebar mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 w-60 flex flex-col bg-[#0f1117] border-r border-white/5">
            <button
              className="absolute top-4 right-4 text-white/40 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <X size={18} />
            </button>
            <SidebarContent pathname={pathname} onNav={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
          <button
            className="md:hidden text-gray-500"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={19} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
              <Image
                src="/logo.png"
                alt="M&M Motos"
                width={28}
                height={28}
                className="object-contain rounded"
              />
              <span className="text-sm font-medium text-gray-700">M&M Motos</span>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

function SidebarContent({
  pathname,
  onNav,
}: {
  pathname: string
  onNav?: () => void
}) {
  return (
    <>
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/5 flex flex-col items-center">
        <Image
          src="/logo.png"
          alt="M&M Motos"
          width={140}
          height={100}
          className="object-contain drop-shadow-md"
          priority
        />
        <p className="text-white/25 text-[10px] mt-1 tracking-wide">Sistema Interno</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onNav}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-orange-500/15 text-orange-400"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <Icon size={16} className={active ? "text-orange-400" : ""} />
              {label}
              {active && <span className="ml-auto w-1 h-1 rounded-full bg-orange-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5">
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </>
  )
}
