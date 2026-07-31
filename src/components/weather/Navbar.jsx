import React from "react";
import { CloudSun, Radar, CalendarDays, Cloud } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/10">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-2 text-white">
          <CloudSun className="w-7 h-7 text-cyan-300" />
          <span className="font-heading font-bold text-xl tracking-tight">
            Accurate<span className="text-cyan-300">Weather</span>
          </span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-white/70 text-sm">
          <a href="#current" className="hover:text-white transition flex items-center gap-1.5">
            <Cloud className="w-4 h-4" /> Current
          </a>
          <a href="#forecast" className="hover:text-white transition flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" /> Forecast
          </a>
          <a href="#radar" className="hover:text-white transition flex items-center gap-1.5">
            <Radar className="w-4 h-4" /> Radar
          </a>
        </div>
        <span className="text-white/40 text-xs hidden sm:block">by Mun Developers</span>
      </nav>
    </header>
  );
}