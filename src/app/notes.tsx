import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  created_at: string;
};

export default function NotesScreen() {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State untuk fitur Update (Edit)
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // 1. READ (Ambil data dari tabel yang ada)
  async function loadNotes() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data ?? []);
    } catch (error: any) {
      const msg = error?.message || "Gagal memuat catatan";
      if (Platform.OS === "web") {
        window.alert("Gagal Memuat Catatan: " + msg);
      } else {
        Alert.alert("Gagal Memuat Catatan", msg);
      }
    } finally {
      setLoading(false);
    }
  }

  // 2. CREATE (Tambah catatan baru)
  async function addNote() {
    if (!user) {
      if (Platform.OS === "web") {
        window.alert("Kamu belum login.");
      } else {
        Alert.alert("Gagal", "Kamu belum login.");
      }
      return;
    }

    if (!title.trim()) {
      if (Platform.OS === "web") {
        window.alert("Judul catatan wajib diisi.");
      } else {
        Alert.alert("Perhatian", "Judul catatan wajib diisi.");
      }
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.from("notes").insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim() || null,
      });

      if (error) throw error;

      setTitle("");
      setContent("");
      if (Platform.OS === "web") {
        window.alert("Catatan berhasil disimpan.");
      } else {
        Alert.alert("Berhasil", "Catatan berhasil disimpan.");
      }
      await loadNotes();
    } catch (error: any) {
      const msg = error?.message || "Gagal menyimpan";
      if (Platform.OS === "web") {
        window.alert("Gagal Menyimpan: " + msg);
      } else {
        Alert.alert("Gagal Menyimpan", msg);
      }
    } finally {
      setSaving(false);
    }
  }

  // 3. UPDATE (Edit catatan yang sudah ada di tabel)
  async function handleUpdateNote() {
    if (!editingNote || !editTitle.trim()) {
      if (Platform.OS === "web") {
        window.alert("Judul catatan tidak boleh kosong.");
      } else {
        Alert.alert("Perhatian", "Judul catatan tidak boleh kosong.");
      }
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: editTitle.trim(),
          content: editContent.trim() || null,
        })
        .eq("id", editingNote.id);

      if (error) throw error;

      if (Platform.OS === "web") {
        window.alert("Catatan berhasil diperbarui.");
      } else {
        Alert.alert("Berhasil", "Catatan berhasil diperbarui.");
      }
      setEditingNote(null);
      await loadNotes();
    } catch (error: any) {
      const msg = error?.message || "Gagal memperbarui";
      if (Platform.OS === "web") {
        window.alert("Gagal Memperbarui: " + msg);
      } else {
        Alert.alert("Gagal Memperbarui", msg);
      }
    } finally {
      setSaving(false);
    }
  }

  // 4. DELETE (Hapus catatan dari tabel)
  async function executeDelete(id: string) {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Gagal menghapus:", error);
        if (Platform.OS === "web") {
          window.alert("Gagal Menghapus: " + error.message);
        } else {
          Alert.alert("Gagal Menghapus", error.message);
        }
        return;
      }

      // Optimistic update UI
      setNotes((prev) => prev.filter((item) => item.id !== id));
      if (Platform.OS === "web") {
        window.alert("Catatan berhasil dihapus.");
      } else {
        Alert.alert("Berhasil", "Catatan berhasil dihapus.");
      }
    } catch (error: any) {
      console.error("Kesalahan hapus:", error);
      const msg = error?.message || "Terjadi kesalahan saat menghapus.";
      if (Platform.OS === "web") {
        window.alert("Terjadi Kesalahan: " + msg);
      } else {
        Alert.alert("Terjadi Kesalahan", msg);
      }
    }
  }

  function confirmDelete(id: string) {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Apakah kamu yakin ingin menghapus catatan ini?");
      if (confirmed) {
        executeDelete(id);
      }
      return;
    }

    Alert.alert(
      "Hapus Catatan",
      "Apakah kamu yakin ingin menghapus catatan ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => executeDelete(id),
        },
      ],
    );
  }

  useEffect(() => {
    loadNotes();
  }, [user]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.replace("/")}>
        <Text style={styles.backButtonText}>‹ Kembali</Text>
      </Pressable>

      <Text style={styles.heading}>Catatan KosMate</Text>
      <Text style={styles.subtitle}>
        Simpan catatan kegiatan dan kebutuhan kos kamu.
      </Text>

      {/* Input Tambah */}
      <TextInput
        style={styles.input}
        placeholder="Judul catatan"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Isi catatan..."
        placeholderTextColor="#888"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <Pressable style={styles.button} onPress={addNote} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#0B1220" />
        ) : (
          <Text style={styles.buttonText}>+ Simpan Catatan</Text>
        )}
      </Pressable>

      <Text style={styles.sectionTitle}>Daftar Catatan</Text>

      {loading ? (
        <ActivityIndicator color="#DFAF34" />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Belum ada catatan.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle}>{item.title}</Text>

                {/* Tombol Aksi Edit & Hapus */}
                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => {
                      setEditingNote(item);
                      setEditTitle(item.title);
                      setEditContent(item.content ?? "");
                    }}
                    style={styles.editBtn}
                  >
                    <Text style={styles.editBtnText}>✏️ Edit</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => confirmDelete(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.deleteBtnText}>🗑️ Hapus</Text>
                  </Pressable>
                </View>
              </View>

              <Text style={styles.noteContent}>
                {item.content || "Tidak ada isi catatan."}
              </Text>
            </View>
          )}
        />
      )}

      {/* Pop-up Modal untuk Edit Catatan */}
      <Modal visible={!!editingNote} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Catatan</Text>

            <TextInput
              style={styles.input}
              placeholder="Judul catatan"
              placeholderTextColor="#888"
              value={editTitle}
              onChangeText={setEditTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Isi catatan..."
              placeholderTextColor="#888"
              value={editContent}
              onChangeText={setEditContent}
              multiline
            />

            <View style={styles.modalActionRow}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setEditingNote(null)}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleUpdateNote}
                disabled={saving}
              >
                <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    padding: 24,
    paddingTop: 55,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#DFAF34",
  },
  subtitle: {
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    color: "#0B1220",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#DFAF34",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#0B1220",
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    color: "#AAAAAA",
    textAlign: "center",
    marginTop: 15,
  },
  noteCard: {
    backgroundColor: "#1C293D",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteTitle: {
    color: "#DFAF34",
    fontWeight: "bold",
    fontSize: 17,
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  editBtn: {
    backgroundColor: "#374151",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editBtnText: {
    color: "#93C5FD",
    fontSize: 12,
  },
  deleteBtn: {
    backgroundColor: "#374151",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: "#F87171",
    fontSize: 12,
  },
  noteContent: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#1C293D",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#DFAF34",
    fontSize: 15,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#111827",
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#374151",
  },
  modalTitle: {
    color: "#DFAF34",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: "#374151",
  },
  cancelBtnText: {
    color: "#FFFFFF",
  },
  saveBtn: {
    backgroundColor: "#DFAF34",
  },
  saveBtnText: {
    color: "#0B1220",
    fontWeight: "bold",
  },
});
