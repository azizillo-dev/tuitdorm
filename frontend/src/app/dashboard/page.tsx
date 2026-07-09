"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AttendanceTable, StudentRow } from "@/components/dashboard/AttendanceTable";
import { AlertCircle, Building2, ChevronRight, FileSpreadsheet, Layers, PlusCircle, ShieldCheck, Users, ArrowLeft } from "lucide-react";

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

const BLOCK_SUMMARIES = [
  { id: "A-Blok", name: "A-Blok (Asosiy Bino)", students: 560, occupancy: 94.8, present: 531, excused: 19, unexcused: 10 },
  { id: "B-Blok", name: "B-Blok (O'quv-Yotoq)", students: 580, occupancy: 91.2, present: 529, excused: 31, unexcused: 20 },
  { id: "C-Blok", name: "C-Blok (Talabalar uyi #3)", students: 540, occupancy: 96.5, present: 521, excused: 15, unexcused: 4 },
  { id: "D-Blok", name: "D-Blok (Talabalar uyi #4)", students: 520, occupancy: 89.4, present: 465, excused: 35, unexcused: 20 },
];

const FLOOR_SUMMARIES = [
  { floor: 4, name: "4-Qavat (Xonalar 401 - 415)", students: 30, occupancy: 96.6, present: 29, excused: 1, unexcused: 0 },
  { floor: 3, name: "3-Qavat (Xonalar 301 - 315)", students: 30, occupancy: 93.3, present: 28, excused: 1, unexcused: 1 },
  { floor: 2, name: "2-Qavat (Xonalar 201 - 215)", students: 30, occupancy: 90.0, present: 27, excused: 2, unexcused: 1 },
  { floor: 1, name: "1-Qavat (Xonalar 101 - 115)", students: 30, occupancy: 100.0, present: 30, excused: 0, unexcused: 0 },
];

export default function DashboardShellPage() {
  const [currentRole, setCurrentRole] = useState<"SUPER_ADMIN" | "BLOCK_HEAD" | "FLOOR_HEAD" | "ASSISTANT">("FLOOR_HEAD");
  const [students, setStudents] = useState<StudentRow[]>(INITIAL_STUDENTS);

  // Scalability Drill-Down State
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  // Lock Flow State (FIX 3)
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimestamp, setLockTimestamp] = useState<string | null>(null);

  // BACKEND NOTE (Phase 3): This localStorage lock mirrors the future DRF attendance_date unique constraint
  // and DailyAttendanceReport.is_locked field so that once attendance is locked, no further edits are permitted.
  useEffect(() => {
    const dateKey = new Date().toISOString().split("T")[0];
    const storageKey = `attendance_lock_${dateKey}_${selectedBlock || "A-Blok"}_${selectedFloor || 3}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.students) {
          setStudents(parsed.students);
          setIsLocked(parsed.isLocked || false);
          setLockTimestamp(parsed.lockTimestamp || null);
          return;
        }
      } catch (e) {
        // ignore
      }
    }
    // If no lock for today or parsing failed, load fresh
    setStudents(
      INITIAL_STUDENTS.map((s) => ({
        ...s,
        isDraft: false,
        markedToday: false,
        reason: "",
      }))
    );
    setIsLocked(false);
    setLockTimestamp(null);
  }, [selectedBlock, selectedFloor]);

  // Handle role changes gracefully resetting or locking drill-down state
  const handleRoleChange = (role: "SUPER_ADMIN" | "BLOCK_HEAD" | "FLOOR_HEAD" | "ASSISTANT") => {
    setCurrentRole(role);
    if (role === "SUPER_ADMIN") {
      setSelectedBlock(null);
      setSelectedFloor(null);
    } else if (role === "BLOCK_HEAD") {
      setSelectedBlock("A-Blok");
      setSelectedFloor(null);
    } else {
      setSelectedBlock("A-Blok");
      setSelectedFloor(3);
    }
  };

  const handleStatusChange = (studentId: string, newStatus: "PRESENT" | "EXCUSED" | "UNEXCUSED", reason?: string) => {
    if (isLocked) return;
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
            isDraft: true,
            markedToday: true,
            reason: reason !== undefined ? reason : student.reason || "",
          };
        }
        return student;
      })
    );
  };

  const handleSaveAndLock = (unmarkedResolution?: "MARK_UNEXCUSED") => {
    const nowStr = new Date().toLocaleTimeString("en-GB");
    const nextStudents = students.map((student) => {
      const isUnmarked = !student.markedToday && !student.isDraft;
      if (unmarkedResolution === "MARK_UNEXCUSED" && isUnmarked) {
        return {
          ...student,
          status: "UNEXCUSED" as const,
          unexcusedDays: student.unexcusedDays + 1,
          lastMarked: nowStr,
          isDraft: false,
          markedToday: true,
          reason: "Avtomatik (Belgilanmagan)",
        };
      }
      return {
        ...student,
        isDraft: false,
        markedToday: true,
        lastMarked: student.isDraft || isUnmarked ? nowStr : student.lastMarked,
      };
    });

    setStudents(nextStudents);
    setIsLocked(true);
    setLockTimestamp(nowStr);

    const dateKey = new Date().toISOString().split("T")[0];
    const storageKey = `attendance_lock_${dateKey}_${selectedBlock || "A-Blok"}_${selectedFloor || 3}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        isLocked: true,
        lockTimestamp: nowStr,
        students: nextStudents,
      })
    );
  };

  const handleResetDemoLock = () => {
    const dateKey = new Date().toISOString().split("T")[0];
    const storageKey = `attendance_lock_${dateKey}_${selectedBlock || "A-Blok"}_${selectedFloor || 3}`;
    localStorage.removeItem(storageKey);
    setIsLocked(false);
    setLockTimestamp(null);
    setStudents(
      INITIAL_STUDENTS.map((s) => ({
        ...s,
        isDraft: false,
        markedToday: false,
        reason: "",
      }))
    );
  };

  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const excusedCount = students.filter((s) => s.status === "EXCUSED").length;
  const unexcusedCount = students.filter((s) => s.status === "UNEXCUSED").length;

  // FIX 1: Restrict attendance editing to FLOOR_HEAD and ASSISTANT only.
  // SUPER_ADMIN and BLOCK_HEAD must ALWAYS see the attendance table as read-only (view/oversight only).
  const canEditAttendance = currentRole === "FLOOR_HEAD" || currentRole === "ASSISTANT";

  // Compute what scope string to show or use for TopBar
  const isSuper = currentRole === "SUPER_ADMIN";
  const isBlockHead = currentRole === "BLOCK_HEAD";

  // Determine current active view mode: "BLOCKS_OVERVIEW" | "FLOORS_OVERVIEW" | "STUDENTS_TABLE"
  const viewMode =
    isSuper && !selectedBlock && selectedFloor === null
      ? "BLOCKS_OVERVIEW"
      : (isSuper || isBlockHead) && selectedFloor === null
      ? "FLOORS_OVERVIEW"
      : "STUDENTS_TABLE";

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-page text-main">
      {/* Left Sidebar ~240px */}
      <Sidebar currentRole={currentRole} onRoleChange={handleRoleChange} />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar
          currentRole={currentRole}
          selectedBlock={isSuper ? selectedBlock : "A-Blok"}
          onBlockChange={(block) => {
            setSelectedBlock(block);
            if (!block) setSelectedFloor(null);
          }}
          selectedFloor={selectedFloor}
          onFloorChange={(floor) => {
            setSelectedFloor(floor);
          }}
        />

        {/* Scrollable Content Area with generous padding and isolated scroll region */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Dashboard Header / Welcome & Context Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-divider">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-main leading-tight flex items-center gap-2">
                {viewMode === "BLOCKS_OVERVIEW" && "Barcha Binolar va Bloklar Davomat Paneli (2200+ talaba)"}
                {viewMode === "FLOORS_OVERVIEW" && `${selectedBlock || "A-Blok"} — Qavatlar Bo'yicha Ma'muriy Tahlil`}
                {viewMode === "STUDENTS_TABLE" && `${selectedBlock || "A-Blok"}, ${selectedFloor || 3}-Qavat Davomat Jurnali (~30 talaba)`}
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
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-page hover:border-[#B23B3B] text-[#B23B3B] border border-divider rounded-[8px] text-xs font-mono font-semibold transition-colors shadow-xs"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>DEKANATGA XABAR</span>
              </button>

              {currentRole !== "ASSISTANT" && (
                <button
                  onClick={() => alert("Yangi talaba xonaga biriktirildi.")}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 bg-ink text-surface hover:bg-accent rounded-[8px] text-xs font-mono font-semibold transition-colors shadow-xs border border-sidebarborder"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>TALABA QO&apos;SHISH</span>
                </button>
              )}
            </div>
          </div>

          {/* Institutional Alert Banner for Unexcused Absences (Single accent border on solid white card) */}
          {unexcusedCount > 0 && viewMode === "STUDENTS_TABLE" && (
            <div className="p-4 bg-surface border border-divider border-l-[4px] border-l-[#B23B3B] rounded-[8px] shadow-xs flex items-start sm:items-center justify-between gap-4 font-mono text-xs">
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
                className="px-3 py-1.5 bg-[#B23B3B] text-white rounded-[8px] font-bold text-[11px] shrink-0 hover:bg-[#993333] transition-colors shadow-xs"
              >
                DALOLATNOMA TUZISH
              </button>
            </div>
          )}

          {/* Breadcrumb / Back Navigation when drilled down */}
          {viewMode !== "BLOCKS_OVERVIEW" && isSuper && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (viewMode === "STUDENTS_TABLE" && selectedBlock) {
                    setSelectedFloor(null);
                  } else {
                    setSelectedBlock(null);
                    setSelectedFloor(null);
                  }
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-surface hover:bg-sidebaractive border border-divider rounded-[8px] text-xs font-mono font-semibold text-accent shadow-xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>
                  {viewMode === "STUDENTS_TABLE"
                    ? `Orqaga (${selectedBlock || "A-Blok"} Qavatlar ro'yxatiga)`
                    : "Orqaga (Barcha Bloklar ro'yxatiga)"}
                </span>
              </button>
            </div>
          )}

          {viewMode === "STUDENTS_TABLE" && isBlockHead && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedFloor(null)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-surface hover:bg-sidebaractive border border-divider rounded-[8px] text-xs font-mono font-semibold text-accent shadow-xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Orqaga (A-Blok Barcha Qavatlariga)</span>
              </button>
            </div>
          )}

          {/* VIEW MODE 1: BLOCKS OVERVIEW (For Super Admin default, 2200+ students summarized into 4 cards) */}
          {viewMode === "BLOCKS_OVERVIEW" && (
            <div className="space-y-4">
              <div className="p-4 bg-surface border border-divider border-l-[4px] border-l-accent rounded-[8px] shadow-xs text-xs font-mono">
                <span className="font-bold text-main block mb-0.5">SCALABILITY ARCHITECTURE (2200+ TALABA):</span>
                Superadmin yoki Bino mudiriga 2200 ta talaba birdaniga yassi jadval (`flat table`) bo&apos;lib yuklanmaydi — bu tizimni 
                qotishidan saqlaydi. Blokni tanlab qavatga, qavatdan esa faqat o&apos;sha qavatdagi ~30 ta talaba jadvaliga o&apos;tiladi.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {BLOCK_SUMMARIES.map((block) => (
                  <div
                    key={block.id}
                    onClick={() => {
                      setSelectedBlock(block.id);
                      setSelectedFloor(null);
                    }}
                    className="bg-surface border border-divider border-t-[3px] border-t-accent rounded-[8px] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between border-b border-divider pb-3">
                      <div>
                        <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[6px] bg-accent/10 text-accent font-mono text-[11px] font-bold mb-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{block.id}</span>
                        </div>
                        <h3 className="font-serif font-bold text-lg text-main group-hover:text-accent transition-colors">
                          {block.name}
                        </h3>
                      </div>
                      <span className="font-mono text-2xl font-bold text-main">
                        {block.occupancy}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center py-1">
                      <div className="p-2 bg-page border border-divider rounded-[6px]">
                        <span className="block text-sub text-[10px]">BOR</span>
                        <span className="font-bold text-[#3A7D5C] text-sm">{block.present}</span>
                      </div>
                      <div className="p-2 bg-page border border-divider rounded-[6px]">
                        <span className="block text-sub text-[10px]">SABABLI</span>
                        <span className="font-bold text-[#C08A2E] text-sm">{block.excused}</span>
                      </div>
                      <div className="p-2 bg-page border border-divider rounded-[6px]">
                        <span className="block text-sub text-[10px]">SABABSIZ</span>
                        <span className="font-bold text-[#B23B3B] text-sm">{block.unexcused}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-divider">
                      <span className="text-sub">Jami talabalar: {block.students} ta</span>
                      <span className="text-accent font-bold inline-flex items-center group-hover:translate-x-1 transition-transform">
                        Qavatlarni ko&apos;rish <ChevronRight className="w-4 h-4 ml-0.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: FLOORS OVERVIEW (For Block Head default or Super Admin drilled down into block) */}
          {viewMode === "FLOORS_OVERVIEW" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {FLOOR_SUMMARIES.map((floorItem) => (
                  <div
                    key={floorItem.floor}
                    onClick={() => setSelectedFloor(floorItem.floor)}
                    className="bg-surface border border-divider border-t-[3px] border-t-accent rounded-[8px] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-divider pb-2.5">
                      <span className="font-mono text-sm font-bold text-main group-hover:text-accent transition-colors">
                        {floorItem.floor}-QAVAT
                      </span>
                      <span className="font-mono text-sm font-bold text-[#3A7D5C]">
                        {floorItem.occupancy}%
                      </span>
                    </div>

                    <p className="font-sans text-xs text-sub leading-tight">
                      {floorItem.name} (~30 talaba)
                    </p>

                    <div className="grid grid-cols-3 gap-1 font-mono text-[11px] text-center">
                      <div className="p-1.5 bg-page border border-divider rounded-[4px]">
                        <span className="block text-sub text-[9px]">BOR</span>
                        <span className="font-bold text-[#3A7D5C]">{floorItem.present}</span>
                      </div>
                      <div className="p-1.5 bg-page border border-divider rounded-[4px]">
                        <span className="block text-sub text-[9px]">SABAB</span>
                        <span className="font-bold text-[#C08A2E]">{floorItem.excused}</span>
                      </div>
                      <div className="p-1.5 bg-page border border-divider rounded-[4px]">
                        <span className="block text-sub text-[9px]">YO&apos;Q</span>
                        <span className="font-bold text-[#B23B3B]">{floorItem.unexcused}</span>
                      </div>
                    </div>

                    <div className="text-right pt-2 border-t border-divider font-mono text-xs text-accent font-bold">
                      <span className="inline-flex items-center group-hover:translate-x-1 transition-transform">
                        Jurnalga o&apos;tish <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW MODE 3: STUDENTS TABLE (~30 students on a specific Floor) */}
          {viewMode === "STUDENTS_TABLE" && (
            <>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="font-serif font-bold text-xl text-main">
                    Talabalar davomat jurnali ({selectedBlock || "A-Blok"}, {selectedFloor || 3}-Qavat)
                  </h2>
                  <span className="font-mono text-xs text-sub">
                    Tahrirlash huquqi: <span className="text-accent font-bold">{canEditAttendance ? "MAVJUD (BOR/YO'Q)" : "FAQAT KO'RISH"}</span>
                  </span>
                </div>
                <AttendanceTable
                  data={students}
                  onStatusChange={handleStatusChange}
                  canEdit={canEditAttendance}
                  isLocked={isLocked}
                  lockTimestamp={lockTimestamp}
                  onSaveAndLock={handleSaveAndLock}
                  onResetDemoLock={handleResetDemoLock}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
