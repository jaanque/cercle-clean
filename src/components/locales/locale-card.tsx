import React from 'react';
import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import { Locale } from '@/mockData/locales';

interface LocaleCardProps {
  locale: Locale;
}

export default function LocaleCard({ locale }: LocaleCardProps) {
  return (
    <Pressable style={styles.card}>
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
            {locale.rating} <Text style={styles.ratingCount}>({locale.ratingCount})</Text>
          </Text>
        </View>
      </View>

      {/* Info Rows */}
      <View style={styles.infoContainer}>
        {/* Row 1: Name and Distance */}
        <View style={styles.row}>
          <Text style={styles.name}>{locale.name}</Text>
          <Text style={styles.distance}>{locale.distance}</Text>
        </View>

        {/* Row 2: Preparation Time */}
        <Text style={styles.prepTime}>{locale.prepTime}</Text>
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
