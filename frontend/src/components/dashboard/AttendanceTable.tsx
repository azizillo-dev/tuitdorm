"use client";

import React, { useState } from "react";
import { Search, ArrowUpDown, Filter, Download, Check, Clock, XCircle } from "lucide-react";

export interface StudentRow {
  id: string;
  studentId: string;
  fullName: string;
  roomNumber: string;
  faculty: string;
  attendancePercent: number;
  unexcusedDays: number;
  status: "PRESENT" | "EXCUSED" | "UNEXCUSED";
  lastMarked: string;
}

interface AttendanceTableProps {
  data: StudentRow[];
  onStatusChange: (studentId: string, newStatus: "PRESENT" | "EXCUSED" | "UNEXCUSED") => void;
  canEdit: boolean;
}

export function AttendanceTable({ data, onStatusChange, canEdit }: AttendanceTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [sortField, setSortField] = useState<keyof StudentRow>("roomNumber");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: keyof StudentRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredData = data
    .filter((row) => {
      const matchQuery =
        row.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === "ALL" || row.status === filterStatus;
      return matchQuery && matchStatus;
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  return (
    <div className="bg-surface border border-divider rounded-[8px] shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-divider flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Talaba F.I.SH, Xona raqami yoki ID bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-page border border-divider rounded-[8px] text-xs font-mono text-main placeholder:text-muted focus:outline-none focus:border-accent shadow-xs"
          />
        </div>

        {/* Filter and Export Controls */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center space-x-1.5 bg-page border border-divider rounded-[8px] p-1 text-xs font-mono shadow-xs">
            <Filter className="w-3.5 h-3.5 text-muted ml-1" />
            {(["ALL", "PRESENT", "EXCUSED", "UNEXCUSED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 rounded-[6px] transition-colors ${
                  filterStatus === status
                    ? "bg-ink text-surface font-semibold"
                    : "text-sub hover:text-main"
                }`}
              >
                {status === "ALL"
                  ? "Barchasi"
                  : status === "PRESENT"
                  ? "Bor"
                  : status === "EXCUSED"
                  ? "Sababli"
                  : "Sababsiz"}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert("Excel (.xlsx) hisobot yuklandi: A-Blok_3-Qavat_Jurnal.xlsx")}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-page hover:bg-divider text-main border border-divider rounded-[8px] text-xs font-mono transition-colors shrink-0 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            <span>EXCEL YUKLASH</span>
          </button>
        </div>
      </div>

      {/* Dense Institutional Table with Horizontal Scroll & Sticky First Column */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-page border-b-2 border-divider text-[11px] font-mono font-bold text-sub uppercase tracking-wider">
              {/* Sticky first column: Student Name + Room */}
              <th
                onClick={() => handleSort("fullName")}
                className="sticky left-0 z-20 bg-page p-3 border-r border-divider cursor-pointer hover:text-main whitespace-nowrap min-w-[180px] sm:min-w-[220px]"
              >
                <div className="flex items-center space-x-1">
                  <span>Talaba F.I.SH / Xona</span>
                  <ArrowUpDown className="w-3 h-3 text-muted" />
                </div>
              </th>

              <th
                onClick={() => handleSort("studentId")}
                className="p-3 border-r border-divider cursor-pointer hover:text-main whitespace-nowrap"
              >
                <div className="flex items-center space-x-1">
                  <span>ID Raqam</span>
                  <ArrowUpDown className="w-3 h-3 text-muted" />
                </div>
              </th>

              <th
                onClick={() => handleSort("faculty")}
                className="p-3 border-r border-divider cursor-pointer hover:text-main whitespace-nowrap"
              >
                <div className="flex items-center space-x-1">
                  <span>Fakultet</span>
                  <ArrowUpDown className="w-3 h-3 text-muted" />
                </div>
              </th>

              <th
                onClick={() => handleSort("attendancePercent")}
                className="p-3 border-r border-divider cursor-pointer hover:text-main text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Davomat %</span>
                  <ArrowUpDown className="w-3 h-3 text-muted" />
                </div>
              </th>

              <th
                onClick={() => handleSort("unexcusedDays")}
                className="p-3 border-r border-divider cursor-pointer hover:text-main text-right whitespace-nowrap"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Sababsiz kunlar</span>
                  <ArrowUpDown className="w-3 h-3 text-muted" />
                </div>
              </th>

              <th
                onClick={() => handleSort("status")}
                className="p-3 border-r border-divider cursor-pointer hover:text-main whitespace-nowrap"
              >
                <div className="flex items-center space-x-1">
                  <span>Joriy Holat</span>
                  <ArrowUpDown className="w-3 h-3 text-muted" />
                </div>
              </th>

              <th className="p-3 whitespace-nowrap min-w-[240px]">
                <span>Davomat Qayd Etish (Tezkor tugmalar)</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-divider font-sans">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sub font-mono text-xs">
                  Talabalar topilmadi (qidiruv so&apos;rovini o&apos;zgartiring)
                </td>
              </tr>
            ) : (
              filteredData.map((row) => {
                return (
                  <tr
                    key={row.id}
                    className="group border-b border-divider hover:bg-page/80 transition-colors"
                  >
                    {/* Sticky first column: Student Name + Room Badge */}
                    <td className="sticky left-0 z-10 bg-card group-hover:bg-page p-3 border-r border-divider">
                      <div className="font-semibold text-main truncate max-w-[170px] sm:max-w-[200px]">
                        {row.fullName}
                      </div>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="inline-block px-1.5 py-0.5 rounded-[2px] bg-page border border-divider font-mono text-[10px] font-bold text-accent">
                          {row.roomNumber}-XONA
                        </span>
                        <span className="text-[10px] font-mono text-muted">
                          {row.lastMarked}
                        </span>
                      </div>
                    </td>

                    {/* Monospace Student ID */}
                    <td className="p-3 border-r border-divider font-mono text-sub font-medium whitespace-nowrap">
                      {row.studentId}
                    </td>

                    {/* Faculty */}
                    <td className="p-3 border-r border-divider text-sub whitespace-nowrap">
                      {row.faculty}
                    </td>

                    {/* Monospace Attendance % */}
                    <td className="p-3 border-r border-divider text-right font-mono font-bold whitespace-nowrap">
                      <span
                        className={
                          row.attendancePercent < 80
                            ? "text-[#B23B3B]"
                            : row.attendancePercent < 90
                            ? "text-[#C08A2E]"
                            : "text-[#3A7D5C]"
                        }
                      >
                        {row.attendancePercent.toFixed(1)}%
                      </span>
                    </td>

                    {/* Monospace Unexcused Days */}
                    <td className="p-3 border-r border-divider text-right font-mono font-bold whitespace-nowrap">
                      <span className={row.unexcusedDays >= 3 ? "text-[#B23B3B] font-bold border border-[#B23B3B] px-1.5 py-0.5 rounded-[4px]" : "text-sub"}>
                        {row.unexcusedDays} kun
                      </span>
                    </td>

                    {/* Colorblind Accessible Status: Dot + Explicit Label Text */}
                    <td className="p-3 border-r border-divider whitespace-nowrap">
                      <div className="inline-flex items-center space-x-2 font-mono text-xs font-semibold">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                          style={{
                            backgroundColor:
                              row.status === "PRESENT"
                                ? "var(--status-present)"
                                : row.status === "EXCUSED"
                                ? "var(--status-excused)"
                                : "var(--status-unexcused)",
                          }}
                        />
                        <span
                          className={
                            row.status === "PRESENT"
                              ? "text-[#3A7D5C]"
                              : row.status === "EXCUSED"
                              ? "text-[#C08A2E]"
                              : "text-[#B23B3B]"
                          }
                        >
                          {row.status === "PRESENT" && "Bor (Present)"}
                          {row.status === "EXCUSED" && "Sababli (Excused)"}
                          {row.status === "UNEXCUSED" && "Sababsiz (Unex)"}
                        </span>
                      </div>
                    </td>

                    {/* Attendance Marking Buttons (Thumb-friendly touch targets min 44px on mobile) */}
                    <td className="p-2 sm:p-3 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        {/* BOR Button */}
                        <button
                          onClick={() => canEdit && onStatusChange(row.id, "PRESENT")}
                          disabled={!canEdit}
                          aria-label="Bor deb qayd etish"
                          className={`min-h-[44px] min-w-[56px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-[4px] font-mono text-xs font-bold border transition-all flex items-center justify-center space-x-1 ${
                            row.status === "PRESENT"
                              ? "bg-[#3A7D5C] text-white border-[#3A7D5C] shadow-xs"
                              : "bg-page text-muted border-divider hover:bg-[#3A7D5C] hover:text-white hover:border-[#3A7D5C]"
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Bor</span>
                        </button>

                        {/* SABABLI Button */}
                        <button
                          onClick={() => canEdit && onStatusChange(row.id, "EXCUSED")}
                          disabled={!canEdit}
                          aria-label="Sababli deb qayd etish"
                          className={`min-h-[44px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 rounded-[4px] font-mono text-xs font-bold border transition-all flex items-center justify-center space-x-1 ${
                            row.status === "EXCUSED"
                              ? "bg-[#C08A2E] text-white border-[#C08A2E] shadow-xs"
                              : "bg-page text-muted border-divider hover:bg-[#C08A2E] hover:text-white hover:border-[#C08A2E]"
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Sababli</span>
                        </button>

                        {/* SABABSIZ Button */}
                        <button
                          onClick={() => canEdit && onStatusChange(row.id, "UNEXCUSED")}
                          disabled={!canEdit}
                          aria-label="Sababsiz deb qayd etish"
                          className={`min-h-[44px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 rounded-[4px] font-mono text-xs font-bold border transition-all flex items-center justify-center space-x-1 ${
                            row.status === "UNEXCUSED"
                              ? "bg-[#B23B3B] text-white border-[#B23B3B] shadow-xs"
                              : "bg-page text-muted border-divider hover:bg-[#B23B3B] hover:text-white hover:border-[#B23B3B]"
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Sababsiz</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-page border-t border-divider flex items-center justify-between font-mono text-xs text-sub">
        <span>KO&apos;RSATILMOQDA: {filteredData.length} TA TALABA QAYDI</span>
        <span>OXIRGI SINKRONIZATSIYA: BUGUN 21:50:00</span>
      </div>
    </div>
  );
}
