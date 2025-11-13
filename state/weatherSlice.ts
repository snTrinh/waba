import { fetchDailyWeather } from "@/lib/weather/openMeteo";
import { Location } from "@/types/location";
import { Status } from "@/types/status";
import { DailyWeather, HourlyWeather } from "@/types/weather";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

type WeatherState = {
  selectedLocation: Location;
  dailyForecast: DailyWeather[] | null;
  hourlyForecast: HourlyWeather | null;
  selectedDay: string | null;
  status: Status;
  error: string | null;
};

const initialState: WeatherState = {
  selectedLocation: {
    name: "",
    lat: 0,
    long: 0,
  },
  dailyForecast: null,
  hourlyForecast: null,
  selectedDay: new Date().toLocaleDateString("en-CA"),
  status: Status.IDLE,
  error: null,
};

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async ({ lat, lon }: { lat: number; lon: number }) => {
    const data = await fetchDailyWeather(lat, lon);
    console.log("Fetched weather data:", data);
    return data;
  }
);

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setSelectedLocation: (state, action: PayloadAction<Location>) => {
      state.selectedLocation = action.payload;
      state.selectedDay = null;
    },
    setSelectedDay: (state, action: PayloadAction<string>) => {
      state.selectedDay = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = Status.PENDING;
        state.error = null;
      })
      .addCase(
        fetchWeather.fulfilled,
        (
          state,
          action: PayloadAction<{
            daily: DailyWeather[];
            hourly: HourlyWeather;
          }>
        ) => {
          state.status = Status.SUCCEEDED;
          state.dailyForecast = action.payload.daily;
          state.hourlyForecast = action.payload.hourly;
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, "0");
          const dd = String(today.getDate()).padStart(2, "0");
          const todayStr = `${yyyy}-${mm}-${dd}`;

          const todayInForecast = action.payload.daily.find(
            (d) => d.date === todayStr
          );
          state.selectedDay =
            todayInForecast?.date ??
            action.payload.daily?.[0]?.date ??
            todayStr;
        }
      )
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || "Failed to fetch weather data.";
      });
  },
});

export const { setSelectedLocation, setSelectedDay } = weatherSlice.actions;

export default weatherSlice.reducer;
