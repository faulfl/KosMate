import { ScrollView, StyleSheet, Text, View } from "react-native";

// Type untuk data aktivitas
type Activity = {
  title: string;
  description: string;
  icon: string;
};

// Array of Objects
const activities: Activity[] = [
  {
    title: "Belanja",
    description: "Beli sabun dan deterjen",
    icon: "🛒",
  },
  {
    title: "Bersih-bersih",
    description: "Membersihkan kamar",
    icon: "🧹",
  },
  {
    title: "Bayar Kos",
    description: "Bayar kos sebelum tanggal 5",
    icon: "💳",
  },
];

// Custom Function untuk membuat card aktivitas
function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <View style={styles.activityCard}>
      <Text style={styles.icon}>{activity.icon}</Text>

      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>

        <Text style={{ color: "#CBD5E1" }}>{activity.description}</Text>
      </View>
    </View>
  );
}

// Halaman utama KosMate
export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>KosMate 🏠</Text>

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

      <Text style={styles.sectionTitle}>Aktivitas</Text>

      {/* Loop menggunakan map() */}
      {activities.map((activity, index) => (
        <ActivityCard key={index} activity={activity} />
      ))}
    </ScrollView>
  );
}

// External Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  header: {
    padding: 24,
    paddingTop: 60,
  },

  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563EB",
  },

  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 15,
    color: "#CBD5E1",
    marginTop: 6,
  },

  summaryCard: {
    backgroundColor: "#111827",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
  },

  summaryTitle: {
    fontSize: 16,
    color: "#CBD5E1",
  },

  price: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 8,
    color: "#FFFFFF",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
    color: "#FFFFFF",
  },

  activityCard: {
    backgroundColor: "#111827",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    fontSize: 30,
    marginRight: 14,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
});
