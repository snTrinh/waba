import { ChartData, ChartOptions } from "chart.js";

// export type WeatherChartConfig = {
//   data: ChartData<"bar" | "line", number[], string>;
//   options: ChartOptions<"bar" | "line">;
// };

export type WeatherChartConfig = {
    data: ChartData<"bar" | "line", (number | null)[], string>;
    options: ChartOptions<"bar" | "line">;
  };
  

type HourlyForecast = {
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
  precipitation_probability: number[];
};

function formatAMPM(dateStr: string) {
  const date = new Date(dateStr);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export function generateWeatherChartData(
  hourlyForecast: HourlyForecast,
  selectedDay: string,
  locationName: string
): WeatherChartConfig | null {
  if (!hourlyForecast || !selectedDay) return null;

  const hoursInDay = Array.from({ length: 24 }, (_, i) => i);
  const labels: string[] = hoursInDay.map((h) => {
    const ampm = h >= 12 ? "pm" : "am";
    const hour12 = h % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  });

  const temps: (number | null)[] = [];
  const precips: (number | null)[] = [];
  const precipChance: (number | null)[] = [];

  hoursInDay.forEach((h) => {
    const timestamp = `${selectedDay}T${h.toString().padStart(2, "0")}:00`;
    const idx = hourlyForecast.time.findIndex((t) => t.startsWith(timestamp));
    temps.push(idx >= 0 ? hourlyForecast.temperature_2m[idx] : null);
    precips.push(idx >= 0 ? hourlyForecast.precipitation[idx] : null);
    precipChance.push(
      idx >= 0 ? hourlyForecast.precipitation_probability[idx] : null
    );
  });

  const validTemps = temps.filter((t): t is number => t !== null);

  if (validTemps.length === 0) return null;

  let minTemp = Math.floor(Math.min(...validTemps));
  let maxTemp = Math.ceil(Math.max(...validTemps));
  const graphTempMin = minTemp < 0 ? minTemp - 2 : 0;
  const graphTempMax = maxTemp + 2;

  const datasets = [
    {
      type: "line" as const,
      label: "Temperature (°C)",
      data: temps,
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.4)",
      yAxisID: "y0",
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
    },
    {
      type: "bar" as const,
      label: "Precipitation (mm)",
      data: precips,
      backgroundColor: "rgba(54, 163, 235, 0.5)",
      yAxisID: "y1",
      barPercentage: 0.8,
      borderRadius: 4,
    },
    {
      type: "bar" as const,
      label: "Precipitation Probability (%)",
      data: precipChance,
      backgroundColor: "rgba(54, 163, 235, 0.2)",
      yAxisID: "y2",
      barPercentage: 0.2,
    },
  ];


const data: ChartData<"bar" | "line", (number | null)[], string> = {
    labels,
    datasets,
  };
  

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: window.innerWidth < 768 ? 0.5 : 2.5,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      title: {
        display: true,
        text: `Hourly Forecast for ${
          locationName || "Selected Location"
        } on ${selectedDay}`,
        font: { size: 16 },
      },
      legend: { position: "bottom" },
    },
    scales: {
      x: { stacked: true },
      y0: {
        min: graphTempMin,
        max: graphTempMax,
        position: "left",
        title: { display: true, text: "Temperature (°C)" },
      },
      y1: {
        min: 0,
        max: 15,
        position: "right",
        title: { display: true, text: "Precipitation (mm)" },
        grid: { drawOnChartArea: false },
      },
      y2: { min: 0, max: 100, display: false },
    },
  };

  return { data, options };
}
