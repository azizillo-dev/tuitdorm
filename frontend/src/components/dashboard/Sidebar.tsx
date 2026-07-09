"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileSpreadsheet,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

interface SidebarProps {
  currentRole: "SUPER_ADMIN" | "BLOCK_HEAD" | "FLOOR_HEAD" | "ASSISTANT";
  onRoleChange: (role: "SUPER_ADMIN" | "BLOCK_HEAD" | "FLOOR_HEAD" | "ASSISTANT") => void;
}

const MENU_ITEMS = [
  { name: "Bosh sahifa", href: "/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "BLOCK_HEAD", "FLOOR_HEAD", "ASSISTANT"] },
  { name: "Talabalar ro'yxati", href: "/dashboard/students", icon: Users, roles: ["SUPER_ADMIN", "BLOCK_HEAD", "FLOOR_HEAD", "ASSISTANT"] },
  { name: "Davomat jurnali", href: "/dashboard/attendance", icon: ClipboardCheck, roles: ["SUPER_ADMIN", "BLOCK_HEAD", "FLOOR_HEAD", "ASSISTANT"] },
  { name: "Hisobotlar (Excel)", href: "/dashboard/reports", icon: FileSpreadsheet, roles: ["SUPER_ADMIN", "BLOCK_HEAD", "FLOOR_HEAD"] },
  { name: "Bino va bloklar", href: "/dashboard/structure", icon: Building2, roles: ["SUPER_ADMIN", "BLOCK_HEAD"] },
  { name: "Tizim sozlamalari", href: "/dashboard/settings", icon: Settings, roles: ["SUPER_ADMIN"] },
];

export function Sidebar({ currentRole, onRoleChange }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredMenu = MENU_ITEMS.filter((item) => item.roles.includes(currentRole));

  const roleNames = {
    SUPER_ADMIN: "Superadmin (Universitet)",
    BLOCK_HEAD: "Blok Sardori (A-Blok)",
    FLOOR_HEAD: "Qavat Maslahatchisi (3-Qavat)",
    ASSISTANT: "Qavat Yordamchisi (3-Qavat)",
  };

  return (
    <>
      {/* Mobile Hamburger Trigger Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-sidebar text-sidebartext flex items-center justify-between px-4 h-14 border-b border-sidebarborder">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Menyuni ochish"
            className="p-2 -ml-2 rounded-[2px] text-sidebartext hover:bg-sidebaractive transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-mono font-bold text-sm">TATU — REESTR</span>
        </div>
        <span className="font-mono text-[11px] px-2 py-0.5 bg-sidebaractive border border-sidebarborder rounded-[2px] text-accent font-semibold">
          {currentRole}
        </span>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-2xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation (~240px width, fixed) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-60 bg-sidebar text-sidebartext border-r border-sidebarborder flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Sidebar Header / Brand */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-sidebarborder">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-surface text-ink flex items-center justify-center rounded-[2px] font-mono font-bold text-sm">
                TTJ
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-sidebartext text-sm tracking-tight leading-none">
                  TATU Davomat
                </span>
                <span className="font-mono text-[10px] text-muted uppercase tracking-wider mt-1">
                  Ma&apos;muriy Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-muted hover:text-sidebartext"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Indicator & Demo Role Switcher (For client verification) */}
          <div className="p-4 border-b border-sidebarborder bg-sidebaractive/50">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted uppercase tracking-wider mb-1.5">
              <span>JORIY LAVOZIM KO&apos;LAMI</span>
              <ShieldAlert className="w-3.5 h-3.5 text-accent" />
            </div>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as any)}
              className="w-full bg-sidebar border border-sidebarborder rounded-[2px] text-xs text-sidebartext py-1.5 px-2 font-mono focus:outline-none focus:border-accent"
            >
              <option value="SUPER_ADMIN">1. SUPER_ADMIN</option>
              <option value="BLOCK_HEAD">2. BLOCK_HEAD</option>
              <option value="FLOOR_HEAD">3. FLOOR_HEAD</option>
              <option value="ASSISTANT">4. ASSISTANT</option>
            </select>
            <div className="mt-1.5 text-[11px] text-sidebartext/80 font-sans truncate">
              {roleNames[currentRole]}
            </div>
          </div>

          {/* Nav Items */}
          <nav className="mt-4 px-2 space-y-1">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 text-xs font-medium transition-colors duration-150 rounded-[0px] ${
                    isActive
                      ? "border-l-4 border-accent bg-sidebaractive text-sidebartext font-semibold"
                      : "text-sidebartext/70 hover:text-sidebartext hover:bg-sidebaractive/50 border-l-4 border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-accent" : "text-muted"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / User & Logout */}
        <div className="p-4 border-t border-sidebarborder">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-[2px] bg-accent/20 border border-sidebarborder flex items-center justify-center font-mono font-bold text-xs shrink-0 text-accent">
                {currentRole === "SUPER_ADMIN" ? "SA" : currentRole === "BLOCK_HEAD" ? "BH" : "FH"}
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-sidebartext truncate">
                  {currentRole === "SUPER_ADMIN" ? "Tizim Administratori" : "Raximov Ulug'bek"}
                </div>
                <div className="text-[10px] font-mono text-muted truncate">
                  {currentRole === "SUPER_ADMIN" ? "ATM Markazi" : "A-Blok, 3-Qavat"}
                </div>
              </div>
            </div>
            <Link
              href="/"
              title="Tizimdan chiqish"
              className="p-1.5 text-muted hover:text-[#B23B3B] hover:bg-sidebaractive rounded-[2px] transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
