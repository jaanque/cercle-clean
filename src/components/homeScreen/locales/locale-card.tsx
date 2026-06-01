import React from 'react';
import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

export interface Store {
  id: string;
  name: string;
  rating: string;
  reviews_count: string;
  delivery_time: string;
  image: string;
  logo?: string;
  tagline?: string;
  distance?: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface LocaleCardProps {
  locale: Store;
}

const formatReviewsCount = (reviewsCount: string | undefined | null) => {
  if (!reviewsCount) return '';
  const numbersOnly = reviewsCount.replace(/[^0-9.,]/g, '');
  return `(${numbersOnly})`;
};

export const getStoreDistance = (store: { latitude?: number | null; longitude?: number | null; distance?: string }) => {
  if (store.distance) return store.distance;
  if (store.latitude !== undefined && store.latitude !== null && store.longitude !== undefined && store.longitude !== null) {
    const userLat = 41.63;
    const userLon = 0.64;
    const R = 6371;
    const dLat = (store.latitude - userLat) * (Math.PI / 180);
    const dLon = (store.longitude - userLon) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLat * (Math.PI / 180)) * Math.cos(store.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return `${d.toFixed(1)} km`;
  }
  return '--';
};

export default function LocaleCard({ locale }: LocaleCardProps) {
  const router = useRouter();

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/store/${locale.id}` as any)}>
      {/* Big Image Container with Rating Badge */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: locale.image }} style={styles.image} />
        
        {/* Bottom-Right Rating Badge */}
        <View style={styles.ratingBadge}>
          <SymbolView
            name={{ ios: 'star.fill', android: 'star', web: 'star' }}
            size={12}
            tintColor="#F5A623"
          />
          <Text style={styles.ratingText}>
            {locale.rating} <Text style={styles.ratingCount}>{formatReviewsCount(locale.reviews_count)}</Text>
          </Text>
        </View>
      </View>

      {/* Info Rows */}
      <View style={styles.infoContainer}>
        {/* Row 1: Name and Distance */}
        <View style={styles.row}>
          <Text style={styles.name}>{locale.name}</Text>
          <Text style={styles.distance}>{getStoreDistance(locale)}</Text>
        </View>

        {/* Row 2: Preparation Time */}
        <Text style={styles.prepTime}>Listo en {locale.delivery_time}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 190,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
  },
  ratingCount: {
    color: '#888888',
    fontWeight: '400',
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  distance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  prepTime: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
    fontWeight: '500',
  },
});
