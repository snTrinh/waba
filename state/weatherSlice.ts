
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

// --- ASYNC THUNKS ---

export const fetchWeather = createAsyncThunk(
    "weather/fetchWeather",
    async ({ lat, lon }: { lat: number; lon: number }) => {
      // fetchDailyWeather should return DailyWeather[]
      const data = await fetchDailyWeather(lat, lon);
      return data; // This returns DailyWeather[]
    }
  );

// --- SLICE DEFINITION ---

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    // 2. 💡 New reducer to update selected location from the map click
    setSelectedLocation: (state, action: PayloadAction<Location>) => {
        // This ensures the location state is updated when the map is clicked
        state.selectedLocation = action.payload;
        // Optionally clear old weather data when location changes
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