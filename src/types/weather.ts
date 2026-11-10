// Interface yang mendefinisikan bentuk data JSON dari Open-Meteo Weather API
// Endpoint: https://api.open-meteo.com/v1/forecast

export interface CurrentWeatherUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  precipitation: string;
  weather_code: string;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  precipitation: number;
  weather_code: number;
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentWeatherUnits;
  current: CurrentWeather;
}

// Interface hasil interpretasi cuaca untuk anak kos
export interface WeatherInfo {
  temperature: number;
  humidity: number;
  precipitation: number;
  weatherDescription: string;
  weatherIcon: string;
  laundryStatus: string;
  laundryTip: string;
  isSafeForLaundry: boolean;
}
