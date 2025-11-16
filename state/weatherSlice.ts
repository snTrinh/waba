import { fetchDailyWeather } from "@/lib/weather/openMeteo";
import { CragLocation } from "@/types/location";
import { Status } from "@/types/status";
import { DailyWeather, HourlyWeather } from "@/types/weather";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type WeatherState = {
  selectedLocation: CragLocation;
  dailyForecast: DailyWeather[] | null;
  hourlyForecast: HourlyWeather | null;
  selectedDay: string | null;
  status: Status;
  error: string | null;
};

const emptyLocation: CragLocation = {
  name: "",
  lat: 0,
  long: 0,
};

const initialState: WeatherState = {
  selectedLocation: emptyLocation,
  dailyForecast: null,
  hourlyForecast: null,
  selectedDay: new Date().toLocaleDateString("en-CA"),
  status: Status.IDLE,
  error: null,
};


const formatToday = () => {
  const d = new Date();
  return d.toISOString().split("T")[0]; 
};

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async ({ lat, lon }: { lat: number; lon: number }) => {
    const data = await fetchDailyWeather(lat, lon);
    return data; 
  }
);

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setSelectedLocation(state, action: PayloadAction<CragLocation>) {
      state.selectedLocation = action.payload;
      state.selectedDay = null; // reset when switching locations
    },

    setSelectedDay(state, action: PayloadAction<string>) {
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
          const { daily, hourly } = action.payload;

          state.status = Status.SUCCEEDED;
          state.dailyForecast = daily;
          state.hourlyForecast = hourly;

          const today = formatToday();

          state.selectedDay =
            daily.find((d) => d.date === today)?.date ??
            daily[0]?.date ??
            today;
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
