"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useTheme } from "@/components/ThemeProvider";

const TREND_DATA = [
  { date: "01-Iyul", attendance: 94.2, excused: 3.8, unexcused: 2.0 },
  { date: "02-Iyul", attendance: 95.0, excused: 3.5, unexcused: 1.5 },
  { date: "03-Iyul", attendance: 93.1, excused: 4.2, unexcused: 2.7 },
  { date: "04-Iyul", attendance: 96.4, excused: 2.6, unexcused: 1.0 },
  { date: "05-Iyul", attendance: 92.0, excused: 5.0, unexcused: 3.0 },
  { date: "06-Iyul", attendance: 95.8, excused: 3.0, unexcused: 1.2 },
  { date: "07-Iyul", attendance: 97.1, excused: 2.1, unexcused: 0.8 },
  { date: "08-Iyul", attendance: 94.5, excused: 3.9, unexcused: 1.6 },
  { date: "09-Iyul", attendance: 95.4, excused: 3.1, unexcused: 1.5 },
];

const BLOCK_COMPARISON = [
  { name: "A-Blok", present: 412, excused: 18, unexcused: 6 },
  { name: "B-Blok", present: 398, excused: 24, unexcused: 12 },
  { name: "C-Blok", present: 425, excused: 14, unexcused: 5 },
  { name: "D-Blok", present: 405, excused: 21, unexcused: 9 },
];

interface AttendanceChartsProps {
  currentRole?: "SUPER_ADMIN" | "BLOCK_HEAD" | "FLOOR_HEAD" | "ASSISTANT";
}

export function AttendanceCharts({ currentRole = "SUPER_ADMIN" }: AttendanceChartsProps) {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const gridColor = isDark ? "#334155" : "#E5E7EB";
  const textColor = isDark ? "#94A3B8" : "#5C6470";
  const lineColor = isDark ? "#E2E8F0" : "#1A2544";

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <div className="bg-surface border border-divider rounded-[2px] h-80 animate-pulse p-4" />
        <div className="bg-surface border border-divider rounded-[2px] h-80 animate-pulse p-4" />
      </div>
    );
  }

  const showBlockComparison = currentRole === "SUPER_ADMIN" || currentRole === "BLOCK_HEAD";

  return (
    <div className={`grid grid-cols-1 ${showBlockComparison ? "lg:grid-cols-2" : "max-w-4xl"} gap-6 my-6`}>
      {/* Chart 1: 9-Day Attendance Percentage Trend Line Chart */}
      <div className="bg-surface border border-divider border-t-[3px] border-t-accent rounded-[2px] p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-divider mb-4">
          <div>
            <span className="text-[10px] font-mono text-sub uppercase tracking-wider block">
              9 KUNLIK DINAMIKA ({currentRole === "FLOOR_HEAD" ? "3-QAVAT" : "UMUMIY"})
            </span>
            <h3 className="font-serif font-bold text-lg text-main">
              Davomat foizi trendi (%)
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-[#3A7D5C] bg-page border border-divider px-2 py-1 rounded-[2px]">
            O&apos;RTASHA 94.8%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="date"
                stroke={textColor}
                tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickLine={false}
              />
              <YAxis
                domain={[85, 100]}
                stroke={textColor}
                tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                  borderColor: gridColor,
                  borderRadius: "2px",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Davomat %"
                stroke={lineColor}
                strokeWidth={2.5}
                dot={{ r: 4, fill: lineColor }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-[11px] font-mono text-muted text-right">
          * Hech qanday 3D yoki dekorativ grideffektsiz rasmiy grafika
        </div>
      </div>

      {/* Chart 2: Block Comparison Stacked Bar Chart (ONLY for SUPER_ADMIN or BLOCK_HEAD) */}
      {showBlockComparison && (
        <div className="bg-surface border border-divider border-t-[3px] border-t-accent rounded-[2px] p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-divider mb-4">
            <div>
              <span className="text-[10px] font-mono text-sub uppercase tracking-wider block">
                BLOKLAR TAHLILI (KO&apos;LAM RUXSATI MAVJUD)
              </span>
              <h3 className="font-serif font-bold text-lg text-main">
                Bloklar bo&apos;yicha davomat strukturasi
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-main bg-page border border-divider px-2 py-1 rounded-[2px]">
              4 TA BLOK
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BLOCK_COMPARISON} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke={textColor}
                  tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                  tickLine={false}
                />
                <YAxis
                  stroke={textColor}
                  tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                    borderColor: gridColor,
                    borderRadius: "2px",
                    fontSize: "12px",
                    fontFamily: "var(--font-mono)",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    paddingTop: "8px",
                  }}
                />
                <Bar dataKey="present" name="Bor (Present)" fill="var(--status-present)" radius={[1, 1, 0, 0]} />
                <Bar dataKey="excused" name="Sababli (Excused)" fill="var(--status-excused)" radius={[1, 1, 0, 0]} />
                <Bar dataKey="unexcused" name="Sababsiz (Unexcused)" fill="var(--status-unexcused)" radius={[1, 1, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] font-mono text-muted text-right">
            * Rangsiz ham farqlanuvchi aniq mantiqiy satrlar
          </div>
        </div>
      )}
    </div>
  );
}
