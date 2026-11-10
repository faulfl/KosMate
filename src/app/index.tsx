import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  fetchCurrentWeather,
  interpretWeather,
} from "@/services/weatherService";
import type { WeatherInfo } from "@/types/weather";

const screenHeight = Dimensions.get("window").height;

// Type
type Activity = {
  title: string;
  description: string;
  icon: string;
};

// Array of Objects
const activities: Activity[] = [
  {
    title: "Belanja",
    description: "Catat dan kelola kebutuhan belanja anak kos.",
    icon: "🛒",
  },
  {
    title: "Bersih-bersih",
    description: "Atur aktivitas kebersihan kamar dan tempat kos.",
    icon: "🧹",
  },
  {
    title: "Bayar Kos",
    description: "Catat dan ingat pembayaran kos setiap bulan.",
    icon: "💳",
  },
];

// Custom Function
function ActivityCard({
  activity,
  onPress,
}: {
  activity: Activity;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.activityCard,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{activity.icon}</Text>
      </View>

      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{activity.title}</Text>

        <Text style={styles.activityDescription}>{activity.description}</Text>
      </View>
    </Pressable>
  );
}

// Custom Function — Komponen Cuaca & Info Kos (Modul 3)
function WeatherCard({
  weatherInfo,
  isLoading,
  error,
  onRefresh,
}: {
  weatherInfo: WeatherInfo | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  return (
    <View style={styles.weatherCard}>
      {isLoading ? (
        <View style={styles.weatherLoadingRow}>
          <ActivityIndicator size="small" color="#DFAF34" />
          <Text style={styles.weatherLoadingText}>Memuat cuaca kos...</Text>
        </View>
      ) : error ? (
        <View style={styles.weatherErrorRow}>
          <Text style={styles.weatherErrorText}>⚠️ {error}</Text>
          <Pressable
            onPress={onRefresh}
            style={({ pressed }) => [
              styles.weatherRetryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.weatherRetryText}>Coba lagi</Text>
          </Pressable>
        </View>
      ) : weatherInfo ? (
        <View style={styles.weatherCardInner}>
          {/* Kolom Kiri: Suhu & Kondisi */}
          <View style={styles.weatherLeftSection}>
            <View style={styles.weatherHeadlineRow}>
              <Text style={styles.weatherIconEmoji}>
                {weatherInfo.weatherIcon}
              </Text>
              <Text style={styles.weatherTempText}>
                {weatherInfo.temperature}°C
              </Text>
            </View>
            <Text style={styles.weatherConditionText}>
              {weatherInfo.weatherDescription}
            </Text>
            <Text style={styles.weatherDetailText}>
              Area Kos • Lembap {weatherInfo.humidity}%
            </Text>
          </View>

          {/* Kolom Kanan: Status Jemuran & Tombol Refresh */}
          <View style={styles.weatherRightSection}>
            <View
              style={[
                styles.laundryPill,
                weatherInfo.isSafeForLaundry
                  ? styles.laundryPillSafe
                  : styles.laundryPillWarning,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  weatherInfo.isSafeForLaundry
                    ? styles.statusDotSafe
                    : styles.statusDotWarning,
                ]}
              />
              <Text
                style={[
                  styles.laundryPillText,
                  weatherInfo.isSafeForLaundry
                    ? styles.laundryTextSafe
                    : styles.laundryTextWarning,
                ]}
              >
                {weatherInfo.isSafeForLaundry ? "Aman Jemur" : "Waspada Hujan"}
              </Text>
            </View>

            <Pressable
              onPress={onRefresh}
              style={({ pressed }) => [
                styles.weatherRefreshBtn,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.weatherRefreshBtnText}>🔄 Perbarui</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  // State untuk fitur Cuaca Kos (Modul 3)
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi async untuk mengambil data cuaca dari API
  async function loadWeatherData() {
    setIsLoading(true);
    setError(null);

    try {
      // async/await: menunggu hasil Promise dari fetchCurrentWeather()
      const data = await fetchCurrentWeather();
      setWeatherInfo(interpretWeather(data));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengambil data cuaca.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  // Mengambil data saat halaman pertama kali dimuat
  useEffect(() => {
    let isMounted = true;

    fetchCurrentWeather()
      .then((data) => {
        if (isMounted) {
          setWeatherInfo(interpretWeather(data));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Gagal mengambil data cuaca.";
          setError(message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Custom Function untuk scroll
  function handleStart() {
    scrollViewRef.current?.scrollTo({
      y: screenHeight,
      animated: true,
    });
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HERO ================= */}

      <View style={styles.hero}>
        {/* Header Hero */}
        <Text style={styles.logo}>KosMate</Text>

        {/* Widget Cuaca & Info Kos (Modul 3) */}
        <WeatherCard
          weatherInfo={weatherInfo}
          isLoading={isLoading}
          error={error}
          onRefresh={loadWeatherData}
        />

        {/* Isi hero */}
        <View style={styles.heroCenter}>
          <Text style={styles.heroTitle}>
            Kelola Kehidupan Kos
            {"\n"}
            Jadi Lebih Mudah
          </Text>

          <Text style={styles.heroDescription}>
            Kelola kebutuhan, aktivitas, dan pembayaran
            {"\n"}
            kos dalam satu aplikasi.
          </Text>

          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Mulai Kelola</Text>
          </Pressable>
        </View>
      </View>

      {/* ================= CONTENT ================= */}

      <View style={styles.content}>
        <Text style={styles.contentTitle}>Kelola Kebutuhanmu</Text>

        <Text style={styles.contentDescription}>
          Pilih aktivitas yang ingin kamu kelola.
        </Text>

        {/* Loop */}
        <View style={styles.activityList}>
          {activities.map((activity, index) => (
            <ActivityCard
              key={index}
              activity={activity}
              onPress={() =>
                router.push({
                  pathname: "/activity",
                  params: {
                    title: activity.title,
                    description: activity.description,
                    icon: activity.icon,
                  },
                })
              }
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  // HERO
  hero: {
    minHeight: screenHeight,
    backgroundColor: "#0B1220",
    paddingHorizontal: 24,
    paddingTop: 55,
  },

  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#DFAF34",
  },

  heroCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },

  heroTitle: {
    fontSize: 42,
    lineHeight: 50,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  heroDescription: {
    marginTop: 24,
    fontSize: 16,
    lineHeight: 25,
    color: "#CBD5E1",
    textAlign: "center",
  },

  button: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: "#DFAF34",
    borderRadius: 10,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#0B1220",
    fontSize: 16,
    fontWeight: "bold",
  },

  // CONTENT
  content: {
    minHeight: screenHeight,
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 60,
    backgroundColor: "#0B1220",
  },

  contentTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  contentDescription: {
    marginTop: 10,
    marginBottom: 35,
    fontSize: 15,
    color: "#CBD5E1",
    textAlign: "center",
  },

  activityList: {
    gap: 15,
  },

  // CARD
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 20,
  },

  cardPressed: {
    opacity: 0.7,
  },

  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: "#0F7476",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  icon: {
    fontSize: 27,
  },

  activityInfo: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },

  activityDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#CBD5E1",
  },

  // WEATHER WIDGET IN HERO (Modul 3)
  weatherCard: {
    marginTop: 20,
    backgroundColor: "#111827",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },

  weatherLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 10,
  },

  weatherLoadingText: {
    fontSize: 13,
    color: "#94A3B8",
  },

  weatherErrorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  weatherErrorText: {
    fontSize: 12,
    color: "#F87171",
    flex: 1,
  },

  weatherRetryButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#1F2937",
    borderRadius: 6,
  },

  weatherRetryText: {
    fontSize: 12,
    color: "#DFAF34",
    fontWeight: "600",
  },

  weatherCardInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  weatherLeftSection: {
    flex: 1,
  },

  weatherHeadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  weatherIconEmoji: {
    fontSize: 26,
  },

  weatherTempText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  weatherConditionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#CBD5E1",
    marginTop: 2,
  },

  weatherDetailText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  weatherRightSection: {
    alignItems: "flex-end",
    gap: 8,
  },

  laundryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },

  laundryPillSafe: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.3)",
  },

  laundryPillWarning: {
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    borderColor: "rgba(245, 158, 11, 0.3)",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  statusDotSafe: {
    backgroundColor: "#10B981",
  },

  statusDotWarning: {
    backgroundColor: "#F59E0B",
  },

  laundryPillText: {
    fontSize: 12,
    fontWeight: "600",
  },

  laundryTextSafe: {
    color: "#34D399",
  },

  laundryTextWarning: {
    color: "#FBBF24",
  },

  weatherRefreshBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#1F2937",
    borderRadius: 8,
  },

  weatherRefreshBtnText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
