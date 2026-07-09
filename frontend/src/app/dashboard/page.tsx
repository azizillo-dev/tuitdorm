"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AttendanceCharts } from "@/components/dashboard/AttendanceCharts";
import { AttendanceTable, StudentRow } from "@/components/dashboard/AttendanceTable";
import { AlertCircle, FileSpreadsheet, PlusCircle, ShieldCheck } from "lucide-react";

const INITIAL_STUDENTS: StudentRow[] = [
  {
    id: "s1",
    studentId: "TTJ-101",
    fullName: "Abdullayev Shaxzod Raxim o'g'li",
    roomNumber: "304",
    faculty: "Kompyuter injiniringi",
    attendancePercent: 96.8,
    unexcusedDays: 0,
    status: "PRESENT",
    lastMarked: "21:40:15",
  },
  {
    id: "s2",
    studentId: "TTJ-102",
    fullName: "Karimov Jasur Alisher o'g'li",
    roomNumber: "304",
    faculty: "Dasturiy injiniring",
    attendancePercent: 88.5,
    unexcusedDays: 1,
    status: "EXCUSED",
    lastMarked: "21:41:00",
  },
  {
    id: "s3",
    studentId: "TTJ-103",
    fullName: "Toshmatov Bobur Sanjar o'g'li",
    roomNumber: "304",
    faculty: "Axborot xavfsizligi",
    attendancePercent: 72.0,
    unexcusedDays: 3,
    status: "UNEXCUSED",
    lastMarked: "21:45:12",
  },
  {
    id: "s4",
    studentId: "TTJ-104",
    fullName: "Raximov Ulug'bek Dilshod o'g'li",
    roomNumber: "304",
    faculty: "Telekom. texnologiyalari",
    attendancePercent: 98.2,
    unexcusedDays: 0,
    status: "PRESENT",
    lastMarked: "21:40:30",
  },
  {
    id: "s5",
    studentId: "TTJ-105",
    fullName: "Ergashev Sardor Mumin o'g'li",
    roomNumber: "305",
    faculty: "Kompyuter injiniringi",
    attendancePercent: 94.0,
    unexcusedDays: 0,
    status: "PRESENT",
    lastMarked: "21:42:10",
  },
  {
    id: "s6",
    studentId: "TTJ-106",
    fullName: "Olimov Bekzod Kadirovich",
    roomNumber: "305",
    faculty: "Dasturiy injiniring",
    attendancePercent: 91.5,
    unexcusedDays: 1,
    status: "PRESENT",
    lastMarked: "21:42:25",
  },
  {
    id: "s7",
    studentId: "TTJ-107",
    fullName: "Saidov Doston Azamatovich",
    roomNumber: "305",
    faculty: "Axborot xavfsizligi",
    attendancePercent: 68.4,
    unexcusedDays: 4,
    status: "UNEXCUSED",
    lastMarked: "21:48:00",
  },
  {
    id: "s8",
    studentId: "TTJ-108",
    fullName: "Nazarov Farrux Tolibovich",
    roomNumber: "305",
    faculty: "Telekom. texnologiyalari",
    attendancePercent: 85.0,
    unexcusedDays: 2,
    status: "EXCUSED",
    lastMarked: "21:43:15",
  },
];

export default function DashboardShellPage() {
  const [currentRole, setCurrentRole] = useState<"SUPER_ADMIN" | "BLOCK_HEAD" | "FLOOR_HEAD" | "ASSISTANT">("FLOOR_HEAD");
  const [students, setStudents] = useState<StudentRow[]>(INITIAL_STUDENTS);

  const scopeString =
    currentRole === "SUPER_ADMIN"
      ? "Barcha Binolar / 4 ta Blok / 16 ta Qavat"
      : currentRole === "BLOCK_HEAD"
      ? "A-Blok / Barcha 4 ta Qavat"
      : "A-Blok / 3-Qavat (Xonalar 301 - 312)";

  const canEditAttendance = currentRole === "FLOOR_HEAD" || currentRole === "ASSISTANT" || currentRole === "BLOCK_HEAD" || currentRole === "SUPER_ADMIN";

  const handleStatusChange = (studentId: string, newStatus: "PRESENT" | "EXCUSED" | "UNEXCUSED") => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          let unexcusedDiff = 0;
          if (student.status === "UNEXCUSED" && newStatus !== "UNEXCUSED") unexcusedDiff = -1;
          if (student.status !== "UNEXCUSED" && newStatus === "UNEXCUSED") unexcusedDiff = 1;

          return {
            ...student,
            status: newStatus,
            unexcusedDays: Math.max(0, student.unexcusedDays + unexcusedDiff),
            lastMarked: new Date().toLocaleTimeString("en-GB"),
          };
        }
        return student;
      })
    );
  };

  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const excusedCount = students.filter((s) => s.status === "EXCUSED").length;
  const unexcusedCount = students.filter((s) => s.status === "UNEXCUSED").length;

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-page text-main">
      {/* Left Sidebar ~240px */}
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar currentRole={currentRole} currentScope={scopeString} />

        {/* Scrollable Content Area with generous padding and isolated scroll region */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Dashboard Header / Welcome & Context Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-divider">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-main leading-tight">
                {currentRole === "SUPER_ADMIN" && "Universitet Davomat Muvofiqlashtirish Paneli"}
                {currentRole === "BLOCK_HEAD" && "A-Blok Ma'muriy Davomat Paneli"}
                {currentRole === "FLOOR_HEAD" && "3-Qavat Davomat Jurnali va Nazorati"}
                {currentRole === "ASSISTANT" && "3-Qavat Maslahatchi Yordamchisi Paneli"}
              </h1>
              <p className="text-sub text-xs sm:text-sm font-sans mt-1">
                Joriy sana: {new Date().toLocaleDateString("uz-UZ", { day: "2-digit", month: "long", year: "numeric" })} | 
                Qayd etish vaqti normativi: 21:00 — 22:30
              </p>
            </div>

            {/* Quick Action Bar */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => alert("Rasmiy dekanat ogohlantirishi yuborildi!")}
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-page hover:border-[#B23B3B] text-[#B23B3B] border border-divider rounded-[2px] text-xs font-mono font-semibold transition-colors shadow-xs"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>DEKANATGA XABAR (3 KUN+)</span>
              </button>

              {currentRole !== "ASSISTANT" && (
                <button
                  onClick={() => alert("Yangi talaba xonaga biriktirildi.")}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 bg-ink text-surface hover:bg-accent rounded-[2px] text-xs font-mono font-semibold transition-colors shadow-xs border border-sidebarborder"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>TALABA QO&apos;SHISH</span>
                </button>
              )}
            </div>
          </div>

          {/* Institutional Alert Banner for Unexcused Absences (Single accent border on solid white card) */}
          {unexcusedCount > 0 && (
            <div className="p-4 bg-surface border border-divider border-l-[4px] border-l-[#B23B3B] rounded-[2px] shadow-xs flex items-start sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-[#B23B3B] shrink-0" />
                <div>
                  <span className="font-bold text-main block">NAZORAT DIQQATIGA: {unexcusedCount} TA TALABA SABABSIZ KELMADI</span>
                  <span className="text-sub font-sans text-[11px]">
                    Ushbu talabalar bo&apos;yicha dalolatnoma tuzilishini yoki dekanatga xabarnoma jo&apos;natilishini tasdiqlang.
                  </span>
                </div>
              </div>
              <button
                onClick={() => alert("Dalolatnoma shablonlari PDF va Word formatida yuklandi.")}
                className="px-3 py-1.5 bg-[#B23B3B] text-white rounded-[2px] font-bold text-[11px] shrink-0 hover:bg-[#993333] transition-colors shadow-xs"
              >
                DALOLATNOMA TUZISH
              </button>
            </div>
          )}

          {/* KPI Summary Cards */}
          <DashboardStats
            stats={{
              totalStudents: students.length,
              presentCount,
              excusedCount,
              unexcusedCount,
            }}
          />

          {/* Main Dense Sortable Data Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-xl text-main">
                Talabalar davomat jurnali ({scopeString})
              </h2>
              <span className="font-mono text-xs text-sub">
                Tahrirlash huquqi: <span className="text-accent font-bold">{canEditAttendance ? "MAVJUD (BOR/YO'Q)" : "FAQAT KO'RISH"}</span>
              </span>
            </div>
            <AttendanceTable
              data={students}
              onStatusChange={handleStatusChange}
              canEdit={canEditAttendance}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
