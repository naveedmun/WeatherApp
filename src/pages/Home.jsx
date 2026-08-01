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

const API_KEY = "4004522c01f147f2b7771023260108";

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
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=no&alerts=no`
        );
        if (!res.ok) throw new Error("Weather data fetch failed");
        const weatherData = await res.json();

        // Current weather formatting with fixed visibility (vis_km)
        const currentData = {
          main: {
            temp: weatherData.current.temp_c,
            feels_like: weatherData.current.feelslike_c,
            humidity: weatherData.current.humidity,
            pressure: weatherData.current.pressure_mb,
            visibility: weatherData.current.vis_km, // Fixed NaN issue
          },
          weather: [
            {
              main: weatherData.current.condition.text,
              description: weatherData.current.condition.text,
              icon: weatherData.current.condition.icon,
            },
          ],
          wind: {
            speed: weatherData.current.wind_kph / 3.6,
          },
          sys: {
            sunrise: 0,
            sunset: 0,
          },
        };

        // Daily forecasts formatting with rain chance (pop)
        const dailyForecasts = weatherData.forecast.forecastday.map((day) => ({
          dt: day.date_epoch,
          dt_txt: `${day.date} 12:00:00`,
          main: {
            temp: day.day.avgtemp_c,
            humidity: day.day.avghumidity,
          },
          calculated_max: day.day.maxtemp_c,
          calculated_min: day.day.mintemp_c,
          pop: (day.day.daily_chance_of_rain || 0) / 100, // Rain prediction percentage added
          weather: [
            {
              main: day.day.condition.text,
              description: day.day.condition.text,
              icon: day.day.condition.icon,
            },
          ],
        }));

        // Hourly forecasts formatting with rain chance (pop)
        let hourlyForecasts = [];
        weatherData.forecast.forecastday.forEach((day) => {
          day.hour.forEach((h) => {
            hourlyForecasts.push({
              dt: h.time_epoch,
              dt_txt: h.time,
              main: {
                temp: h.temp_c,
                humidity: h.humidity,
              },
              pop: (h.chance_of_rain || 0) / 100, // Hourly rain prediction added
              weather: [
                {
                  main: h.condition.text,
                  description: h.condition.text,
                  icon: h.condition.icon,
                },
              ],
            });
          });
        });

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          loadWeather(lat, lon);
        },
        () => {
          loadWeather(city.lat, city.lon);
        }
      );
    } else {
      loadWeather(city.lat, city.lon);
    }
  }, [loadWeather, city.lat, city.lon]);

  const temp = data?.current?.main?.temp;
  const condition = data?.current?.weather?.[0]?.main;
  const isDay = true;

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <WeatherBackground temperature={temp} condition={condition} isDay={isDay} />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10 space-y-12">
        <section className="flex justify-center">
          <CitySearch
            onSelect={(c) => {
              setCity(c);
              loadWeather(c.lat, c.lon);
            }}
          />
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