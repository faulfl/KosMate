
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  FoodPlace,
  getFoodPlaces,
} from '../services/foodService';

export default function FoodScreen() {
  const [foods, setFoods] = useState<FoodPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFoods = async () => {
    try {
      setError('');
      const data = await getFoodPlaces();
      setFoods(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data makanan'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Memuat makanan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Makanan Viral</Text>
      <Text style={styles.subtitle}>
        Rekomendasi kuliner untuk mahasiswa
      </Text>

      <FlatList
        data={foods}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text>Belum ada rekomendasi makanan.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>
              {item.category}
            </Text>
            <Text>{item.description}</Text>
            <Text style={styles.price}>
              Rp{item.price.toLocaleString('id-ID')}
            </Text>
            <Text>{item.address}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  category: {
    color: '#D97706',
    fontWeight: '600',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
