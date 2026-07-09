"use client";

import React, { useState } from "react";
import {
  Search,
  ArrowUpDown,
  Filter,
  Download,
  Check,
  Clock,
  XCircle,
  Lock,
  ShieldAlert,
  AlertTriangle,
  FileText,
  X,
  HelpCircle,
} from "lucide-react";

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
  isDraft?: boolean;
  markedToday?: boolean;
  reason?: string;
}

interface AttendanceTableProps {
  data: StudentRow[];
  onStatusChange: (studentId: string, newStatus: "PRESENT" | "EXCUSED" | "UNEXCUSED", reason?: string) => void;
  canEdit: boolean;
  isLocked: boolean;
  lockTimestamp: string | null;
  onSaveAndLock: (unmarkedResolution?: "MARK_UNEXCUSED") => void;
  onResetDemoLock: () => void;
}

interface ExcusedModalState {
  student: StudentRow;
  presetReason: "Ishda" | "Kursda" | "Uyiga ketdi" | "Boshqa sabab";
  customText: string;
}

interface UnexcusedModalState {
  student: StudentRow;
  customText: string;
}

export function AttendanceTable({
  data,
  onStatusChange,
  canEdit,
  isLocked,
  lockTimestamp,
  onSaveAndLock,
  onResetDemoLock,
}: AttendanceTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [sortField, setSortField] = useState<keyof StudentRow>("roomNumber");
  const [sortAsc, setSortAsc] = useState(true);

  // Reason Modals
  const [excusedModal, setExcusedModal] = useState<ExcusedModalState | null>(null);
  const [unexcusedModal, setUnexcusedModal] = useState<UnexcusedModalState | null>(null);

  // Save Flow Modals
  const [unsetResolutionModal, setUnsetResolutionModal] = useState(false);
  const [confirmSaveModal, setConfirmSaveModal] = useState(false);

  const handleSort = (field: keyof StudentRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const markedCount = data.filter((s) => s.markedToday || s.isDraft || isLocked).length;
  const unsetCount = data.length - markedCount;

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
        ? String(valA || "").localeCompare(String(valB || ""))
        : String(valB || "").localeCompare(String(valA || ""));
    });

  return (
    <div className="bg-surface border border-divider rounded-[8px] shadow-xs overflow-hidden relative">
      {/* Table Header Controls & Draft Save Toolbar */}
      <div className="p-4 border-b border-divider flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-page/50">
        {/* Search Input & Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Talaba F.I.SH, Xona raqami yoki ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-divider rounded-[8px] text-xs font-mono text-main placeholder:text-muted focus:outline-none focus:border-accent shadow-xs"
            />
          </div>

          <div className="flex items-center space-x-1 bg-surface border border-divider rounded-[8px] p-1 text-xs font-mono shadow-xs overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-muted ml-1.5 mr-1 shrink-0" />
            {(["ALL", "PRESENT", "EXCUSED", "UNEXCUSED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 rounded-[6px] transition-colors shrink-0 ${
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
        </div>

        {/* Action Toolbar: Save Button / Lock Status / Excel Export */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-divider">
          {/* Lock / Save Flow UI */}
          {isLocked ? (
            <div className="flex items-center space-x-2.5">
              <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-[8px] bg-[#3A7D5C]/10 border border-[#3A7D5C]/30 text-[#3A7D5C] font-mono text-xs font-bold shadow-xs">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>QAYD ETILDI VA QULFLANDI: {lockTimestamp || "21:55:00"}</span>
              </div>
              <button
                onClick={onResetDemoLock}
                className="px-2.5 py-2 bg-surface hover:bg-divider border border-divider text-sub hover:text-main rounded-[8px] font-mono text-xs shadow-xs transition-colors shrink-0"
                title="Sinov/demoda qulflashni bekor qilish"
              >
                🔓 Demo qulfni ochish
              </button>
            </div>
          ) : canEdit ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (unsetCount > 0) {
                    setUnsetResolutionModal(true);
                  } else {
                    setConfirmSaveModal(true);
                  }
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-ink text-surface hover:bg-accent rounded-[8px] font-mono text-xs font-bold transition-colors shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Saqlash ({markedCount}/{data.length} belgilandi)</span>
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-[8px] bg-surface border border-divider text-sub font-mono text-xs font-semibold shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-muted shrink-0" />
              <span>Faqat ko&apos;rish (Oversight mode — tahrirlash ruxsatsiz)</span>
            </div>
          )}

          <button
            onClick={() => alert("Excel (.xlsx) hisobot yuklandi: A-Blok_3-Qavat_Jurnal.xlsx")}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-surface hover:bg-divider text-main border border-divider rounded-[8px] text-xs font-mono transition-colors shrink-0 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            <span>EXCEL</span>
          </button>
        </div>
      </div>

      {/* Dense Institutional Table with Horizontal Scroll & Sticky First Column */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-page border-b-2 border-divider text-[11px] font-mono font-bold text-sub uppercase tracking-wider">
              <th
                onClick={() => handleSort("fullName")}
                className="sticky left-0 z-20 bg-page p-3 border-r border-divider cursor-pointer hover:text-main whitespace-nowrap min-w-[200px] sm:min-w-[240px]"
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
                className="p-3 border-r border-divider cursor-pointer hover:text-main whitespace-nowrap min-w-[170px]"
              >
                <div className="flex items-center space-x-1">
                  <span>Joriy Holat & Izoh</span>
                  <ArrowUpDown className="w-3 h-3 text-muted" />
                </div>
              </th>

              <th className="p-3 whitespace-nowrap min-w-[260px]">
                <span>Davomat Qayd Etish (Tezkor tugmalar)</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-divider font-sans">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sub font-mono text-xs">
                  Talabalar topilmadi (qidiruv yoki filtrni o&apos;zgartiring)
                </td>
              </tr>
            ) : (
              filteredData.map((row) => {
                const isRowDraft = row.isDraft === true && !isLocked;

                return (
                  <tr
                    key={row.id}
                    className={`group border-b border-divider transition-colors ${
                      isRowDraft
                        ? "bg-[#C08A2E]/5 hover:bg-[#C08A2E]/10 border-l-4 border-l-[#C08A2E]"
                        : "hover:bg-page/80"
                    }`}
                  >
                    {/* Sticky first column: Student Name + Room Badge */}
                    <td
                      className={`sticky left-0 z-10 p-3 border-r border-divider transition-colors ${
                        isRowDraft ? "bg-[#FFFDF9] group-hover:bg-[#FFF9EE]" : "bg-surface group-hover:bg-page"
                      }`}
                    >
                      <div className="font-semibold text-main truncate max-w-[180px] sm:max-w-[210px]">
                        {row.fullName}
                      </div>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="inline-block px-1.5 py-0.5 rounded-[4px] bg-page border border-divider font-mono text-[10px] font-bold text-accent shadow-2xs">
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
                      <span
                        className={
                          row.unexcusedDays >= 3
                            ? "text-[#B23B3B] font-bold border border-[#B23B3B] px-1.5 py-0.5 rounded-[4px]"
                            : "text-sub"
                        }
                      >
                        {row.unexcusedDays} kun
                      </span>
                    </td>

                    {/* Colorblind Accessible Status: Dot + Explicit Label Text + Draft Chip + Reason Note */}
                    <td className="p-3 border-r border-divider whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
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

                          {isRowDraft && (
                            <span className="inline-block px-1.5 py-0.5 rounded-[4px] bg-[#C08A2E]/15 border border-[#C08A2E]/40 text-[#C08A2E] text-[9px] font-mono font-bold tracking-tight">
                              SAQLANMAGAN
                            </span>
                          )}
                        </div>

                        {row.reason && (
                          <div className="text-[10px] font-mono text-sub truncate max-w-[180px] bg-page border border-divider px-1.5 py-0.5 rounded-[4px]">
                            Sabab: {row.reason}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Attendance Marking Buttons OR Read-Only / Locked Badge */}
                    <td className="p-2 sm:p-3 whitespace-nowrap">
                      {isLocked ? (
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-page border border-divider rounded-[4px] font-mono text-xs text-main font-semibold shadow-2xs">
                          <Lock className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span>Qayd etildi ({row.status === "PRESENT" ? "Bor" : row.status === "EXCUSED" ? "Sababli" : "Sababsiz"})</span>
                        </div>
                      ) : !canEdit ? (
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-page border border-divider rounded-[4px] font-mono text-xs text-sub font-medium">
                          <ShieldAlert className="w-3.5 h-3.5 text-muted shrink-0" />
                          <span>Faqat ko&apos;rish (Tahrirlash ruxsatsiz)</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5">
                          {/* BOR Button -> Direct Draft Set */}
                          <button
                            onClick={() => onStatusChange(row.id, "PRESENT", "Bor")}
                            aria-label="Bor deb qayd etish"
                            className={`min-h-[40px] px-3.5 py-1.5 rounded-[4px] font-mono text-xs font-bold border transition-all flex items-center justify-center space-x-1 ${
                              row.status === "PRESENT" && (row.markedToday || row.isDraft)
                                ? "bg-[#3A7D5C] text-white border-[#3A7D5C] shadow-xs ring-2 ring-[#3A7D5C]/30"
                                : "bg-page text-muted border-divider hover:bg-[#3A7D5C] hover:text-white hover:border-[#3A7D5C]"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Bor</span>
                          </button>

                          {/* SABABLI Button -> Opens Excused Modal */}
                          <button
                            onClick={() =>
                              setExcusedModal({
                                student: row,
                                presetReason: "Ishda",
                                customText: row.reason || "",
                              })
                            }
                            aria-label="Sababli deb qayd etish modalini ochish"
                            className={`min-h-[40px] px-3 py-1.5 rounded-[4px] font-mono text-xs font-bold border transition-all flex items-center justify-center space-x-1 ${
                              row.status === "EXCUSED" && (row.markedToday || row.isDraft)
                                ? "bg-[#C08A2E] text-white border-[#C08A2E] shadow-xs ring-2 ring-[#C08A2E]/30"
                                : "bg-page text-muted border-divider hover:bg-[#C08A2E] hover:text-white hover:border-[#C08A2E]"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Sababli</span>
                          </button>

                          {/* SABABSIZ Button -> Opens Unexcused Modal */}
                          <button
                            onClick={() =>
                              setUnexcusedModal({
                                student: row,
                                customText: row.reason && row.reason !== "Sababsiz (Izohsiz)" ? row.reason : "",
                              })
                            }
                            aria-label="Sababsiz deb qayd etish modalini ochish"
                            className={`min-h-[40px] px-3 py-1.5 rounded-[4px] font-mono text-xs font-bold border transition-all flex items-center justify-center space-x-1 ${
                              row.status === "UNEXCUSED" && (row.markedToday || row.isDraft)
                                ? "bg-[#B23B3B] text-white border-[#B23B3B] shadow-xs ring-2 ring-[#B23B3B]/30"
                                : "bg-page text-muted border-divider hover:bg-[#B23B3B] hover:text-white hover:border-[#B23B3B]"
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Sababsiz</span>
                          </button>
                        </div>
                      )}
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

      {/* MODAL 1: EXCUSED (Sababli) REASON CAPTURE (FIX 2) */}
      {excusedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface border border-divider rounded-[8px] max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-divider pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#C08A2E] tracking-wider block">
                  SABABLI YO&apos;QLIK QAYDNOMASI
                </span>
                <h3 className="font-serif font-bold text-lg text-main mt-0.5">
                  {excusedModal.student.fullName}
                </h3>
                <span className="text-xs font-mono text-sub block">
                  Xona: {excusedModal.student.roomNumber} | ID: {excusedModal.student.studentId}
                </span>
              </div>
              <button
                onClick={() => setExcusedModal(null)}
                className="p-1.5 text-muted hover:text-main rounded-[4px] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono font-bold text-sub uppercase">
                Sababni tanlang:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["Ishda", "Kursda", "Uyiga ketdi", "Boshqa sabab"] as const).map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      setExcusedModal({
                        ...excusedModal,
                        presetReason: chip,
                      })
                    }
                    className={`px-3 py-2 rounded-[6px] border font-mono text-xs text-left transition-all ${
                      excusedModal.presetReason === chip
                        ? "bg-ink text-surface border-sidebarborder font-bold shadow-xs"
                        : "bg-page text-main border-divider hover:border-accent"
                    }`}
                  >
                    ● {chip}
                  </button>
                ))}
              </div>

              {excusedModal.presetReason === "Boshqa sabab" && (
                <div className="pt-2">
                  <label className="block text-xs font-mono text-main font-semibold mb-1">
                    Aniq sababni yozish shart:
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: shifoxonada yotibdi, dekan ruxsati..."
                    value={excusedModal.customText}
                    onChange={(e) =>
                      setExcusedModal({
                        ...excusedModal,
                        customText: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-page border border-divider rounded-[8px] font-mono text-xs text-main focus:outline-none focus:border-accent shadow-2xs"
                  />
                  {!excusedModal.customText.trim() && (
                    <span className="text-[10px] font-mono text-[#B23B3B] block mt-1">
                      * &quot;Boshqa sabab&quot; tanlanganda matn kiritilishi shart
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-divider">
              <button
                type="button"
                onClick={() => setExcusedModal(null)}
                className="px-4 py-2 bg-page border border-divider rounded-[8px] font-mono text-xs text-sub hover:text-main transition-colors shadow-2xs"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                disabled={excusedModal.presetReason === "Boshqa sabab" && !excusedModal.customText.trim()}
                onClick={() => {
                  const finalReason =
                    excusedModal.presetReason === "Boshqa sabab"
                      ? excusedModal.customText.trim()
                      : excusedModal.presetReason;
                  onStatusChange(excusedModal.student.id, "EXCUSED", finalReason);
                  setExcusedModal(null);
                }}
                className="px-4 py-2 bg-[#C08A2E] text-white font-mono text-xs font-bold rounded-[8px] hover:bg-[#A87625] transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Saqlash (Draft)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: UNEXCUSED (Sababsiz) OPTIONAL NOTE CAPTURE (FIX 2) */}
      {unexcusedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface border border-divider rounded-[8px] max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-divider pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#B23B3B] tracking-wider block">
                  SABABSIZ QOLDIRISH IZOHI (IXTIYORIY)
                </span>
                <h3 className="font-serif font-bold text-lg text-main mt-0.5">
                  {unexcusedModal.student.fullName}
                </h3>
                <span className="text-xs font-mono text-sub block">
                  Xona: {unexcusedModal.student.roomNumber} | ID: {unexcusedModal.student.studentId}
                </span>
              </div>
              <button
                onClick={() => setUnexcusedModal(null)}
                className="p-1.5 text-muted hover:text-main rounded-[4px] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-sub leading-relaxed font-sans">
                Talaba sababsiz yotoqxonaga kelmagan bo&apos;lsa, uning holati bo&apos;yicha qo&apos;shimcha 
                kontekst qoldirishingiz mumkin (masalan, telefonini ko&apos;tarmadi, xonasidan topilmadi).
              </p>
              <div>
                <label className="block text-xs font-mono text-main font-semibold mb-1">
                  Izoh kiritish (majburiy emas):
                </label>
                <input
                  type="text"
                  placeholder="Masalan: aloqaga chiqmadi, telefon o'chirilgan..."
                  value={unexcusedModal.customText}
                  onChange={(e) =>
                    setUnexcusedModal({
                      ...unexcusedModal,
                      customText: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-page border border-divider rounded-[8px] font-mono text-xs text-main focus:outline-none focus:border-accent shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-divider">
              <button
                type="button"
                onClick={() => setUnexcusedModal(null)}
                className="px-4 py-2 bg-page border border-divider rounded-[8px] font-mono text-xs text-sub hover:text-main transition-colors shadow-2xs"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  onStatusChange(
                    unexcusedModal.student.id,
                    "UNEXCUSED",
                    unexcusedModal.customText.trim() || "Sababsiz (Izohsiz)"
                  );
                  setUnexcusedModal(null);
                }}
                className="px-4 py-2 bg-[#B23B3B] text-white font-mono text-xs font-bold rounded-[8px] hover:bg-[#993333] transition-colors shadow-xs"
              >
                Saqlash (Draft)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SAVE CONFIRM WITH UNSET RESOLUTION (FIX 3) */}
      {unsetResolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface border border-divider border-t-[4px] border-t-[#C08A2E] rounded-[8px] max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3 border-b border-divider pb-3">
              <AlertTriangle className="w-6 h-6 text-[#C08A2E] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif font-bold text-lg text-main">
                  {unsetCount} ta talaba hali belgilanmagan!
                </h3>
                <p className="text-xs font-mono text-sub mt-1">
                  Jami {data.length} nafar talabadan {markedCount} nafarining davomati belgilandi.
                </p>
              </div>
            </div>

            <div className="text-xs font-sans text-sub space-y-2 leading-relaxed">
              <p>
                Davomat jurnalini yakuniy saqlashdan oldin barcha talabalar holati aniqlanishi shart. 
                Siz belgilanmagan qolgan <strong>{unsetCount} nafar talabani</strong> avtomatik ravishda 
                <strong>&quot;Sababsiz&quot;</strong> deb qayd etib saqlashingiz, yoki orqaga qaytib o&apos;zingiz 
                belgilashingiz mumkin.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-divider">
              <button
                type="button"
                onClick={() => setUnsetResolutionModal(false)}
                className="px-4 py-2 bg-page border border-divider rounded-[8px] font-mono text-xs text-main hover:bg-divider transition-colors shadow-2xs text-center font-bold"
              >
                Qaytib belgilash (Bekor qilish)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUnsetResolutionModal(false);
                  onSaveAndLock("MARK_UNEXCUSED");
                }}
                className="px-4 py-2 bg-[#B23B3B] text-white font-mono text-xs font-bold rounded-[8px] hover:bg-[#993333] transition-colors shadow-xs text-center"
              >
                Belgilanmaganlarni &quot;Sababsiz&quot; qilib saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FINAL SAVE & LOCK CONFIRMATION (FIX 3) */}
      {confirmSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface border border-divider border-t-[4px] border-t-[#3A7D5C] rounded-[8px] max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3 border-b border-divider pb-3">
              <Lock className="w-6 h-6 text-[#3A7D5C] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif font-bold text-lg text-main">
                  Davomat jurnalini yakuniy saqlash
                </h3>
                <p className="text-xs font-mono text-sub mt-0.5">
                  Barcha {data.length} nafar talabaning davomati qulflanadi
                </p>
              </div>
            </div>

            <p className="text-xs font-sans text-sub leading-relaxed">
              Saqlangandan so&apos;ng bugungi kun uchun barcha tugmalar qulflanadi (Faqat ko&apos;rish rejimiga o&apos;tadi). 
              Ma&apos;lumotlarni o&apos;zgartirish faqat bino mudiri yoki superadmin orqali amalga oshirilishi mumkin.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-divider">
              <button
                type="button"
                onClick={() => setConfirmSaveModal(false)}
                className="px-4 py-2 bg-page border border-divider rounded-[8px] font-mono text-xs text-sub hover:text-main transition-colors shadow-2xs"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmSaveModal(false);
                  onSaveAndLock();
                }}
                className="px-4 py-2 bg-[#3A7D5C] text-white font-mono text-xs font-bold rounded-[8px] hover:bg-[#2F664A] transition-colors shadow-xs"
              >
                Tasdiqlash va Qulflash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
