export type DailyWeather = {
  date: string;
  high: number;
  low: number;
  precip: number;
};

export type HourlyWeather = {
  time: string[]; 
  temperature_2m: number[];
  precipitation: number[];
  precipitation_probability: number[];
};