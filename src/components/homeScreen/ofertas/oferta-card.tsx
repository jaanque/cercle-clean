import React from 'react';
import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

export interface Product {
  id: string;
  name: string;
  price: string;
  original_price: string;
  image: string;
  rating: string;
  reviews_count: string;
  store_id: string;
  stock: number;
}

interface OfertaCardProps {
  oferta: Product;
  fullWidth?: boolean;
  grid?: boolean;
}

const formatReviewsCount = (reviewsCount: string | undefined | null) => {
  if (!reviewsCount) return '';
  const numbersOnly = reviewsCount.replace(/[^0-9.,]/g, '');
  return `(${numbersOnly})`;
};

const parsePrice = (priceStr: string) => {
  const cleaned = priceStr.replace(/[^0-9.,]/g, '').replace(',', '.');
  const parts = cleaned.split('.');
  const integer = parts[0] || '0';
  let decimal = parts[1] || '';
  if (decimal === '00' || decimal === '0') {
    decimal = '';
  }
  if (decimal.length === 1) decimal += '0';
  if (decimal.length > 2) decimal = decimal.substring(0, 2);
  return { integer, decimal };
};

const renderPickupText = (id: string) => {
  const idx = (parseInt(id) || 0) % 4;
  if (idx === 0) {
    return (
      <Text style={styles.pickupText}>
        Recogida <Text style={styles.pickupBold}>GRATIS hoy</Text> en tienda en <Text style={styles.pickupBold}>1h</Text>
      </Text>
    );
  } else if (idx === 1) {
    return (
      <Text style={styles.pickupText}>
        Pasa a buscarlo <Text style={styles.pickupBold}>GRATIS hoy</Text> en <Text style={styles.pickupBold}>2h</Text>
      </Text>
    );
  } else if (idx === 2) {
    return (
      <Text style={styles.pickupText}>
        Disponible para recoger en <Text style={styles.pickupBold}>45 min</Text>
      </Text>
    );
  } else {
    return (
      <Text style={styles.pickupText}>
        Recogida <Text style={styles.pickupBold}>mañana</Text> en tu tienda local
      </Text>
    );
  }
};

const renderStars = (ratingStr: string) => {
  const rating = parseFloat(ratingStr) || 0;
  return (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }).map((_, index) => {
        const starIndex = index + 1;
        let starName = 'star';
        let starColor = '#E5E5EA';
        if (rating >= starIndex) {
          starName = 'star.fill';
          starColor = '#FF9900'; // Estrellas doradas originales estilo Amazon
        } else if (rating >= starIndex - 0.5) {
          starName = 'star.leadinghalf.filled';
          starColor = '#FF9900';
        }
        return (
          <SymbolView
            key={index}
            name={starName as any}
            size={11}
            tintColor={starColor}
          />
        );
      })}
    </View>
  );
};

export default function OfertaCard({ oferta, fullWidth = false, grid = false }: OfertaCardProps) {
  const { integer, decimal } = parsePrice(oferta.price);

  return (
    <Pressable style={[styles.card, fullWidth && styles.fullWidthCard, grid && styles.gridCard]}>
      {/* 100% Full-bleed Image Container sin insignias flotantes */}
      <View style={[styles.imageContainer, grid && styles.gridImageContainer]}>
        <Image source={{ uri: oferta.image }} style={styles.image} />
      </View>

      {/* Area de detalles con espaciado optimizado */}
      <View style={styles.detailsContainer}>
        {/* Titulo del producto en 2 líneas de excelente lectura */}
        <Text style={styles.title} numberOfLines={2}>
          {oferta.name}
        </Text>

        {/* Fila de Valoración (Rating) */}
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>{oferta.rating.replace('.', ',')}</Text>
          {renderStars(oferta.rating)}
          <Text style={styles.ratingCount}>{formatReviewsCount(oferta.reviews_count)}</Text>
        </View>

        {/* Fila de Precios con Decimales en Superíndice perfectos */}
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceInteger}>{integer}</Text>
            {decimal ? (
              <View style={styles.decimalContainer}>
                <Text style={styles.priceDecimal}>{decimal}</Text>
                <Text style={styles.currencySymbol}>€</Text>
              </View>
            ) : (
              <Text style={styles.currencySymbolNoDecimal}>€</Text>
            )}
          </View>
          {oferta.original_price && (
            <Text style={styles.originalPrice}>{oferta.original_price}</Text>
          )}
        </View>

        {/* Tiempo de recogida local */}
        <View style={styles.pickupContainer}>
          {renderPickupText(oferta.id)}
        </View>

        {/* Botón de acción con curvatura estricta de 22px */}
        <View style={styles.actionContainer}>
          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>Comprar ya</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 270,
    marginRight: 16,
  },
  fullWidthCard: {
    width: '100%',
    marginRight: 0,
    marginBottom: 20,
  },
  gridCard: {
    width: '48.5%',
    marginRight: 0,
    marginBottom: 18,
    backgroundColor: '#ffffff',
    borderRadius: 22, // Esquinas estrictamente de 22px
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden', // Recorta la imagen superior a 22px
    padding: 0, // Full-bleed
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  imageContainer: {
    width: '100%',
    height: 145,
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  gridImageContainer: {
    height: 135,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 12,
    gap: 6, // Separación mejorada entre los elementos para mejor lectura
  },
  title: {
    fontSize: 14, // Aumentado para mayor legibilidad
    fontWeight: '400',
    color: '#0F1111',
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F1111',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCount: {
    fontSize: 12,
    color: '#565959',
    fontWeight: '400',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  priceInteger: {
    fontSize: 25,
    fontWeight: '700',
    color: '#0F1111',
    lineHeight: 27,
  },
  decimalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 1,
  },
  priceDecimal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F1111',
    lineHeight: 14,
  },
  currencySymbol: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F1111',
    lineHeight: 14,
    marginLeft: 1,
  },
  currencySymbolNoDecimal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1111',
    marginLeft: 2,
    alignSelf: 'flex-start',
    paddingTop: 2,
  },
  originalPrice: {
    fontSize: 13,
    color: '#8A8A8F',
    textDecorationLine: 'line-through',
    fontWeight: '400',
    paddingBottom: 2,
  },
  pickupContainer: {
    marginTop: 2,
    marginBottom: 2,
  },
  pickupText: {
    fontSize: 12, // Aumentado para leerse con absoluta claridad
    color: '#565959',
    lineHeight: 16,
  },
  pickupBold: {
    fontWeight: '700',
    color: '#0F1111',
  },
  actionContainer: {
    width: '100%',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 9,
    borderRadius: 22, // Esquinas estrictamente de 22px
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 38, // Aumentado ligeramente para mejor pulsación táctil
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
