"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, ShieldCheck } from "lucide-react";

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-divider transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Wordmark */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-ink text-surface flex items-center justify-center rounded-[8px] shadow-xs font-mono font-bold text-lg tracking-tight border border-sidebarborder">
            TATU
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-main text-base sm:text-lg leading-tight tracking-tight">
              Yotoqxonalar Boshqaruv Tizimi
            </span>
            <span className="text-[11px] font-mono text-sub uppercase tracking-wider">
              Rasmiy Ma&apos;muriy Axborot Tizimi
            </span>
          </div>
        </Link>

        {/* Navigation Links & Action Buttons */}
        <div className="flex items-center space-x-6 sm:space-x-8">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-sub">
            <a
              href="#grid-schematic"
              className="hover:text-main transition-colors duration-150 py-1 border-b-2 border-transparent hover:border-accent"
            >
              Tizim sxemasi
            </a>
            <a
              href="#features"
              className="hover:text-main transition-colors duration-150 py-1 border-b-2 border-transparent hover:border-accent"
            >
              Funksiyalar
            </a>
            <a
              href="#contact"
              className="hover:text-main transition-colors duration-150 py-1 border-b-2 border-transparent hover:border-accent"
            >
              Aloqa
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Tungi/kungi rejimni o'zgartirish"
              className="p-2 rounded-[8px] shadow-xs border border-divider bg-page text-sub hover:text-main hover:border-accent transition-all duration-150 flex items-center justify-center"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#D49F3D]" />
              ) : (
                <Moon className="w-4 h-4 text-ink" />
              )}
            </button>

            {/* Kirish Button */}
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 bg-ink text-surface px-4 py-2 text-sm font-medium rounded-[8px] shadow-xs border border-sidebarborder hover:bg-accent hover:border-accent transition-colors duration-150 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-surface" />
              <span>Tizimga kirish</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
