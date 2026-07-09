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
}

const BLOCKS = ["A-Blok", "B-Blok", "C-Blok", "D-Blok"];

function generateInitialRooms(block: string, reducedMotion: boolean = false): RoomData[] {
  const rooms: RoomData[] = [];
  for (let floor = 4; floor >= 1; floor--) {
    for (let r = 1; r <= 8; r++) {
      const roomNum = floor * 100 + r;
      const mod = roomNum % 10;
      const unexcusedCount = mod === 7 ? 1 : mod === 3 ? 2 : 0;
      const excusedCount = mod === 5 ? 1 : 0;
      const presentCount = 4 - unexcusedCount - excusedCount;

      rooms.push({
        id: `${block}-${roomNum}`,
        roomNumber: roomNum,
        floor,
        block,
        capacity: 4,
        present: presentCount,
        excused: excusedCount,
        unexcused: unexcusedCount,
        isDigitized: reducedMotion ? true : false, // If reduced-motion is true, show final state immediately
      });
    }
  }
  return rooms;
}

export function HeroGrid() {
  const [activeBlock, setActiveBlock] = useState("A-Blok");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [rooms, setRooms] = useState<RoomData[]>(() => generateInitialRooms("A-Blok", false));
  const [isSimulating, setIsSimulating] = useState(false);
  const [digitizedCount, setDigitizedCount] = useState(0);

  // Staggered mount animation triggers
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion (FIX 4 safety check)
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReduced = mediaQuery.matches;
    setPrefersReducedMotion(isReduced);

    const initial = generateInitialRooms(activeBlock, isReduced);
    setRooms(initial);
    if (isReduced) {
      setDigitizedCount(initial.length);
      setIsSimulating(false);
    } else {
      setDigitizedCount(0);
      setIsSimulating(true);
    }

    // Trigger mount fade-in after 50ms
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, [activeBlock]);

  // Animation loop simulating transition from paper checkmark to digital status
  useEffect(() => {
    if (!isSimulating || prefersReducedMotion) return;

    const undigitized = rooms.filter((r) => !r.isDigitized);
    if (undigitized.length === 0) {
      setIsSimulating(false);
      return;
    }

    const timer = setTimeout(() => {
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
  }, [rooms, isSimulating, prefersReducedMotion]);

  const triggerResetDemo = () => {
    if (prefersReducedMotion) return;
    setRooms((prev) => prev.map((r) => ({ ...r, isDigitized: false })));
    setDigitizedCount(0);
    setIsSimulating(true);
  };

  const totalPresent = rooms.reduce((acc, r) => acc + r.present, 0);
  const totalExcused = rooms.reduce((acc, r) => acc + r.excused, 0);
  const totalUnexcused = rooms.reduce((acc, r) => acc + r.unexcused, 0);

  // Staggered animation classes respecting reduced motion
  const getStaggerClass = (delayMs: number) => {
    if (prefersReducedMotion) return "opacity-100 translate-y-0";
    return `transition-all duration-400 ease-out ${
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`;
  };

  return (
    <section id="grid-schematic" className="py-12 sm:py-16 bg-page border-b border-divider overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Concrete Headline & Subheadline with Staggered Fade + Slide-up (80-120ms separation) */}
        <div className="max-w-3xl mb-10">
          <div
            style={{ transitionDelay: prefersReducedMotion ? "0ms" : "0ms" }}
            className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-[8px] bg-surface border border-divider text-[12px] font-mono font-medium text-sub mb-4 shadow-xs ${getStaggerClass(0)}`}
          >
            <Building2 className="w-3.5 h-3.5 text-accent" />
            <span>TATU YOTOQXONALAR MA&apos;MURIY REESTRI v2.4</span>
          </div>

          <h1
            style={{ transitionDelay: prefersReducedMotion ? "0ms" : "100ms" }}
            className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-main leading-tight tracking-tight mb-4 ${getStaggerClass(100)}`}
          >
            Talabalar turar joylarida kunlik davomat va qaydnoma hisobini raqamlashtirilgan nazorat qilish tizimi.
          </h1>

          <p
            style={{ transitionDelay: prefersReducedMotion ? "0ms" : "200ms" }}
            className={`text-base sm:text-lg text-sub font-sans leading-relaxed ${getStaggerClass(200)}`}
          >
            Bino sardorlari, blok mudirlari va qavat maslahatchilari uchun davomat jurnallarini qog&apos;ozsiz yuritish, 
            takroriy sababsiz qoldirishlarni aniqlash va rasmiy Excel hisobotlarni bir eshikdan boshqarish.
          </p>
        </div>

        {/* Interactive Schematic Section (300ms delay stagger) */}
        <div
          style={{ transitionDelay: prefersReducedMotion ? "0ms" : "300ms" }}
          className={`bg-surface border border-divider border-t-[3px] border-t-accent rounded-[8px] shadow-xs p-4 sm:p-6 lg:p-8 ${getStaggerClass(300)}`}
        >
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
                  className={`px-4 py-1.5 rounded-[8px] text-xs font-mono font-medium transition-all duration-200 border ${
                    activeBlock === block
                      ? "bg-ink text-surface border-sidebarborder shadow-xs"
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
                disabled={isSimulating || prefersReducedMotion}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono bg-page hover:bg-divider text-main border border-divider rounded-[8px] transition-colors disabled:opacity-50 shadow-xs"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isSimulating && !prefersReducedMotion ? "animate-spin text-accent" : ""}`} />
                <span>
                  {prefersReducedMotion
                    ? "Raqamlangan reestr (Reduced Motion)"
                    : isSimulating
                    ? `Raqamlash jarayoni (${Math.round((digitizedCount / rooms.length) * 100)}%)...`
                    : "Qog'oz qaydnomani raqamlash demo"}
                </span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Rooms Schematic + Privacy Info Summary Box */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Rooms Schematic (3 Cols on lg) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-sub">
                <span>XONALAR SXEMASI ({activeBlock}) — JAMI {rooms.length} TA XONA (UMUMIY KO&apos;RSATKICHLAR)</span>
                <span>MAXFIYLIK SIYOSATIGA ASOSAN SHAQSIY MA&apos;LUMOTLAR YASHIRILGAN</span>
              </div>

              {/* Floor by floor display */}
              <div className="space-y-3">
                {[4, 3, 2, 1].map((floorNum) => {
                  const floorRooms = rooms.filter((r) => r.floor === floorNum);
                  return (
                    <div key={floorNum} className="flex items-stretch border border-divider rounded-[8px] overflow-hidden bg-page">
                      <div className="w-20 bg-surface border-r border-divider flex flex-col items-center justify-center py-2 px-1 font-mono text-[11px] font-bold text-sub">
                        <span>{floorNum}-QAVAT</span>
                      </div>
                      <div className="flex-1 p-2 grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {floorRooms.map((room) => {
                          let statusBorder = "border-divider";
                          if (room.isDigitized) {
                            if (room.unexcused > 0) statusBorder = "border-[#B23B3B]";
                            else if (room.excused > 0) statusBorder = "border-[#C08A2E]";
                            else statusBorder = "border-[#3A7D5C]";
                          }

                          return (
                            <div
                              key={room.id}
                              style={{
                                transitionDuration: prefersReducedMotion ? "0ms" : "300ms",
                              }}
                              className={`p-2 rounded-[6px] border text-left bg-surface transition-colors ease-out ${statusBorder}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs font-bold text-main">
                                  {room.roomNumber}
                                </span>
                                {room.isDigitized ? (
                                  <span
                                    className="w-2 h-2 rounded-full inline-block transition-transform duration-300 scale-100"
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
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Privacy Roster Info Panel (1 Col on lg) */}
            <div className="border border-divider border-t-[3px] border-t-accent rounded-[8px] bg-surface p-4 sm:p-5 flex flex-col justify-between shadow-xs">
              <div>
                <div className="pb-3 border-b border-divider mb-4">
                  <span className="text-[11px] font-mono uppercase text-sub tracking-wider block">
                    MA&apos;LUMOTLAR KO&apos;LAMI
                  </span>
                  <h3 className="font-serif font-bold text-lg text-main mt-0.5">
                    Talabalar ro&apos;yxati va shaxsiy ma&apos;lumotlar
                  </h3>
                </div>

                <div className="space-y-4 text-xs text-sub leading-relaxed">
                  <p>
                    Ushbu ochiq sahifada faqat yotoqxona binolari, qavatlar va xonalarning umumiy bandlik holati, 
                    davomat statistikasi hamda rasmiy tizim mexanizmlari namoyish etiladi.
                  </p>
                  <div className="p-3 bg-page border border-divider rounded-[8px] font-mono text-[11px] text-main shadow-xs">
                    <span className="font-bold block mb-1">MAXFIYLIK VA RUXSATLAR:</span>
                    Talabalar F.I.SH, ID raqami, fakulteti va aniq davomat vaqtlari faqat vakolatli bino mudiri, blok sardori 
                    yoki qavat maslahatchisi tizimga kirganidan so&apos;ng ko&apos;rsatiladi.
                  </div>
                </div>
              </div>

              {/* Bottom CTA for Dashboard / Auth */}
              <div className="mt-6 pt-4 border-t border-divider">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 bg-ink text-surface font-mono text-xs font-semibold rounded-[8px] flex items-center justify-center space-x-2 hover:bg-accent transition-colors shadow-xs"
                >
                  <span>TIZIMGA KIRISH VA JURNALNI KO&apos;RISH</span>
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
