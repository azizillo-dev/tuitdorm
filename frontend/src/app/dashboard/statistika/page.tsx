"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { AttendanceCharts } from "@/components/dashboard/AttendanceCharts";
import { BarChart3, ShieldAlert } from "lucide-react";

export default function StatistikaPage() {
  const [currentRole, setCurrentRole] = useState<"SUPER_ADMIN" | "BLOCK_HEAD" | "FLOOR_HEAD" | "ASSISTANT">("FLOOR_HEAD");

  const scopeString =
    currentRole === "SUPER_ADMIN"
      ? "Barcha Binolar / 4 ta Blok / 16 ta Qavat (Umumiy tahlil)"
      : currentRole === "BLOCK_HEAD"
      ? "A-Blok / Barcha 4 ta Qavat (Blok tahlili)"
      : "A-Blok / 3-Qavat (Faqat 3-qavat trendi)";

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-page text-main">
      {/* Left Sidebar ~240px fixed */}
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar currentRole={currentRole} currentScope={scopeString} />

        {/* Scrollable Content Area with isolated scrolling region */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-divider">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[8px] bg-surface border border-divider text-[11px] font-mono font-bold text-accent mb-2">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>LMS.TUIT.UZ FORMATIDAGI RASMIY STATISTIKA</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-main leading-tight">
                Davomat dinamikasi va analitik hisobotlar
              </h1>
              <p className="text-sub text-xs sm:text-sm font-sans mt-1">
                Foydalanuvchi ruxsati ({currentRole}) bo&apos;yicha ruxsat etilgan grafiklar namoyishi.
              </p>
            </div>

            {currentRole === "FLOOR_HEAD" || currentRole === "ASSISTANT" ? (
              <div className="p-2.5 bg-surface border border-divider rounded-[8px] font-mono text-xs text-sub flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-[#C08A2E] shrink-0" />
                <span>Bloklar taqqoslovi (Chart 2) cheklangan: faqat Bino/Blok mudiri va Superadmin uchun.</span>
              </div>
            ) : null}
          </div>

          {/* Render charts scoped strictly to currentRole */}
          <AttendanceCharts currentRole={currentRole} />

          <div className="p-4 bg-surface border border-divider border-t-[3px] border-t-accent rounded-[8px] font-mono text-xs text-sub">
            <span className="font-bold text-main block mb-1">METODOLOGIK ASOS VA KO&apos;LAM IZOLYATSIYASI:</span>
            Tizim Django REST Framework (DRF) backendidagi `PermissionDenied` va `get_queryset()` filtrlash kurallari bilan 
            to&apos;liq mos holatda ishlaydi. Qavat maslahatchisi (`FLOOR_HEAD`) yoki yordamchisi (`ASSISTANT`) boshqa blok va qavatlarning 
            taqqoslovchi statistikalarini ko&apos;ra olmaydi.
          </div>
        </main>
      </div>
    </div>
  );
}
