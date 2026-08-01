import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/weather/Navbar";
import Footer from "@/components/weather/Footer";
import WeatherBackground from "@/components/weather/WeatherBackground";
import CitySearch from "@/components/weather/CitySearch";
import CurrentWeather from "@/components/weather/CurrentWeather";
import ForecastList from "@/components/weather/ForecastList";
import WeatherRadar from "@/components/weather/WeatherRadar";
import AdTile from "@/components/weather/AdTile";

const KARACHI = {
  name: "Karachi",
  country: "PK",
  lat: 24.8607,
  lon: 67.0011,
  label: "Karachi, PK",
};

export default function Home() {
  const [city, setCity] = useState(KARACHI);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeather = useCallback(
    async (lat, lon) => {
      setLoading(true);
      setError(null);
      try {
        const res = await base44.functions.invoke("weatherData", { lat, lon });
        setData(res.data);
      } catch (e) {
        setError("Unable to load weather. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadWeather(city.lat, city.lon);
  }, [city, loadWeather]);

  const temp = data?.current?.main?.temp;
  const condition = data?.current?.weather?.[0]?.main;
  const now = Date.now() / 1000;
  const isDay = data?.current?.sys
    ? now > data.current.sys.sunrise && now < data.current.sys.sunset
    : true;

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <WeatherBackground temperature={temp} condition={condition} isDay={isDay} />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10 space-y-12">
        <section className="flex justify-center">
          <CitySearch onSelect={(c) => setCity(c)} />
        </section>

        <section id="current" className="scroll-mt-20">
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          {error && <div className="text-center text-white/80 py-20">{error}</div>}
          {!loading && !error && data?.current && (
            <CurrentWeather current={data.current} city={city} />
          )}
        </section>

        <section id="forecast" className="scroll-mt-20">
          <ForecastList daily={data?.daily} />
        </section>

        <section>
          <AdTile condition={condition} temperature={temp} />
        </section>

        <section id="radar" className="scroll-mt-20">
          <WeatherRadar lat={city.lat} lon={city.lon} />
        </section>
      </main>
      <Footer />
    </div>
  );
}