import { useRouter } from "expo-router";
import { useRef } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { supabase } from "../../lib/supabase";

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

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  // Fungsi Logout (Modul 4)
  async function handleLogout() {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Apakah kamu yakin ingin keluar dari akun?",
      );

      if (!confirmed) return;

      await processLogout();
      return;
    }

    Alert.alert(
      "Konfirmasi Logout",
      "Apakah kamu yakin ingin keluar dari akun?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Keluar",
          style: "destructive",
          onPress: processLogout,
        },
      ],
    );
  }

  // Proses Logout Supabase
  async function processLogout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        if (Platform.OS === "web") {
          window.alert("Logout gagal: " + error.message);
        } else {
          Alert.alert("Logout Gagal", error.message);
        }
      }
    } catch (error) {
      console.error("Kesalahan Logout:", error);
    }
  }

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
      {/* HERO */}
      <View style={styles.hero}>
        <View style={styles.header}>
          <Text style={styles.logo}>KosMate</Text>

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.logoutText}>Keluar</Text>
          </Pressable>
        </View>

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

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.contentTitle}>Kelola Kebutuhanmu</Text>

        <Text style={styles.contentDescription}>
          Pilih aktivitas yang ingin kamu kelola.
        </Text>

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

        {/* CATATAN KOSMATE */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Catatan Pribadi</Text>

          <Text style={styles.notesDescription}>
            Simpan catatan penting kebutuhan dan kegiatan kosmu.
          </Text>

          <Pressable
            onPress={() => router.push("/notes")}
            style={({ pressed }) => [
              styles.notesButton,
              pressed && styles.cardPressed,
            ]}
          >
            <Text style={styles.notesIcon}>📝</Text>

            <View style={styles.notesInfo}>
              <Text style={styles.notesButtonTitle}>Catatan Saya</Text>

              <Text style={styles.notesButtonDescription}>
                Lihat dan kelola catatan pribadi
              </Text>
            </View>

            <Text style={styles.notesArrow}>›</Text>
          </Pressable>
        </View>

        {/* MAKANAN VIRAL */}
        <View style={styles.foodSection}>
          <Text style={styles.foodTitle}>Kuliner Mahasiswa</Text>

          <Text style={styles.foodDescription}>
            Temukan rekomendasi makanan viral di sekitar kampus.
          </Text>

          <Pressable
            onPress={() => router.push("/food")}
            style={({ pressed }) => [
              styles.foodButton,
              pressed && styles.cardPressed,
            ]}
          >
            <Text style={styles.foodIcon}>🍜</Text>

            <View style={styles.foodInfo}>
              <Text style={styles.foodButtonTitle}>Makanan Viral</Text>

              <Text style={styles.foodButtonDescription}>
                Lihat rekomendasi kuliner mahasiswa
              </Text>
            </View>

            <Text style={styles.foodArrow}>›</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoutButton: {
    backgroundColor: "#DFAF34",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  logoutText: {
    color: "#0B1220",
    fontWeight: "bold",
    fontSize: 14,
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

  // CARD AKTIVITAS
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

  // CATATAN KOSMATE
  notesSection: {
    marginTop: 35,
  },

  notesTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  notesDescription: {
    fontSize: 14,
    color: "#CBD5E1",
    marginTop: 8,
    marginBottom: 18,
  },

  notesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#DFAF34",
  },

  notesIcon: {
    fontSize: 32,
    marginRight: 16,
  },

  notesInfo: {
    flex: 1,
  },

  notesButtonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DFAF34",
    marginBottom: 5,
  },

  notesButtonDescription: {
    fontSize: 13,
    color: "#CBD5E1",
  },

  notesArrow: {
    fontSize: 28,
    color: "#DFAF34",
  },

  // MAKANAN VIRAL
  foodSection: {
    marginTop: 35,
  },

  foodTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  foodDescription: {
    fontSize: 14,
    color: "#CBD5E1",
    marginTop: 8,
    marginBottom: 18,
  },

  foodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#DFAF34",
  },

  foodIcon: {
    fontSize: 32,
    marginRight: 16,
  },

  foodInfo: {
    flex: 1,
  },

  foodButtonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DFAF34",
    marginBottom: 5,
  },

  foodButtonDescription: {
    fontSize: 13,
    color: "#CBD5E1",
  },

  foodArrow: {
    fontSize: 28,
    color: "#DFAF34",
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
});
