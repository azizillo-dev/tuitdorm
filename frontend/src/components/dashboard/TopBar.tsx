"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, ChevronRight, UserCheck, Shield } from "lucide-react";

interface TopBarProps {
  currentRole: "SUPER_ADMIN" | "BLOCK_HEAD" | "FLOOR_HEAD" | "ASSISTANT";
  currentScope: string;
}

export function TopBar({ currentRole, currentScope }: TopBarProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 bg-topbar border-b border-divider flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Breadcrumb Scope Indicator */}
      <div className="flex items-center space-x-2 font-mono text-xs sm:text-sm">
        <span className="text-muted font-bold">KO&apos;LAM:</span>
        <div className="flex items-center space-x-1.5 text-main font-semibold bg-page border border-divider px-2.5 py-1 rounded-[2px] shadow-2xs">
          <Shield className="w-3.5 h-3.5 text-accent" />
          <span>{currentScope}</span>
        </div>
      </div>

      {/* Right Side Controls & Profile */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Tungi/kungi rejimni o'zgartirish"
          className="p-2 rounded-[2px] border border-divider bg-page text-sub hover:text-main hover:border-accent transition-all duration-150 flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#D49F3D]" />
          ) : (
            <Moon className="w-4 h-4 text-ink" />
          )}
        </button>

        {/* User Profile Summary */}
        <div className="flex items-center space-x-3 pl-4 border-l border-divider">
          <div className="w-8 h-8 rounded-[2px] bg-ink text-surface flex items-center justify-center font-mono font-bold text-xs border border-sidebarborder">
            {currentRole === "SUPER_ADMIN" ? "SA" : "UR"}
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-main leading-tight">
              {currentRole === "SUPER_ADMIN" ? "Tizim Administratori" : "Raximov U."}
            </div>
            <div className="text-[10px] font-mono text-sub uppercase">
              {currentRole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
