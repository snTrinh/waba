import { fetchWeatherApi } from "openmeteo";

export type DailyWeather = {
  date: string; 
  high: number;
  low: number;
  precip: number;
};

export async function fetchDailyWeather(
  latitude: number,
  longitude: number
): Promise<DailyWeather[]> {
  const params = {
    latitude,
    longitude,
    daily: ["temperature_2m_max", "temperature_2m_min", "precipitation_sum"],
    timezone: "auto",
  };

  const url = "https://api.open-meteo.com/v1/forecast";

  const [response] = await fetchWeatherApi(url, params);


  if (!response) {
    console.error("No response received from weather API.");
    return [];
  }

  const daily = response.daily();
  if (!daily) return [];

  const utcOffsetSeconds = response.utcOffsetSeconds();

  const extractVariable = (index: number) =>
    daily!.variables(index)?.valuesArray();

  const maxTemps = extractVariable(0);
  const minTemps = extractVariable(1);
  const precipSums = extractVariable(2);

  if (!maxTemps || !minTemps) {
    console.warn("Required temperature variables missing from daily response.");
    return [];
  }

  if (!precipSums) {
    console.warn("Required precipitation variables missing from daily response.");
    return [];
  }

  const dailyInterval = daily.interval();
  const startTime = Number(daily.time());
  const numDays = maxTemps.length; 
  const dailyWeather = Array.from({ length: numDays }, (_, i): DailyWeather => {

    const timestamp = (startTime + i * dailyInterval + utcOffsetSeconds) * 1000;

    return {
      date: new Date(timestamp).toISOString(),
      high: maxTemps[i],
      low: minTemps[i],
      precip: precipSums[i]
    };
  });

  return dailyWeather;
}
