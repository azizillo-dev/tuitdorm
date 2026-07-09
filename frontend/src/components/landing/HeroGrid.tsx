"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  RotateCcw,
  Building2,
  Users,
  Database,
  ArrowRight,
} from "lucide-react";

interface RoomData {
  id: string;
  roomNumber: number;
  floor: number;
  block: string;
  capacity: number;
  present: number;
  excused: number;
  unexcused: number;
  isDigitized: boolean;
  students: {
    name: string;
    faculty: string;
    status: "PRESENT" | "EXCUSED" | "UNEXCUSED";
    time: string;
  }[];
}

const BLOCKS = ["A-Blok", "B-Blok", "C-Blok", "D-Blok"];

const STUDENT_NAMES = [
  "Abdullayev Shaxzod",
  "Karimov Jasur",
  "Toshmatov Bobur",
  "Raximov Ulug'bek",
  "Ergashev Sardor",
  "Olimov Bekzod",
  "Saidov Doston",
  "Nazarov Farrux",
  "To'xtayev Mirzo",
  "Sultanov Azamat",
  "Muminov Jamshid",
  "Kadirov Anvar",
];

const FACULTIES = [
  "Kompyuter injiniringi",
  "Dasturiy injiniring",
  "Axborot xavfsizligi",
  "Telekom. texnologiyalari",
];

function generateInitialRooms(block: string): RoomData[] {
  const rooms: RoomData[] = [];
  for (let floor = 4; floor >= 1; floor--) {
    for (let r = 1; r <= 8; r++) {
      const roomNum = floor * 100 + r;
      // Deterministic pseudo-random status generation based on roomNum
      const mod = roomNum % 10;
      const unexcusedCount = mod === 7 ? 1 : mod === 3 ? 2 : 0;
      const excusedCount = mod === 5 ? 1 : 0;
      const presentCount = 4 - unexcusedCount - excusedCount;

      const students = Array.from({ length: 4 }).map((_, idx) => {
        let status: "PRESENT" | "EXCUSED" | "UNEXCUSED" = "PRESENT";
        if (idx < unexcusedCount) status = "UNEXCUSED";
        else if (idx < unexcusedCount + excusedCount) status = "EXCUSED";

        const nameIdx = (roomNum + idx * 3) % STUDENT_NAMES.length;
        const facIdx = (roomNum + idx) % FACULTIES.length;
        const minute = (roomNum + idx * 7) % 60;

        return {
          name: STUDENT_NAMES[nameIdx],
          faculty: FACULTIES[facIdx],
          status,
          time: `21:${minute < 10 ? "0" + minute : minute}:14`,
        };
      });

      rooms.push({
        id: `${block}-${roomNum}`,
        roomNumber: roomNum,
        floor,
        block,
        capacity: 4,
        present: presentCount,
        excused: excusedCount,
        unexcused: unexcusedCount,
        isDigitized: false, // Starts in "paper ledger" mode, animated on load
        students,
      });
    }
  }
  return rooms;
}

export function HeroGrid() {
  const [activeBlock, setActiveBlock] = useState("A-Blok");
  const [rooms, setRooms] = useState<RoomData[]>(() => generateInitialRooms("A-Blok"));
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [digitizedCount, setDigitizedCount] = useState(0);

  useEffect(() => {
    const newRooms = generateInitialRooms(activeBlock);
    setRooms(newRooms);
    setSelectedRoom(newRooms[0]);
    setDigitizedCount(0);
    setIsSimulating(true);
  }, [activeBlock]);

  // Animation loop simulating transition from paper checkmark to digital status
  useEffect(() => {
    if (!isSimulating) return;

    const undigitized = rooms.filter((r) => !r.isDigitized);
    if (undigitized.length === 0) {
      setIsSimulating(false);
      return;
    }

    const timer = setTimeout(() => {
      // Digitization step: pick up to 3 cells per tick
      setRooms((prev) => {
        let count = 0;
        const next = prev.map((room) => {
          if (!room.isDigitized && count < 4) {
            count++;
            return { ...room, isDigitized: true };
          }
          return room;
        });
        setDigitizedCount(next.filter((r) => r.isDigitized).length);
        return next;
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [rooms, isSimulating]);

  const triggerResetDemo = () => {
    setRooms((prev) => prev.map((r) => ({ ...r, isDigitized: false })));
    setDigitizedCount(0);
    setIsSimulating(true);
  };

  const totalStudents = rooms.length * 4;
  const totalPresent = rooms.reduce((acc, r) => acc + r.present, 0);
  const totalExcused = rooms.reduce((acc, r) => acc + r.excused, 0);
  const totalUnexcused = rooms.reduce((acc, r) => acc + r.unexcused, 0);

  return (
    <section id="grid-schematic" className="py-12 sm:py-16 bg-page border-b border-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Concrete Headline & Subheadline */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-[2px] bg-surface border border-divider text-[12px] font-mono font-medium text-sub mb-4 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-accent" />
            <span>TATU YOTOQXONALAR MA&apos;MURIY REESTRI v2.4</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-main leading-tight tracking-tight mb-4">
            Talabalar turar joylarida kunlik davomat va qaydnoma hisobini raqamlashtirilgan nazorat qilish tizimi.
          </h1>
          <p className="text-base sm:text-lg text-sub font-sans leading-relaxed">
            Bino sardorlari, blok mudirlari va qavat maslahatchilari uchun davomat jurnallarini qog&apos;ozsiz yuritish, 
            takroriy sababsiz qoldirishlarni aniqlash va rasmiy Excel hisobotlarni bir eshikdan boshqarish.
          </p>
        </div>

        {/* Interactive Schematic Section */}
        <div className="bg-surface border border-divider rounded-[2px] shadow-sm p-4 sm:p-6 lg:p-8">
          {/* Header of Schematic */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-divider mb-6">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0">
              <span className="text-xs font-mono font-bold uppercase text-sub tracking-wider mr-2">
                Blokni tanlang:
              </span>
              {BLOCKS.map((block) => (
                <button
                  key={block}
                  onClick={() => setActiveBlock(block)}
                  className={`px-4 py-1.5 rounded-[2px] text-xs font-mono font-medium transition-all border ${
                    activeBlock === block
                      ? "bg-ink text-surface border-sidebarborder shadow-2xs"
                      : "bg-page text-sub border-divider hover:text-main hover:border-accent"
                  }`}
                >
                  {block}
                </button>
              ))}
            </div>

            {/* Demo Controls & Stats Summary */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4">
              <div className="flex items-center space-x-4 font-mono text-xs text-sub border-r border-divider pr-4">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "var(--status-present)" }} />
                  <span className="text-main font-medium">{totalPresent}</span> Bor
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "var(--status-excused)" }} />
                  <span className="text-main font-medium">{totalExcused}</span> Sababli
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "var(--status-unexcused)" }} />
                  <span className="text-main font-medium">{totalUnexcused}</span> Sababsiz
                </span>
              </div>

              <button
                onClick={triggerResetDemo}
                disabled={isSimulating}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono bg-page hover:bg-divider text-main border border-divider rounded-[2px] transition-colors disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin text-accent" : ""}`} />
                <span>{isSimulating ? `Raqamlash jarayoni (${Math.round((digitizedCount / rooms.length) * 100)}%)...` : "Qog'oz qaydnomani raqamlash demo"}</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Rooms Schematic + Live Inspector Side panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rooms Schematic (2 Cols on lg) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-sub">
                <span>XONALAR SXEMASI ({activeBlock}) — JAMI {rooms.length} TA XONA</span>
                <span>BOSING VA XONA NAZORATINI KO&apos;RING</span>
              </div>

              {/* Floor by floor display */}
              <div className="space-y-3">
                {[4, 3, 2, 1].map((floorNum) => {
                  const floorRooms = rooms.filter((r) => r.floor === floorNum);
                  return (
                    <div key={floorNum} className="flex items-stretch border border-divider rounded-[2px] overflow-hidden bg-page">
                      <div className="w-20 bg-surface border-r border-divider flex flex-col items-center justify-center py-2 px-1 font-mono text-[11px] font-bold text-sub">
                        <span>{floorNum}-QAVAT</span>
                      </div>
                      <div className="flex-1 p-2 grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {floorRooms.map((room) => {
                          const isSelected = selectedRoom?.id === room.id;
                          // Determine border and accent based on room status
                          let statusBorder = "border-divider";
                          if (room.isDigitized) {
                            if (room.unexcused > 0) statusBorder = "border-[#B23B3B] bg-[#B23B3B]/5";
                            else if (room.excused > 0) statusBorder = "border-[#C08A2E] bg-[#C08A2E]/5";
                            else statusBorder = "border-[#3A7D5C] bg-[#3A7D5C]/5";
                          }

                          return (
                            <button
                              key={room.id}
                              onClick={() => setSelectedRoom(room)}
                              className={`p-2 rounded-[2px] border text-left transition-all duration-150 relative ${statusBorder} ${
                                isSelected
                                  ? "ring-2 ring-accent shadow-sm font-semibold bg-surface"
                                  : "hover:border-accent bg-surface"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs font-bold text-main">
                                  {room.roomNumber}
                                </span>
                                {room.isDigitized ? (
                                  <span
                                    className="w-2 h-2 rounded-full inline-block"
                                    style={{
                                      backgroundColor:
                                        room.unexcused > 0
                                          ? "var(--status-unexcused)"
                                          : room.excused > 0
                                          ? "var(--status-excused)"
                                          : "var(--status-present)",
                                    }}
                                  />
                                ) : (
                                  <FileCheck className="w-3.5 h-3.5 text-muted animate-pulse" />
                                )}
                              </div>
                              <div className="font-mono text-[10px] text-sub">
                                {room.isDigitized ? (
                                  <span>
                                    {room.present}/{room.capacity} bor
                                  </span>
                                ) : (
                                  <span className="italic text-[9px] text-muted">[✓] Qog&apos;oz</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Live Inspector Panel (1 Col on lg) */}
            <div className="border border-divider rounded-[2px] bg-page p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-divider mb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-sub tracking-wider block">
                      TEZKOR NAZORAT INSPEKTORI
                    </span>
                    <h3 className="font-serif font-bold text-xl text-main mt-0.5">
                      {selectedRoom ? `${selectedRoom.roomNumber}-Xona (${selectedRoom.block})` : "Xona tanlang"}
                    </h3>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-sub block">SIG&apos;IM</span>
                    <span className="font-bold text-main">4 / 4 TALABA</span>
                  </div>
                </div>

                {selectedRoom ? (
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-sub uppercase tracking-wider">
                      TALABALAR QAYDNOMASI VA STATUSI:
                    </div>
                    {selectedRoom.students.map((student, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-surface border border-divider rounded-[2px] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-6 h-6 rounded-[2px] bg-page border border-divider flex items-center justify-center font-mono font-bold text-sub text-[10px]">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-medium text-main">{student.name}</div>
                            <div className="text-[10px] text-sub font-mono">{student.faculty}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center justify-end space-x-1.5 mb-0.5 font-mono text-[11px] font-medium">
                            {student.status === "PRESENT" && (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "var(--status-present)" }} />
                                <span className="text-[#3A7D5C]">Bor</span>
                              </>
                            )}
                            {student.status === "EXCUSED" && (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "var(--status-excused)" }} />
                                <span className="text-[#C08A2E]">Sababli yo&apos;q</span>
                              </>
                            )}
                            {student.status === "UNEXCUSED" && (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "var(--status-unexcused)" }} />
                                <span className="text-[#B23B3B]">Sababsiz yo&apos;q</span>
                              </>
                            )}
                          </div>
                          <div className="text-[9px] font-mono text-muted">
                            Qayd: {student.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-sub font-mono text-xs">
                    Tafsilotlar uchun xonalardan birini tanlang
                  </div>
                )}
              </div>

              {/* Bottom CTA for Dashboard Preview */}
              <div className="mt-6 pt-4 border-t border-divider">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 bg-ink text-surface font-mono text-xs font-semibold rounded-[2px] flex items-center justify-center space-x-2 hover:bg-accent transition-colors shadow-2xs"
                >
                  <span>BOSHQARUV PANELIGA O&apos;TISH (DASHBOARD)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
