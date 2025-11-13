"use client";

import React, { useMemo } from "react";
import { Chart } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { generateWeatherChartData } from "@/config/chartConfig";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
const WeatherChart: React.FC = () => {
  const { hourlyForecast, selectedDay, selectedLocation } = useSelector(
    (state: RootState) => state.weather
  );

  const chartConfig = useMemo(() => {
    if (!hourlyForecast || !selectedDay) return null;
    return generateWeatherChartData(
      hourlyForecast,
      selectedDay,
      selectedLocation?.name || ""
    );
  }, [hourlyForecast, selectedDay, selectedLocation?.name]);

  if (!chartConfig) return null;

  return (
    <>
      <Chart type="bar" data={chartConfig.data} options={chartConfig.options} />
      <small className="weather-license-details">
        Data Source:{" "}
        <a href="https://eccc-msc.github.io/open-data/licence/readme_en/">
          Environment and Climate Change Canada
        </a>{" "}
        and <a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>
      </small>
    </>
  );
};

export default WeatherChart;
