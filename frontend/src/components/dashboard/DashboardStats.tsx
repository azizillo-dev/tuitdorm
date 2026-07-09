"use client";

import React from "react";
import { Users, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalStudents: number;
    presentCount: number;
    excusedCount: number;
    unexcusedCount: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const presentPercent = Math.round((stats.presentCount / stats.totalStudents) * 100) || 0;
  const excusedPercent = Math.round((stats.excusedCount / stats.totalStudents) * 100) || 0;
  const unexcusedPercent = Math.round((stats.unexcusedCount / stats.totalStudents) * 100) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Students Card */}
      <div className="bg-surface border border-divider border-t-[3px] border-t-accent rounded-[2px] p-4 sm:p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-divider mb-3">
          <span className="text-xs font-mono font-bold uppercase text-sub tracking-wider">
            JAMI TALABALAR
          </span>
          <Users className="w-4 h-4 text-accent" />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-3xl font-bold text-main tracking-tight">
            {stats.totalStudents}
          </span>
          <span className="font-mono text-xs text-sub">100% RO&apos;YXAT</span>
        </div>
      </div>

      {/* Present (Bor) Card */}
      <div className="bg-surface border border-divider border-t-[3px] border-t-accent rounded-[2px] p-4 sm:p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-divider mb-3">
          <span className="text-xs font-mono font-bold uppercase text-sub tracking-wider">
            BOR (PRESENT)
          </span>
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "var(--status-present)" }} />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-3xl font-bold text-main tracking-tight">
            {stats.presentCount}
          </span>
          <span className="font-mono text-xs font-bold text-[#3A7D5C]">
            {presentPercent}%
          </span>
        </div>
      </div>

      {/* Excused (Sababli yo'q) Card */}
      <div className="bg-surface border border-divider border-t-[3px] border-t-accent rounded-[2px] p-4 sm:p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-divider mb-3">
          <span className="text-xs font-mono font-bold uppercase text-sub tracking-wider">
            SABABLI YO&apos;Q
          </span>
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: "var(--status-excused)" }} />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-3xl font-bold text-main tracking-tight">
            {stats.excusedCount}
          </span>
          <span className="font-mono text-xs font-bold text-[#C08A2E]">
            {excusedPercent}%
          </span>
        </div>
      </div>

      {/* Unexcused (Sababsiz yo'q) Card */}
      <div className="bg-surface border border-divider border-t-[3px] border-t-accent rounded-[2px] p-4 sm:p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-divider mb-3">
          <span className="text-xs font-mono font-bold uppercase text-sub tracking-wider">
            SABABSIZ YO&apos;Q
          </span>
          <span className="w-2.5 h-2.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: "var(--status-unexcused)" }} />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-3xl font-bold text-main tracking-tight">
            {stats.unexcusedCount}
          </span>
          <span className="font-mono text-xs font-bold text-[#B23B3B]">
            {unexcusedPercent}% (DIQQAT)
          </span>
        </div>
      </div>
    </div>
  );
}
