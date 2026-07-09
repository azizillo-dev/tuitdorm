"use client";

import React, { useState, useEffect, useRef } from "react";

export function FeaturesSection() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [revealedCards, setRevealedCards] = useState<{ [key: number]: boolean }>({});

  const cardRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReduced = mediaQuery.matches;
    setPrefersReducedMotion(isReduced);

    if (isReduced) {
      setRevealedCards({ 0: true, 1: true, 2: true, 3: true });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setRevealedCards((prev) => ({ ...prev, [index]: true }));
            // Trigger once
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const getCardAnimationClass = (index: number) => {
    if (prefersReducedMotion || revealedCards[index]) {
      return "opacity-100 translate-y-0";
    }
    return "opacity-0 translate-y-4";
  };

  return (
    <section id="features" className="py-16 sm:py-24 bg-surface border-b border-divider overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-accent mb-2">
            RASMIY FUNKSIONAL VA TEXNIK MANTIQ
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-main leading-tight mb-4">
            Universitet ma&apos;muriyati, dekanat va yotoqxona maslahatchilari uchun mo&apos;ljallangan aniq mexanizmlar.
          </h2>
          <p className="text-sub font-sans text-base sm:text-lg">
            Oddiy shabloniy ilovalardan farqli o&apos;laroq, ushbu tizim TATU ichki tartib-qoidalariga va 
            qog&apos;oz jurnallar strukturasiga to&apos;liq moslashtirilgan.
          </p>
        </div>

        {/* 4 Custom Feature Sections with SVG Technical Diagrams (Scroll reveal via IntersectionObserver) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Feature 1: Real-time Attendance Tracking */}
          <div
            ref={cardRefs[0]}
            data-index={0}
            className={`border border-divider rounded-[8px] bg-page p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-all duration-400 ease-out ${getCardAnimationClass(0)}`}
          >
            <div>
              <div className="text-xs font-mono text-sub mb-2 uppercase tracking-wider">
                01 / TEZKOR VA ANIQ QAYDNOMA
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-main mb-3">
                Joriy vaqtda davomatni nazorat qilish
              </h3>
              <p className="text-sub text-sm leading-relaxed mb-6">
                Qavat maslahatchilari xonama-xona tekshiruv vaqtida har bir talabaning holatini (Bor, Sababli yo&apos;q, Sababsiz yo&apos;q) 
                birgina bosish bilan qayd etadi. Barcha o&apos;zgarishlar markaziy serverda soniya ichida o&apos;z aksini topadi.
              </p>
            </div>

            {/* Custom SVG Diagram 1: Live Status Table Row Mechanic */}
            <div className="bg-surface border border-divider rounded-[8px] p-4 font-mono text-xs shadow-xs">
              <div className="text-[10px] text-muted uppercase pb-2 border-b border-divider flex justify-between">
                <span>TALABA QAYDI #ID-9042</span>
                <span className="text-accent font-semibold">● JORIY SINKRONIZATSIYA</span>
              </div>
              <div className="py-3 space-y-2.5">
                <div className="flex items-center justify-between border-b border-divider pb-2">
                  <span className="text-main font-medium">Abdullayev Shaxzod (304-Xona)</span>
                  <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px] bg-[#3A7D5C]/10 text-[#3A7D5C] text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3A7D5C]" />
                    <span>BOR</span>
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-divider pb-2">
                  <span className="text-main font-medium">Karimov Jasur (304-Xona)</span>
                  <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px] bg-[#C08A2E]/10 text-[#C08A2E] text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C08A2E]" />
                    <span>SABABLI (DEKANAT RUXSATI)</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-main font-medium">Toshmatov Bobur (304-Xona)</span>
                  <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-[4px] bg-[#B23B3B]/10 text-[#B23B3B] text-[11px] font-bold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B23B3B]" />
                    <span>SABABSIZ YO&apos;Q (21:45)</span>
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-muted pt-2 border-t border-divider flex justify-between items-center">
                <span>MASLAHATCHI: Raximov U. (3-Qavat)</span>
                <span className="bg-ink text-surface px-1.5 py-0.5 rounded-[4px] font-bold">QAYD ETILDI</span>
              </div>
            </div>
          </div>

          {/* Feature 2: Automated Absence Alerts */}
          <div
            ref={cardRefs[1]}
            data-index={1}
            className={`border border-divider rounded-[8px] bg-page p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-all duration-400 ease-out ${getCardAnimationClass(1)}`}
          >
            <div>
              <div className="text-xs font-mono text-sub mb-2 uppercase tracking-wider">
                02 / AVTOMATIK OGOHLANTIRISH CHEGARASI
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-main mb-3">
                Takroriy sababsiz qoldirishlar bildirishnomasi
              </h3>
              <p className="text-sub text-sm leading-relaxed mb-6">
                Talaba ketma-ket 3 kun yoki bir oy ichida jami 5 marta sababsiz yotoqxonaga kelmasa, tizim inson faktorini 
                chetlab o&apos;tib, avtomatik ravishda blok sardori va fakultet dekanatining nazorat paneliga bildirishnoma ko&apos;taradi.
              </p>
            </div>

            {/* Custom SVG Diagram 2: Calendar Flag Mechanic & Alert Trigger */}
            <div className="bg-surface border border-divider rounded-[8px] p-4 font-mono text-xs shadow-xs">
              <div className="text-[10px] text-muted uppercase pb-2 border-b border-divider flex justify-between">
                <span>NAZORAT TAQVIMI (IYUL 2026)</span>
                <span className="text-[#B23B3B] font-semibold">CHORRAHA: LIMIT O&apos;TILDI</span>
              </div>
              <div className="py-3">
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-sub mb-1">
                  <span>DU</span><span>SE</span><span>CHO</span><span>PA</span><span>JU</span><span>SH</span><span>YA</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
                  {/* Calendar mockup days */}
                  {[6, 7, 8, 9, 10, 11].map((d) => (
                    <div key={d} className="p-1 bg-page border border-divider rounded-[4px] text-sub">{d}</div>
                  ))}
                  <div className="p-1 bg-[#B23B3B]/15 border border-[#B23B3B] rounded-[4px] text-[#B23B3B] font-bold">12</div>
                  <div className="p-1 bg-[#B23B3B]/15 border border-[#B23B3B] rounded-[4px] text-[#B23B3B] font-bold">13</div>
                  <div className="p-1 bg-[#B23B3B]/20 border border-[#B23B3B] rounded-[4px] text-[#B23B3B] font-bold ring-2 ring-[#B23B3B]/40">14</div>
                  {[15, 16, 17, 18, 19].map((d) => (
                    <div key={d} className="p-1 bg-page border border-divider rounded-[4px] text-sub">{d}</div>
                  ))}
                </div>
              </div>
              <div className="bg-[#B23B3B]/10 border border-[#B23B3B]/30 rounded-[6px] p-2.5 text-[11px] text-[#B23B3B] flex items-start space-x-2">
                <span className="font-bold shrink-0">DIQQAT #ALR-8092:</span>
                <span>Talaba Toshmatov B. 3 kun ketma-ket sababsiz qoldirdi. Dekanatga rasmiy xabarnoma yuborildi.</span>
              </div>
            </div>
          </div>

          {/* Feature 3: Structured Excel Exports */}
          <div
            ref={cardRefs[2]}
            data-index={2}
            className={`border border-divider rounded-[8px] bg-page p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-all duration-400 ease-out ${getCardAnimationClass(2)}`}
          >
            <div>
              <div className="text-xs font-mono text-sub mb-2 uppercase tracking-wider">
                03 / RASMIY HISOBOTLAR
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-main mb-3">
                Blok va qavatlar bo&apos;yicha Excel hisobotlar
              </h3>
              <p className="text-sub text-sm leading-relaxed mb-6">
                Haftalik yoki oylik yig&apos;ilishlar uchun barcha davomat ma&apos;lumotlarini universitet standartlariga mos 
                turuvchi strukturalangan Excel (.xlsx) formatida bitta bosish bilan yuklab oling.
              </p>
            </div>

            {/* Custom SVG Diagram 3: Excel Worksheet Grid Representation */}
            <div className="bg-surface border border-divider rounded-[8px] p-4 font-mono text-xs shadow-xs">
              <div className="text-[10px] text-muted uppercase pb-2 border-b border-divider flex justify-between items-center">
                <span>EXCEL GENERATOR STRUCTURE (.XLSX)</span>
                <span className="bg-[#2F5FDB] text-surface px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider">
                  YUKLASH TAYYOR
                </span>
              </div>
              <div className="py-3">
                <div className="grid grid-cols-12 gap-1 border border-divider bg-page text-[10px] font-bold text-sub text-center py-1 rounded-[4px]">
                  <div className="col-span-2">A: ID</div>
                  <div className="col-span-4">B: TALABA</div>
                  <div className="col-span-3">C: DAVOMAT %</div>
                  <div className="col-span-3">D: HOLAT</div>
                </div>
                <div className="divide-y divide-divider border-x border-b border-divider text-[11px] rounded-b-[4px]">
                  <div className="grid grid-cols-12 gap-1 p-1.5 bg-surface">
                    <div className="col-span-2 text-sub">TTJ-101</div>
                    <div className="col-span-4 font-medium text-main">Abdullayev Sh.</div>
                    <div className="col-span-3 text-center text-[#3A7D5C] font-bold">96.8%</div>
                    <div className="col-span-3 text-center text-main">Me&apos;yorida</div>
                  </div>
                  <div className="grid grid-cols-12 gap-1 p-1.5 bg-page/50">
                    <div className="col-span-2 text-sub">TTJ-102</div>
                    <div className="col-span-4 font-medium text-main">Karimov J.</div>
                    <div className="col-span-3 text-center text-[#C08A2E] font-bold">88.5%</div>
                    <div className="col-span-3 text-center text-main">Sababli</div>
                  </div>
                  <div className="grid grid-cols-12 gap-1 p-1.5 bg-surface">
                    <div className="col-span-2 text-sub">TTJ-103</div>
                    <div className="col-span-4 font-medium text-main">Toshmatov B.</div>
                    <div className="col-span-3 text-center text-[#B23B3B] font-bold">72.0%</div>
                    <div className="col-span-3 text-center text-[#B23B3B] font-bold">Nazoratda</div>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-muted pt-2 border-t border-divider flex justify-between items-center">
                <span>FAYL NOMI: A_Blok_3_Qavat_Iyul_2026.xlsx</span>
                <span className="text-accent font-semibold">124 KB</span>
              </div>
            </div>
          </div>

          {/* Feature 4: Role-based Scope Isolation */}
          <div
            ref={cardRefs[3]}
            data-index={3}
            className={`border border-divider rounded-[8px] bg-page p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-all duration-400 ease-out ${getCardAnimationClass(3)}`}
          >
            <div>
              <div className="text-xs font-mono text-sub mb-2 uppercase tracking-wider">
                04 / KO&apos;LAM IZOLYATSIYASI VA XAVFSIZLIK
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-main mb-3">
                Lavozimlarga asoslangan ruxsatlar
              </h3>
              <p className="text-sub text-sm leading-relaxed mb-6">
                Har bir maslahatchi va sardor faqat o&apos;ziga ruxsat berilgan bino, blok va qavat ma&apos;lumotlarini ko&apos;radi. 
                Tizim arxitekturasi o&apos;zga qavat talabalarining ma&apos;lumotlarini o&apos;zgartirishga yo&apos;l qo&apos;ymaydi.
              </p>
            </div>

            {/* Custom SVG Diagram 4: Hierarchy Scope Isolation Tree */}
            <div className="bg-surface border border-divider rounded-[8px] p-4 font-mono text-xs shadow-xs">
              <div className="text-[10px] text-muted uppercase pb-2 border-b border-divider flex justify-between">
                <span>RUXSATLAR MATRISASI & HIERARCHY</span>
                <span className="text-accent font-semibold">KATAN IZOLYATSIYA</span>
              </div>
              <div className="py-3 space-y-2 text-[11px]">
                <div className="p-2 bg-ink text-surface rounded-[6px] flex items-center justify-between font-bold shadow-xs">
                  <span>SUPER_ADMIN (Universitet IT)</span>
                  <span className="text-[10px] bg-surface/20 px-1.5 py-0.5 rounded-[4px]">BARCHA BINOLAR [A, B, C, D]</span>
                </div>
                <div className="pl-4 border-l-2 border-accent space-y-2">
                  <div className="p-2 bg-page border border-divider rounded-[6px] flex items-center justify-between font-medium text-main">
                    <span>BLOCK_HEAD (Blok Sardori)</span>
                    <span className="text-[10px] text-accent font-mono">FAQAT [A-BLOK]</span>
                  </div>
                  <div className="pl-4 border-l-2 border-divider space-y-2">
                    <div className="p-2 bg-surface border border-divider rounded-[6px] flex items-center justify-between font-medium text-main">
                      <span>FLOOR_HEAD (Qavat Sardori)</span>
                      <span className="text-[10px] text-[#3A7D5C] font-mono">FAQAT [A-BLOK / 3-QAVAT]</span>
                    </div>
                    <div className="pl-4 border-l-2 border-divider">
                      <div className="p-1.5 bg-page border border-divider rounded-[6px] text-[10px] text-sub flex items-center justify-between">
                        <span>ASSISTANT (Yordamchi)</span>
                        <span className="font-mono text-muted">LIMIT: 1 TA / QAVAT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-muted pt-2 border-t border-divider flex justify-between">
                <span>DRF PermissionDenied avtomatik ishlaydi</span>
                <span className="text-[#3A7D5C] font-semibold">HMAC-SHA256 JWT</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
