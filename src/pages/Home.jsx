import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/weather/Navbar";
import Footer from "@/components/weather/Footer";
import WeatherBackground from "@/components/weather/WeatherBackground";
import CitySearch from "@/components/weather/CitySearch";
import CurrentWeather from "@/components/weather/CurrentWeather";
import ForecastList from "@/components/weather/ForecastList";
import WeatherRadar from "@/components/weather/WeatherRadar";
import AdTile from "@/components/weather/AdTile";
import HourlyForecast from "@/components/weather/HourlyForecast";

const KARACHI = {
  name: "Karachi",
  country: "PK",
  lat: 24.8607,
  lon: 67.0011,
  label: "Karachi, PK",
};

const API_KEY = "969927f300a1463a63ade687d3ed564e";

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
        // 1. Current Weather Request
        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        if (!currentRes.ok) throw new Error("Weather data fetch failed");
        const currentData = await currentRes.json();

        // 2. Forecast Request (5 days / 3 hours)
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        let dailyForecasts = [];
        let hourlyForecasts = [];

        if (forecastRes.ok) {
          const forecastData = await forecastRes.json();
          hourlyForecasts = forecastData.list;

          // Har din ke saare 3-hour blocks ko group karke exact High aur Low nikalne ka logic:
          const groups = {};
          forecastData.list.forEach((item) => {
            const date = item.dt_txt.split(" ")[0]; // Get YYYY-MM-DD
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(item);
          });

          // Ab har group (din) mein se actual min/max calculate karenge
          dailyForecasts = Object.keys(groups).slice(0, 5).map((date) => {
            const dayItems = groups[date];
            
            // Poore din mein se sab se kam aur sab se zyada temp nikalna
            const temps = dayItems.map(item => item.main.temp);
            const minTemp = Math.min(...temps);
            const maxTemp = Math.max(...temps);

            // Dopahar ka data use karenge icon aur text dikhane ke liye
            const midDayItem = dayItems.find(item => item.dt_txt.includes("12:00:00")) || dayItems[0];

            return {
              ...midDayItem,
              calculated_max: maxTemp,
              calculated_min: minTemp,
            };
          });
        }

        setData({
          current: currentData,
          daily: dailyForecasts,
          hourly: hourlyForecasts,
        });
      } catch (e) {
        setError("Unable to load weather. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // App khulte hi user ki live GPS location detect karne ka logic
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            const geoRes = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
            );
            const geoData = await geoRes.json();
            const cityName = geoData[0]?.name || "Current Location";
            const countryCode = geoData[0]?.country || "";

            const detectedCity = {
              name: cityName,
              country: countryCode,
              lat: lat,
              lon: lon,
              label: `${cityName}, ${countryCode}`,
            };

            setCity(detectedCity);
            loadWeather(lat, lon);
          } catch (err) {
            loadWeather(lat, lon);
          }
        },
        (error) => {
          // Agar user location block karde toh default Karachi load hoga
          loadWeather(city.lat, city.lon);
        }
      );
    } else {
      loadWeather(city.lat, city.lon);
    }
  }, [loadWeather]);

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
          <HourlyForecast hourly={data?.hourly} />
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