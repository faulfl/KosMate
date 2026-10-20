
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ActivityScreen() {
  const router = useRouter();

  const { title, description, icon } =
    useLocalSearchParams<{
      title?: string;
      description?: string;
      icon?: string;
    }>();

  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    console.log(
      isDone
        ? "Aktivitas selesai"
        : "Aktivitas belum selesai"
    );
  }, [isDone]);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon ?? "📋"}</Text>

      <Text style={styles.title}>
        {title ?? "Detail Aktivitas"}
      </Text>

      <Text style={styles.description}>
        {description ?? "Informasi aktivitas anak kos."}
      </Text>

      <View style={styles.statusCard}>
        <Text style={styles.status}>
          Status: {isDone ? "Selesai" : "Belum selesai"}
        </Text>
      </View>

      <Pressable
        style={[
          styles.button,
          isDone && styles.doneButton,
        ]}
        onPress={() => setIsDone(!isDone)}
      >
        <Text style={styles.buttonText}>
          {isDone ? "Batalkan Selesai" : "Tandai Selesai"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.back()}
      >
        <Text style={styles.secondaryButtonText}>
          Kembali
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.secondaryButtonText}>
          Ke Halaman Utama
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: {
    fontSize: 56,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#DFAF34",
    textAlign: "center",
  },
  description: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: "#CBD5E1",
    textAlign: "center",
  },
  statusCard: {
    marginTop: 28,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#111827",
    width: "100%",
    alignItems: "center",
  },
  status: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#DFAF34",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  doneButton: {
    backgroundColor: "#0F7476",
  },
  buttonText: {
    color: "#0B1220",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#DFAF34",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#DFAF34",
    fontSize: 15,
    fontWeight: "600",
  },
});
