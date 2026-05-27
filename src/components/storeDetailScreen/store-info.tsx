import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import CerclePlusCard from '../homeScreen/cercle-plus/cercle-plus-card';

interface StoreInfoProps {
  rating: string;
  reviewsCount: string;
  deliveryTime: string;
}

/**
 * StoreInfo - Ficha descriptiva y promocional de la tienda.
 * Incluye la tarjeta flotante de tres columnas (Rating, coste de envío y tiempo de entrega),
 * el banner promocional premium de Cercle Plus, y un indicador de información.
 */
export default function StoreInfo({ rating, reviewsCount, deliveryTime }: StoreInfoProps) {
  // Sanea cualquier formato existente para evitar redundancias como ((2,000+)+)
  const formattedReviews = `(${reviewsCount.replace(/[()+]/g, '').trim()}+)`;

  return (
    <View style={styles.container}>
      {/* Tarjeta flotante de información técnica */}
      <View style={styles.infoCard}>
        {/* Columna 1: Valoración */}
        <View style={styles.column}>
          <View style={styles.iconLabelRow}>
            <SymbolView
              name={{ ios: 'star.fill', android: 'star', web: 'star' }}
              size={16}
              tintColor="#F5A623"
            />
            <Text style={styles.valueText}>{rating}</Text>
          </View>
          <Text style={styles.subText}>{formattedReviews}</Text>
        </View>

        <View style={styles.divider} />

        {/* Columna 2: Recogida en tienda (Gratis) */}
        <View style={styles.column}>
          <View style={styles.iconLabelRow}>
            <SymbolView
              name={{ ios: 'bag.fill', android: 'shopping_bag', web: 'shopping_bag' }}
              size={16}
              tintColor="#333333"
            />
            <Text style={styles.valueText}>Gratis</Text>
          </View>
          <Text style={styles.subText}>recogida</Text>
        </View>

        <View style={styles.divider} />

        {/* Columna 3: Tiempo de preparación */}
        <View style={styles.column}>
          <View style={styles.iconLabelRow}>
            <SymbolView
              name={{ ios: 'clock.fill', android: 'schedule', web: 'schedule' }}
              size={16}
              tintColor="#333333"
            />
            <Text style={styles.valueText}>{deliveryTime}</Text>
          </View>
          <Text style={styles.subText}>min prep.</Text>
        </View>
      </View>

      {/* Banner Oficial Cercle Plus de la Aplicación */}
      <CerclePlusCard compact />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 16, // Colocado limpiamente debajo de la cabecera sin flotación negativa
    gap: 16,
    zIndex: 10,
  },
  infoCard: {
    backgroundColor: Colors.background2, // Usamos la constante del tema background2
    borderRadius: 22, // Manteniendo todo redondeado a 22px
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  column: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  subText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
});
