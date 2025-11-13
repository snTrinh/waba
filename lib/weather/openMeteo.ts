import { fetchWeatherApi } from "openmeteo";
import { getWithExpiry, setWithExpiry } from "./cache";
import { DailyWeather, HourlyWeather } from "@/types/weather";

type WeatherResponse = {
  daily: DailyWeather[];
  hourly: HourlyWeather;
};

export async function fetchDailyWeather(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const cacheKey = `weather_${latitude},${longitude}`;
  const cached = getWithExpiry<WeatherResponse>(cacheKey);
  if (cached) {
    console.log("Loaded weather data from cache");
    return cached;
  }

  const params = {
    latitude,
    longitude,
    daily: ["precipitation_sum", "temperature_2m_max", "temperature_2m_min"],
    hourly: ["temperature_2m", "precipitation", "precipitation_probability"],
    past_days: 2,
    forecast_days: 6,
    timezone: "auto",
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const [response] = await fetchWeatherApi(url, params);
  if (!response) {
    console.error("No response from weather API");
    return {
      daily: [],
      hourly: {
        time: [],
        temperature_2m: [],
        precipitation: [],
        precipitation_probability: [],
      },
    };
  }

  const dailyData = response.daily?.();
  const dailyWeather: DailyWeather[] = [];

  if (dailyData) {
    const extractVariable = (index: number) =>
      dailyData!.variables(index)?.valuesArray();

    const precipSums = extractVariable(0) ?? [];
    const maxTemps = extractVariable(1) ?? [];
    const minTemps = extractVariable(2) ?? [];

    const dailyInterval = dailyData.interval ? dailyData.interval() : 86400;
    const startTime = Number(dailyData.time?.() ?? 0);
    const numDays = Math.max(
      precipSums.length,
      maxTemps.length,
      minTemps.length
    );

    for (let i = 0; i < numDays; i++) {
      const timestamp = (startTime + i * dailyInterval) * 1000;
      dailyWeather.push({
        date: new Date(timestamp).toISOString().split("T")[0],
        high: maxTemps[i] ?? 0,
        low: minTemps[i] ?? 0,
        precip: precipSums[i] ?? 0,
      });
    }
  }

  const hourlyData = response.hourly?.();
  const hourlyWeather: HourlyWeather = {
    time: [],
    temperature_2m: [],
    precipitation: [],
    precipitation_probability: [],
  };

  if (hourlyData) {
    const getHourlyVar = (index: number) => {
      const arr = hourlyData.variables(index)?.valuesArray();
      return arr ? Array.from(arr) : [];
    };
    const hourlyTemp = getHourlyVar(0);
    const hourlyPrecip = getHourlyVar(1);
    const hourlyPrecipProb = getHourlyVar(2);
    const hourlyInterval = hourlyData.interval
      ? Number(hourlyData.interval())
      : 3600;
    const startTime = Number(hourlyData.time?.() ?? 0);

    const yourOffset = new Date().getTimezoneOffset() / -60;
    hourlyWeather.time = Array.from({ length: hourlyTemp.length }, (_, i) => {
      const timestamp = (startTime + i * hourlyInterval) * 1000;
      const localTimestamp = new Date(timestamp + yourOffset * 3600 * 1000);
      return localTimestamp.toISOString(); 
    });

    hourlyWeather.temperature_2m = hourlyTemp;
    hourlyWeather.precipitation = hourlyPrecip;
    hourlyWeather.precipitation_probability = hourlyPrecipProb;
  }

  setWithExpiry(cacheKey, { daily: dailyWeather, hourly: hourlyWeather }, 3600);

  return { daily: dailyWeather, hourly: hourlyWeather };
}
