import { useRef } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

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
    title: "Laundry Terdekat",
    description: "Temukan laundry terdekat dengan lokasi kos kamu.",
    icon: "🧺",
  },
  {
    title: "Makanan Terdekat",
    description: "Cari rekomendasi tempat makan di sekitar kos.",
    icon: "🍽️",
  },
  {
    title: "Bayar Kos",
    description: "Catat tanggal dan jumlah pembayaran kos.",
    icon: "💳",
  },
];

// Custom Function
function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <View style={styles.activityCard}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{activity.icon}</Text>
      </View>

      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{activity.title}</Text>

        <Text style={styles.activityDescription}>{activity.description}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);

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
        {/* Nama aplikasi */}
        <Text style={styles.logo}>KosMate</Text>

        <Text style={styles.greeting}>Halo, Faul 👋</Text>

        <Text style={styles.subtitle}>
          Kelola kebutuhan dan aktivitas kosmu
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Tagihan Bulan Ini</Text>

        <Text style={styles.price}>Rp750.000</Text>

        <Text style={{ color: "#60A5FA" }}>Belum dibayar</Text>
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
            <ActivityCard key={index} activity={activity} />
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
    backgroundColor: "#1c153602",
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
    color: "#2563EB",
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
});
