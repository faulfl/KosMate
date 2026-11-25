import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      Alert.alert("Perhatian", "Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        Alert.alert("Login Gagal", error.message);
        return;
      }

      // Berhasil login — pengalihan rute akan ditangani otomatis oleh AuthGuard di _layout.tsx
    } catch (err) {
      Alert.alert(
        "Kesalahan Jaringan",
        err instanceof Error ? err.message : "Gagal terhubung ke server.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KosMate</Text>
      <Text style={styles.subtitle}>Silakan login ke akun kamu</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#0B1220" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>

      <View style={styles.registerContainer}>
        <Text style={styles.normalText}>Belum punya akun? </Text>
        <Link href="/(auth)/register" style={styles.link}>
          Daftar
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    padding: 28,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#DFAF34",
    textAlign: "center",
  },
  subtitle: {
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 35,
    marginTop: 8,
  },
  label: {
    color: "#FFFFFF",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
    color: "#0B1220",
  },
  button: {
    backgroundColor: "#DFAF34",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#0B1220",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },
  normalText: {
    color: "#FFFFFF",
  },
  link: {
    color: "#DFAF34",
    fontWeight: "bold",
  },
});
