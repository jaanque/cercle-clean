import React from 'react';
import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import { Oferta } from '@/mockData/ofertas';

interface OfertaCardProps {
  oferta: Oferta;
}

export default function OfertaCard({ oferta }: OfertaCardProps) {
  return (
    <Pressable style={styles.card}>
      {/* Image Area with Badges */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: oferta.image }} style={styles.image} />
        
        {/* Top-Left Savings Badge */}
        <View style={styles.savingBadge}>
          <Text style={styles.savingText}>Ahorras {oferta.savingAmount}€</Text>
        </View>

        {/* Bottom-Right Rating Badge */}
        <View style={styles.ratingBadge}>
          <SymbolView
            name={{ ios: 'star.fill', android: 'star', web: 'star' }}
            size={12}
            tintColor="#F5A623"
          />
          <Text style={styles.ratingText}>
            {oferta.rating} <Text style={styles.ratingCount}>({oferta.ratingCount})</Text>
          </Text>
        </View>
      </View>

      {/* Details Row */}
      <View style={styles.detailsRow}>
        {/* Left Column (Info & Price) */}
        <View style={styles.infoCol}>
          <Text style={styles.title} numberOfLines={1}>
            {oferta.title}
          </Text>
          <Text style={styles.storeName}>{oferta.storeName}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>{oferta.price} €</Text>
            <Text style={styles.originalPrice}>{oferta.originalPrice} €</Text>
          </View>
        </View>

        {/* Right Column (Añadir Button) */}
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>Añadir +</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 270,
    marginRight: 16,
  },
  imageContainer: {
    width: '100%',
    height: 155,
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
  savingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(30, 20, 24, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  savingText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
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
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  infoCol: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  storeName: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  originalPrice: {
    fontSize: 14,
    color: '#888888',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: Colors.background2,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
});
