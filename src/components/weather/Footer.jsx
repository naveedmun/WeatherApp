import React from "react";

import { CloudSun } from "lucide-react";



export default function Footer() {

  return (

    <footer className="mt-16 border-t border-white/10 backdrop-blur-xl bg-black/20">

      <div className="max-w-7xl mx-auto px-4 py-8 text-white">

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">

            <CloudSun className="w-6 h-6 text-cyan-300" />

            <span className="font-heading font-bold">AccurateWeather</span>

            <span className="text-white/40 text-sm">· Karachi, PK</span>

          </div>

          <div className="flex gap-5 text-white/60 text-sm">

            <a href="#current" className="hover:text-white transition">

              Current

            </a>

            <a href="#forecast" className="hover:text-white transition">

              Forecast

            </a>

            <a href="#radar" className="hover:text-white transition">

              Radar

            </a>

          </div>

          <div className="text-white/40 text-sm text-center md:text-right">

            <div>

              Developed by <span className="text-cyan-300 font-medium">Mun Developers</span>

            </div>

            <div className="text-xs">Data: OpenWeatherMap · Radar: RainViewer</div>

          </div>

        </div>

      </div>

    </footer>

  );

} 

