
import { DailyWeather, fetchDailyWeather } from "@/lib/weather/openMeteo";
import { Location } from "@/types/location";
import { Status } from "@/types/status";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";


type WeatherState = {
  selectedLocation: Location;
  dailyForecast: DailyWeather[] | null; 
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
  status: Status.IDLE,
  error: null,
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

    setSelectedLocation: (state, action: PayloadAction<Location>) => {

        state.selectedLocation = action.payload;

        state.dailyForecast = null; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = Status.PENDING;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<DailyWeather[]>) => {
        state.status = Status.SUCCEEDED;
        state.dailyForecast = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = Status.FAILED;
        state.error = action.error.message || 'Failed to fetch weather data.';
        state.dailyForecast = null;
      });
  },
});

export const { setSelectedLocation } = weatherSlice.actions;

export default weatherSlice.reducer;