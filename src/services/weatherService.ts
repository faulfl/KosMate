import type { WeatherApiResponse, WeatherInfo } from "@/types/weather";

// Koordinat default Jakarta / WIB untuk area kos
const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&timezone=Asia%2FJakarta";

/**
 * Mengambil data cuaca terkini dari Open-Meteo API menggunakan custom Promise.
 * Mengimplementasikan seluruh materi Modul 3:
 * 1. fetch() metode GET
 * 2. .then() untuk validasi respons HTTP dan parsing JSON
 * 3. Promise dengan resolve() dan reject()
 */
export function fetchCurrentWeather(): Promise<WeatherApiResponse> {
  return new Promise((resolve, reject) => {
    fetch(WEATHER_API_URL, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP error cuaca: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data: WeatherApiResponse) => {
        resolve(data);
      })
      .catch((error: Error) => {
        reject(error);
      });
  });
}

/**
 * Menerjemahkan data cuaca Open-Meteo menjadi informasi praktis untuk anak kos:
 * suhu, kelembapan, kondisi, waktu update, dan rekomendasi jemuran baju.
 */
export function interpretWeather(data: WeatherApiResponse): WeatherInfo {
  const current = data.current;
  const temp = Math.round(current.temperature_2m);
  const humidity = current.relative_humidity_2m;
  const precipitation = current.precipitation;
  const code = current.weather_code;

  let description = "Cerah";
  let icon = "☀️";
  let isSafe = true;

  // WMO Weather interpretation codes (WMO Code 0-99)
  if (code === 0) {
    description = "Cerah";
    icon = "☀️";
    isSafe = true;
  } else if (code >= 1 && code <= 3) {
    description = "Sebagian Berawan";
    icon = "⛅";
    isSafe = true;
  } else if (code === 45 || code === 48) {
    description = "Berkabut";
    icon = "🌫️";
    isSafe = false;
  } else if (code >= 51 && code <= 55) {
    description = "Gerimis Ringan";
    icon = "🌦️";
    isSafe = false;
  } else if (code >= 61 && code <= 67) {
    description = "Hujan";
    icon = "🌧️";
    isSafe = false;
  } else if (code >= 80 && code <= 82) {
    description = "Hujan Deras";
    icon = "⛈️";
    isSafe = false;
  } else if (code >= 95) {
    description = "Badai Petir";
    icon = "⚡";
    isSafe = false;
  }

  // Jika presipitasi terdeteksi di atas 0 mm
  if (precipitation > 0) {
    isSafe = false;
  }

  return {
    temperature: temp,
    humidity,
    precipitation,
    weatherDescription: description,
    weatherIcon: icon,
    laundryStatus: isSafe ? "Aman Jemur Baju" : "Waspada Jemuran",
    laundryTip: isSafe
      ? "👕 Cuaca bersahabat, waktu tepat untuk menjemur pakaian!"
      : "⚠️ Potensi hujan/lembab, jangan jemur di luar ruangan!",
    isSafeForLaundry: isSafe,
  };
}
