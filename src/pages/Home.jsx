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
        // 1. WeatherAPI Current & Forecast Request (WeatherAPI ek hi call mein current aur forecast dono de deta hai)
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=no&alerts=no`
        );
        if (!res.ok) throw new Error("Weather data fetch failed");
        const weatherData = await res.json();

        // WeatherAPI data ko OpenWeatherMap ke format ke mutabiq map karna taake baaki components (CurrentWeather, ForecastList) na kharab hon:
        const currentData = {
          main: {
            temp: weatherData.current.temp_c,
            feels_like: weatherData.current.feelslike_c,
            humidity: weatherData.current.humidity,
            pressure: weatherData.current.pressure_mb,
          },
          weather: [
            {
              main: weatherData.current.condition.text,
              description: weatherData.current.condition.text,
              icon: weatherData.current.condition.icon,
            },
          ],
          wind: {
            speed: weatherData.current.wind_kph / 3.6, // m/s conversion
          },
          sys: {
            sunrise: 0,
            sunset: 0,
          },
        };

        // Update city name if WeatherAPI returns a more precise location/sub-locality
        if (weatherData.location) {
          const preciseName = weatherData.location.name;
          const regionName = weatherData.location.region;
          setCity((prev) => ({
            ...prev,
            name: preciseName,
            label: `${preciseName}, ${regionName}`,
          }));
        }

        // Daily forecasts formatting
        const dailyForecasts = weatherData.forecast.forecastday.map((day) => ({
          dt_txt: `${day.date} 12:00:00`,
          main: {
            temp: day.day.avgtemp_c,
          },
          calculated_max: day.day.maxtemp_c,
          calculated_min: day.day.mintemp_c,
          weather: [
            {
              main: day.day.condition.text,
              icon: day.day.condition.icon,
            },
          ],
        }));

        // Hourly forecasts formatting from WeatherAPI forecast hours
        let hourlyForecasts = [];
        weatherData.forecast.forecastday.forEach((day) => {
          day.hour.forEach((h) => {
            hourlyForecasts.push({
              dt_txt: h.time,
              main: {
                temp: h.temp_c,
              },
              weather: [
                {
                  main: h.condition.text,
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

  // App khulte hi user ki live GPS location detect karne ka logic
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          loadWeather(lat, lon);
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
  const isDay = true;

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