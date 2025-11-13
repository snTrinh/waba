"use client";
import WeatherMap from "./components/map/WeatherMap";
import WeatherCardsList from "./components/cards/WeatherCardList";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWeather } from "@/state/weatherSlice";
import { RootState, AppDispatch } from "@/state/store";
import WeatherChart from "./components/chart/WeatherChart";

export default function Home() {
  const { selectedLocation } = useSelector((state: RootState) => state.weather);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (
      selectedLocation.lat !== 0 &&
      selectedLocation.long !== 0 &&
      selectedLocation.name
    ) {
      console.log(
        `Fetching weather for: ${selectedLocation.name} (${selectedLocation.lat}, ${selectedLocation.long})`
      );
      dispatch(
        fetchWeather({
          lat: selectedLocation.lat,
          lon: selectedLocation.long,
        })
      );
    }
  }, [
    selectedLocation.lat,
    selectedLocation.long,
    selectedLocation.name,
    dispatch,
  ]);

  return (
    <div className="flex  w-full  flex-col items-center align-center py-15 px-16">
      <div>Select a climbing spot on the map to see the forecast.</div>
      <div className="flex flex-col items-center justify-center w-full max-w-6xl">
      <WeatherMap />
      <WeatherCardsList />
      <div className="flex flex-col items-center justify-center w-full mt-8">
        <WeatherChart />
        </div>
      </div>
    </div>
  );
}
