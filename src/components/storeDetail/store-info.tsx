import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

interface StoreInfoProps {
  name: string;
  tagline?: string;
  location?: string;
  rating: string;
  reviewsCount?: string;
  distance?: string;
  deliveryTime?: string;
}

export default function StoreInfo({
  name,
  tagline,
  location,
  rating,
  reviewsCount,
  distance,
  deliveryTime,
}: StoreInfoProps) {
  return (
    <View style={styles.profileSection}>
      <Text style={styles.storeNameText}>{name}</Text>
      
      {tagline && (
        <Text style={styles.taglineText}>{tagline}</Text>
      )}

      {/* Location row */}
      <View style={styles.addressRow}>
        <SymbolView name="mappin.and.ellipse" size={13} tintColor="#64748B" />
        <Text style={styles.addressText}>{location || 'Barcelona, España'}</Text>
      </View>

      {/* Meta Tags Row */}
      <View style={styles.metaTagsRow}>
        <View style={styles.metaTag}>
          <SymbolView name="star.fill" size={11} tintColor="#F59E0B" />
          <Text style={styles.metaTagText}>
            {rating} {
              reviewsCount 
                ? (reviewsCount.includes('(') ? reviewsCount : `(${reviewsCount})`) 
                : '(1.5k+)'
            }
          </Text>
        </View>

        <View style={styles.metaTag}>
          <SymbolView name="location.fill" size={11} tintColor="#486E3C" />
          <Text style={styles.metaTagText}>{distance || '--'}</Text>
        </View>

        <View style={styles.metaTag}>
          <SymbolView name="clock.fill" size={11} tintColor="#486E3C" />
          <Text style={styles.metaTagText}>
            {deliveryTime ? deliveryTime.replace(/Listo en /i, '') : '15 min'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  storeNameText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  taglineText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  metaTagsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(72, 110, 60, 0.09)', // Beautiful tinted olive background
    borderRadius: 22, // rounded strictly to 22px
    paddingVertical: 7,
    paddingHorizontal: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(72, 110, 60, 0.18)',
  },
  metaTagText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#2B4222', // Brand colored dark green text
  },
});
