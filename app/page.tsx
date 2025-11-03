"use client";
import WeatherMap from "./components/WeatherMap";
import WeatherCardsList from "./components/WeatherCardList";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWeather } from "@/state/weatherSlice";
import { RootState, AppDispatch } from "@/state/store"; 

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
    <div className="flex  w-full  flex-col items-center align-center py-32 px-16  sm:items-start">
      <div>Select a climbing spot on the map to see the forecast.</div>
      <WeatherMap />
      <WeatherCardsList />
    </div>
  );
}