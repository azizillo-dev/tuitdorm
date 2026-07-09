"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, ChevronRight, UserCheck, Shield } from "lucide-react";

interface TopBarProps {
  currentRole: "SUPER_ADMIN" | "BLOCK_HEAD" | "FLOOR_HEAD" | "ASSISTANT";
  currentScope?: string;
  selectedBlock?: string | null;
  onBlockChange?: (block: string | null) => void;
  selectedFloor?: number | null;
  onFloorChange?: (floor: number | null) => void;
}

const BLOCKS = ["A-Blok", "B-Blok", "C-Blok", "D-Blok"];
const FLOORS = [4, 3, 2, 1];

export function TopBar({
  currentRole,
  currentScope,
  selectedBlock = null,
  onBlockChange,
  selectedFloor = null,
  onFloorChange,
}: TopBarProps) {
  const { isDark, toggleTheme } = useTheme();

  const isSuperOrBuilding = currentRole === "SUPER_ADMIN";
  const isBlockHead = currentRole === "BLOCK_HEAD";
  const isReadOnlyScope = currentRole === "FLOOR_HEAD" || currentRole === "ASSISTANT";

  return (
    <header className="sticky top-0 z-30 h-16 bg-topbar border-b border-divider flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Interactive Breadcrumb Scope Selector (FIX 3) */}
      <div className="flex items-center space-x-2 font-mono text-xs sm:text-sm">
        <span className="text-muted font-bold hidden sm:inline">KO&apos;LAM:</span>
        <div className="flex items-center space-x-1.5">
          <Shield className="w-4 h-4 text-accent shrink-0 hidden md:inline" />

          {/* Block Selector */}
          {isSuperOrBuilding && onBlockChange ? (
            <select
              value={selectedBlock || ""}
              onChange={(e) => {
                const val = e.target.value || null;
                onBlockChange(val);
                if (!val && onFloorChange) onFloorChange(null);
              }}
              aria-label="Blokni tanlang"
              className="bg-surface text-main font-semibold border border-divider px-2.5 py-1 rounded-[8px] shadow-xs focus:outline-none focus:border-accent cursor-pointer text-xs sm:text-sm"
            >
              <option value="">Barcha Bloklar (Umumiy)</option>
              {BLOCKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-main font-semibold bg-surface border border-divider px-2.5 py-1 rounded-[8px] shadow-xs text-xs sm:text-sm">
              {isBlockHead || isReadOnlyScope ? "A-Blok" : selectedBlock || "Barcha Bloklar"}
            </div>
          )}

          <span className="text-muted font-bold">/</span>

          {/* Floor Selector */}
          {(isSuperOrBuilding || isBlockHead) && onFloorChange ? (
            <select
              value={selectedFloor !== null && selectedFloor !== undefined ? selectedFloor : ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                onFloorChange(val);
                // If drilling into floor while in Super Admin mode without block, default to A-Blok
                if (val !== null && !selectedBlock && onBlockChange && isSuperOrBuilding) {
                  onBlockChange("A-Blok");
                }
              }}
              disabled={isSuperOrBuilding && !selectedBlock}
              aria-label="Qavatni tanlang"
              className="bg-surface text-main font-semibold border border-divider px-2.5 py-1 rounded-[8px] shadow-xs focus:outline-none focus:border-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              <option value="">Barcha Qavatlar</option>
              {FLOORS.map((f) => (
                <option key={f} value={f}>
                  {f}-Qavat (~30 talaba)
                </option>
              ))}
            </select>
          ) : (
            <div className="text-main font-semibold bg-surface border border-divider px-2.5 py-1 rounded-[8px] shadow-xs text-xs sm:text-sm">
              {isReadOnlyScope ? "3-Qavat (Faqat O'z Hududi)" : selectedFloor ? `${selectedFloor}-Qavat` : "Barcha Qavatlar"}
            </div>
          )}
        </div>
      </div>

      {/* Right Side Controls & Profile */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Tungi/kungi rejimni o'zgartirish"
          className="p-2 rounded-[8px] border border-divider bg-surface text-sub hover:text-main hover:border-accent transition-all duration-150 flex items-center justify-center shadow-xs"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#D49F3D]" />
          ) : (
            <Moon className="w-4 h-4 text-ink" />
          )}
        </button>

        {/* User Profile Summary */}
        <div className="flex items-center space-x-3 pl-4 border-l border-divider">
          <div className="w-8 h-8 rounded-[8px] bg-ink text-surface flex items-center justify-center font-mono font-bold text-xs border border-sidebarborder shadow-xs">
            {currentRole === "SUPER_ADMIN" ? "SA" : currentRole === "BLOCK_HEAD" ? "BM" : "QM"}
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-main leading-tight">
              {currentRole === "SUPER_ADMIN" ? "Tizim Administratori" : currentRole === "BLOCK_HEAD" ? "Blok Mudiri" : "Raximov U."}
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
