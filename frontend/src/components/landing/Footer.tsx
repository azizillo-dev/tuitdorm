import React from "react";
import Link from "next/link";
import { Shield, Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-surface border-t border-divider pt-12 sm:pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-divider">
          
          {/* Institutional Branding */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-ink text-surface flex items-center justify-center rounded-[8px] shadow-xs font-mono font-bold text-base border border-sidebarborder">
                TATU
              </div>
              <span className="font-serif font-bold text-main text-base sm:text-lg tracking-tight">
                Toshkent Axborot Texnologiyalari Universiteti
              </span>
            </div>
            <p className="text-sub font-sans text-sm max-w-md leading-relaxed">
              Muhammad al-Xorazmiy nomidagi Toshkent axborot texnologiyalari universiteti 
              Talabalar turar joylarini ma&apos;muriy boshqarish va davomat nazorati rasmiy axborot tizimi.
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono text-muted pt-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>O&apos;ZBEKISTON RESPUBLIKASI OLIF VA O&apos;RTA MAXSUS TA&apos;LIM STANDARTLARIGA MOS</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-main uppercase tracking-wider">
              Tizim Bo&apos;limlari
            </h4>
            <ul className="space-y-2 text-sm text-sub">
              <li>
                <a href="#grid-schematic" className="hover:text-main transition-colors">
                  Tizim sxemasi va inspektor
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-main transition-colors">
                  Funksional imkoniyatlar
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-main transition-colors font-medium text-main">
                  Boshqaruv paneli (Dashboard)
                </Link>
              </li>
              <li>
                <a href="/api/docs" className="hover:text-main transition-colors">
                  API hujjatlari (Swagger/Redoc)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-main uppercase tracking-wider">
              Aloqa va Ma&apos;muriyat
            </h4>
            <ul className="space-y-2.5 text-xs text-sub font-mono">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>100084, Toshkent sh., Amir Temur ko&apos;chasi, 108-uy</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span>+998 (71) 238-64-15</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>dormitory-admin@tuit.uz</span>
              </li>
              <li className="pt-2 border-t border-divider">
                <a
                  href="https://tuit.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-accent hover:text-main transition-colors font-semibold"
                >
                  <span>Rasmiy web-sahifa (tuit.uz)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & CEO / Technical Developer link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-muted gap-4">
          <div>
            &copy; {new Date().getFullYear()} TATU Axborot Texnologiyalari Markazi. Barcha huquqlar qonun bilan himoyalangan.
          </div>
          <div className="flex items-center space-x-4">
            <span>Tizim arxitekturasi: TATU ATM</span>
            <span className="text-divider">|</span>
            <a
              href="https://github.com/azizillo-dev/tuitdorm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sub hover:text-main transition-colors font-medium underline underline-offset-4"
            >
              Loyiha reestriga o&apos;tish (GitHub Repository)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
