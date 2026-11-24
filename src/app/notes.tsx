
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadNotes() {
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Gagal Memuat Catatan', error.message);
    } else {
      setNotes(data ?? []);
    }

    setLoading(false);
  }

  async function addNote() {
  if (!user) {
    Alert.alert('Gagal', 'Kamu belum login.');
    return;
  }

  if (!title.trim()) {
    Alert.alert('Perhatian', 'Judul catatan wajib diisi.');
    return;
  }

  setSaving(true);

  try {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
      })
      .select();

    if (error) {
      console.error('ERROR SIMPAN CATATAN:', error);
      Alert.alert('Gagal Menyimpan', error.message);
      return;
    }

    console.log('CATATAN BERHASIL DISIMPAN:', data);

    setTitle('');
    setContent('');

    Alert.alert('Berhasil', 'Catatan berhasil disimpan.');

    await loadNotes();
  } catch (error) {
    console.error('KESALAHAN:', error);
    Alert.alert('Terjadi Kesalahan', String(error));
  } finally {
    setSaving(false);
  }
}

  useEffect(() => {
    loadNotes();
  }, [user]);

  return (
    <View style={styles.container}>
  <Pressable
    style={styles.backButton}
    onPress={() => router.replace('/')}
  >
    <Text style={styles.backButtonText}>‹ Kembali</Text>
  </Pressable>

  <Text style={styles.heading}>Catatan KosMate</Text>
      <Text style={styles.subtitle}>
        Simpan catatan kegiatan dan kebutuhan kos kamu.
      </Text>

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

      <Pressable
        style={styles.button}
        onPress={addNote}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#0B1220" />
        ) : (
          <Text style={styles.buttonText}>Simpan Catatan</Text>
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
            <Text style={styles.emptyText}>
              Belum ada catatan.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent}>
                {item.content || 'Tidak ada isi catatan.'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    padding: 24,
    paddingTop: 55,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DFAF34',
  },
  subtitle: {
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#0B1220',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#DFAF34',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0B1220',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 14,
  },
  emptyText: {
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 15,
  },
  noteCard: {
    backgroundColor: '#1C293D',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  noteTitle: {
    color: '#DFAF34',
    fontWeight: 'bold',
    fontSize: 17,
  },
  noteContent: {
    color: '#FFFFFF',
    marginTop: 8,
  },
  backButton: {
  alignSelf: 'flex-start',
  marginBottom: 20,
  paddingVertical: 8,
  paddingHorizontal: 14,
  backgroundColor: '#1C293D',
  borderRadius: 8,
},

backButtonText: {
  color: '#DFAF34',
  fontSize: 16,
  fontWeight: 'bold',
},
});
