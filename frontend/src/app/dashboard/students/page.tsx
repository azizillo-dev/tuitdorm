"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Search, Filter, ChevronLeft, ChevronRight, Download, Users, Database, ShieldAlert, Loader2 } from "lucide-react";

interface StudentDirectoryItem {
  id: string;
  studentId: string;
  fullName: string;
  block: string;
  floor: number;
  roomNumber: string;
  faculty: string;
  phone: string;
  status: "PRESENT" | "EXCUSED" | "UNEXCUSED";
}

// Simulated total dataset size for 2200+ scalability
const TOTAL_STUDENTS_COUNT = 2240;
const PAGE_SIZE = 25;
const TOTAL_PAGES = Math.ceil(TOTAL_STUDENTS_COUNT / PAGE_SIZE);

// Helper to generate simulated server-side page data
function generatePageData(page: number, search: string, blockFilter: string, facultyFilter: string): StudentDirectoryItem[] {
  const startIdx = (page - 1) * PAGE_SIZE;
  const faculties = ["Kompyuter injiniringi", "Dasturiy injiniring", "Axborot xavfsizligi", "Telekom. texnologiyalari", "Kiberxavfsizlik"];
  const blocks = ["A-Blok", "B-Blok", "C-Blok", "D-Blok"];
  
  const results: StudentDirectoryItem[] = [];
  for (let i = 0; i < PAGE_SIZE; i++) {
    const globalIdx = startIdx + i + 1;
    if (globalIdx > TOTAL_STUDENTS_COUNT) break;
    
    const block = blockFilter && blockFilter !== "ALL" ? blockFilter : blocks[globalIdx % 4];
    const floor = (globalIdx % 4) + 1;
    const room = `${floor}0${(globalIdx % 12) + 1}`;
    const faculty = facultyFilter && facultyFilter !== "ALL" ? facultyFilter : faculties[globalIdx % 5];
    
    // Simulate search filtering
    const fullName = `Talaba ${globalIdx} — ${globalIdx % 2 === 0 ? "Karimov" : "Abdullayev"} ${globalIdx % 3 === 0 ? "Jasur" : "Shaxzod"} o'g'li`;
    const studentId = `TTJ-${1000 + globalIdx}`;
    
    if (search && !fullName.toLowerCase().includes(search.toLowerCase()) && !studentId.toLowerCase().includes(search.toLowerCase())) {
      continue;
    }

    results.push({
      id: `std-${globalIdx}`,
      studentId,
      fullName,
      block,
      floor,
      roomNumber: room,
      faculty,
      phone: `+998 90 123 ${String(45 + (globalIdx % 50)).padStart(2, "0")} ${String(globalIdx % 99).padStart(2, "0")}`,
      status: globalIdx % 15 === 0 ? "UNEXCUSED" : globalIdx % 8 === 0 ? "EXCUSED" : "PRESENT",
    });
  }
  return results;
}

export default function StudentsDirectoryPage() {
  const [currentRole, setCurrentRole] = useState<"SUPER_ADMIN" | "BLOCK_HEAD" | "FLOOR_HEAD" | "ASSISTANT">("SUPER_ADMIN");
  
  // API Query Parameter state
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [blockFilter, setBlockFilter] = useState<string>("ALL");
  const [facultyFilter, setFacultyFilter] = useState<string>("ALL");

  // Loading skeleton state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<StudentDirectoryItem[]>([]);

  // Debounce search input to avoid flood of requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Simulate Server-Side Paginated Fetch via API (PageNumberPagination / CursorPagination)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const data = generatePageData(page, debouncedSearch, blockFilter, facultyFilter);
      setStudents(data);
      setIsLoading(false);
    }, 450); // Simulate network round-trip delay showing loading skeleton
    return () => clearTimeout(timer);
  }, [page, debouncedSearch, blockFilter, facultyFilter]);

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-page text-main">
      {/* Left Sidebar ~240px */}
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar
          currentRole={currentRole}
          currentScope={
            currentRole === "SUPER_ADMIN"
              ? "Barcha Binolar (Paginated 2200+ Reestr)"
              : currentRole === "BLOCK_HEAD"
              ? "A-Blok Reestri"
              : "3-Qavat Talabalari"
          }
        />

        {/* Scrollable Content Area with isolated scroll region */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-divider">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-[8px] bg-surface border border-divider text-xs font-mono font-bold text-accent mb-2 shadow-xs">
                <Database className="w-3.5 h-3.5" />
                <span>SERVER-SIDE PAGINATION API (?page={page}&page_size={PAGE_SIZE})</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-main leading-tight">
                Talabalar Umumiy Reestri ({TOTAL_STUDENTS_COUNT} nafar talaba)
              </h1>
              <p className="text-sub text-xs sm:text-sm font-sans mt-1">
                2200+ nafar talabaning ma&apos;lumotlari sahifalangan holatda (PageNumberPagination / CursorPagination) yuklanadi.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0 font-mono text-xs text-sub bg-surface p-2.5 rounded-[8px] border border-divider shadow-xs">
              <ShieldAlert className="w-4 h-4 text-[#C08A2E] shrink-0" />
              <span>NAMOYISH REJIMI: real Student API Faza 2/3&apos;da ulanadi</span>
            </div>
          </div>

          {/* DRF Backend Architecture Specification Banner */}
          <div className="p-4 bg-surface border border-divider border-l-[4px] border-l-accent rounded-[8px] shadow-xs text-xs font-mono">
            <span className="font-bold text-main block mb-1">BACKEND METODOLOGIYASI (PHASE 2/3 DRF SPEC):</span>
            `GET /api/v1/students/?page={page}&page_size={PAGE_SIZE}&search={debouncedSearch || "None"}&block={blockFilter}` so&apos;rovi orqali faqat joriy sahifaga kerakli 25 ta talaba yozuvi bazadan olinadi (`QuerySet.filter().paginate()`). Bu usul barcha 2200+ talabaning client-side xotirani to&apos;ldirishiga va mobil brauzerlarning qotib qolishiga (`lag/freeze`) yo&apos;l qo&apos;ymaydi.
          </div>

          {/* Search and Server-Side Filter Controls */}
          <div className="bg-surface border border-divider rounded-[8px] p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Talaba F.I.SH yoki ID (masalan, TTJ-1045) bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-page border border-divider rounded-[8px] text-xs font-mono text-main placeholder:text-muted focus:outline-none focus:border-accent shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 font-mono text-xs">
                <Filter className="w-3.5 h-3.5 text-muted" />
                <span className="text-sub">Blok:</span>
                <select
                  value={blockFilter}
                  onChange={(e) => {
                    setBlockFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-page border border-divider rounded-[8px] px-2.5 py-1.5 text-main font-semibold shadow-xs focus:outline-none focus:border-accent cursor-pointer"
                >
                  <option value="ALL">Barcha bloklar</option>
                  <option value="A-Blok">A-Blok</option>
                  <option value="B-Blok">B-Blok</option>
                  <option value="C-Blok">C-Blok</option>
                  <option value="D-Blok">D-Blok</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-sub">Fakultet:</span>
                <select
                  value={facultyFilter}
                  onChange={(e) => {
                    setFacultyFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-page border border-divider rounded-[8px] px-2.5 py-1.5 text-main font-semibold shadow-xs focus:outline-none focus:border-accent cursor-pointer"
                >
                  <option value="ALL">Barcha fakultetlar</option>
                  <option value="Kompyuter injiniringi">Kompyuter injiniringi</option>
                  <option value="Dasturiy injiniring">Dasturiy injiniring</option>
                  <option value="Axborot xavfsizligi">Axborot xavfsizligi</option>
                  <option value="Telekom. texnologiyalari">Telekom. texnologiyalari</option>
                </select>
              </div>

              <button
                onClick={() => alert(`Paginated Excel export: ${TOTAL_STUDENTS_COUNT} ta talaba reestri eksport qilinmoqda...`)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-ink text-surface hover:bg-accent rounded-[8px] text-xs font-mono font-bold transition-colors shadow-xs ml-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EXCEL REESTR EXPORT</span>
              </button>
            </div>
          </div>

          {/* Paginated Data Table or Loading Skeleton */}
          <div className="bg-surface border border-divider rounded-[8px] shadow-xs overflow-hidden">
            {isLoading ? (
              /* Loading Skeleton State (Never feels frozen during network wait) */
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-center py-6 space-x-3 text-accent font-mono text-sm font-bold">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>API ORQALI SAHIFALANGAN MA&apos;LUMOTLAR YUKLANMOQDA (`page={page}&page_size={PAGE_SIZE}`)...</span>
                </div>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-10 bg-page animate-pulse rounded-[4px] border border-divider w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-page border-b-2 border-divider text-[11px] font-mono font-bold text-sub uppercase tracking-wider">
                      <th className="p-3 border-r border-divider">Talaba ID</th>
                      <th className="p-3 border-r border-divider">F.I.SH</th>
                      <th className="p-3 border-r border-divider text-center">Blok</th>
                      <th className="p-3 border-r border-divider text-center">Xona</th>
                      <th className="p-3 border-r border-divider">Fakultet</th>
                      <th className="p-3 border-r border-divider">Telefon</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider font-sans">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-sub font-mono text-sm">
                          So&apos;rovga mos talabalar topilmadi. Qidiruv parametrlari: &quot;{searchQuery}&quot;
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="hover:bg-page/70 transition-colors">
                          <td className="p-3 border-r border-divider font-mono font-bold text-main whitespace-nowrap">
                            {student.studentId}
                          </td>
                          <td className="p-3 border-r border-divider font-semibold text-main">
                            {student.fullName}
                          </td>
                          <td className="p-3 border-r border-divider font-mono text-center">
                            <span className="inline-block px-2 py-0.5 rounded-[4px] bg-page border border-divider font-bold text-accent">
                              {student.block}
                            </span>
                          </td>
                          <td className="p-3 border-r border-divider font-mono font-bold text-center">
                            {student.roomNumber}
                          </td>
                          <td className="p-3 border-r border-divider text-main max-w-[180px] truncate">
                            {student.faculty}
                          </td>
                          <td className="p-3 border-r border-divider font-mono text-sub whitespace-nowrap">
                            {student.phone}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-[4px] font-mono text-[10px] font-bold border ${
                                student.status === "PRESENT"
                                  ? "bg-[#3A7D5C]/10 text-[#3A7D5C] border-[#3A7D5C]"
                                  : student.status === "EXCUSED"
                                  ? "bg-[#C08A2E]/10 text-[#C08A2E] border-[#C08A2E]"
                                  : "bg-[#B23B3B]/10 text-[#B23B3B] border-[#B23B3B]"
                              }`}
                            >
                              {student.status === "PRESENT"
                                ? "BOR"
                                : student.status === "EXCUSED"
                                ? "SABABLI"
                                : "SABABSIZ"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Footer Controls */}
            <div className="p-4 bg-page border-t border-divider flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="text-sub">
                Ko&apos;rsatilmoqda: <span className="font-bold text-main">{(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, TOTAL_STUDENTS_COUNT)}</span> / Jami <span className="font-bold text-main">{TOTAL_STUDENTS_COUNT}</span> nafar talaba
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1 || isLoading}
                  className="px-3 py-1.5 bg-surface hover:bg-divider border border-divider rounded-[8px] font-bold text-main disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Oldingi</span>
                </button>

                <div className="px-3 py-1.5 bg-surface border border-divider rounded-[8px] font-bold text-main shadow-xs">
                  Sahifa {page} / {TOTAL_PAGES}
                </div>

                <button
                  onClick={() => setPage((prev) => Math.min(TOTAL_PAGES, prev + 1))}
                  disabled={page === TOTAL_PAGES || isLoading}
                  className="px-3 py-1.5 bg-surface hover:bg-divider border border-divider rounded-[8px] font-bold text-main disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs flex items-center space-x-1"
                >
                  <span>Keyingi</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
