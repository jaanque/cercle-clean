import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View, Platform } from 'react-native';

/**
 * StoreDetailSkeleton - Skeleton Loader premium y ultra fiel para la StoreDetailScreen.
 * Utiliza la API de Animated de React Native para lograr un efecto de desvanecimiento
 * y pulso continuo extremadamente suave, simulando la carga real de los widgets.
 */
export default function StoreDetailSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Animación de pulso continuo (infinito) y fluida
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* 1. SKELETON: Cabecera de la tienda (StoreHeader) */}
      <View style={styles.headerSkeletonContainer}>
        <Animated.View style={[styles.headerImageSkeleton, { opacity: pulseAnim }]} />
        {/* Botón Volver Falso */}
        <View style={styles.backButtonSkeleton} />
        {/* Info de tienda Falsa */}
        <View style={styles.headerInfoSkeleton}>
          <Animated.View style={[styles.headerTitleSkeleton, { opacity: pulseAnim }]} />
          <Animated.View style={[styles.headerSubtitleSkeleton, { opacity: pulseAnim }]} />
        </View>
      </View>

      {/* 2. SKELETON: Buscador (SearchBar) */}
      <Animated.View style={[styles.searchBarSkeleton, { opacity: pulseAnim }]} />

      {/* 3. SKELETON: Lista de Productos (OfertaCard fullWidth Skeletons) */}
      <View style={styles.productListSkeleton}>
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.productCardSkeleton}>
            {/* Imagen del producto */}
            <Animated.View style={[styles.productImageSkeleton, { opacity: pulseAnim }]} />
            
            {/* Detalles del producto */}
            <View style={styles.productDetailsSkeleton}>
              <View style={styles.detailsLeft}>
                <Animated.View style={[styles.lineSkeleton, { width: '70%', opacity: pulseAnim }]} />
                <Animated.View style={[styles.lineSkeleton, { width: '40%', marginTop: 8, opacity: pulseAnim }]} />
                <Animated.View style={[styles.lineSkeleton, { width: '30%', marginTop: 10, opacity: pulseAnim }]} />
              </View>
              {/* Botón de añadir */}
              <Animated.View style={[styles.addButtonSkeleton, { opacity: pulseAnim }]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerSkeletonContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#EAEAEA',
  },
  headerImageSkeleton: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#EAEAEA',
  },
  backButtonSkeleton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    opacity: 0.8,
  },
  headerInfoSkeleton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    right: 20,
    gap: 8,
  },
  headerTitleSkeleton: {
    height: 24,
    width: '60%',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    opacity: 0.8,
  },
  headerSubtitleSkeleton: {
    height: 14,
    width: '35%',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    opacity: 0.6,
  },
  searchBarSkeleton: {
    height: 50,
    borderRadius: 22,
    backgroundColor: '#EAEAEA',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  productListSkeleton: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 24,
  },
  productCardSkeleton: {
    width: '100%',
    marginBottom: 20,
  },
  productImageSkeleton: {
    height: 155,
    backgroundColor: '#EAEAEA',
    borderRadius: 22,
    width: '100%',
  },
  productDetailsSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  detailsLeft: {
    flex: 1,
  },
  lineSkeleton: {
    height: 14,
    backgroundColor: '#EAEAEA',
    borderRadius: 4,
  },
  addButtonSkeleton: {
    width: 75,
    height: 34,
    backgroundColor: '#EAEAEA',
    borderRadius: 22,
    marginLeft: 12,
  },
});
