import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View, Platform } from 'react-native';

/**
 * StoreDetailSkeleton - Skeleton Loader premium y ultra fiel para la StoreDetailScreen.
 * - Réplica idéntica de la cabecera inmersiva (banner de 220px con avatar flotante de 90px superpuesto).
 * - Réplica del bloque de información central (nombre, metadatos y link de ubicación).
 * - Réplica de la tarjeta Cercle+, el buscador y los productos dinámicos.
 * - Utiliza transiciones de pulso infinitas y fluidas para una sensación sumamente orgánica.
 */
export default function StoreDetailSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. SKELETON: Cabecera Inmersiva (StoreHeader) */}
      <View style={styles.headerSkeletonContainer}>
        {/* Banner de fondo */}
        <Animated.View style={[styles.bannerSkeleton, { opacity: pulseAnim }]} />
        
        {/* Botón volver simulado */}
        <View style={styles.circularButtonLeftSkeleton} />

        {/* Avatar/Logotipo flotante centrado superpuesto */}
        <Animated.View style={[styles.avatarSkeleton, { opacity: pulseAnim }]} />
      </View>

      {/* 2. SKELETON: Información Central de la Tienda */}
      <View style={styles.infoSkeletonContainer}>
        {/* Nombre de la tienda */}
        <Animated.View style={[styles.titleSkeleton, { opacity: pulseAnim }]} />
        {/* Stats Row (Rating, reviews, distance, prep time) */}
        <Animated.View style={[styles.statsRowSkeleton, { opacity: pulseAnim }]} />
        {/* Enlace de ubicación */}
        <Animated.View style={[styles.locationRowSkeleton, { opacity: pulseAnim }]} />
      </View>

      {/* 3. SKELETON: Tarjeta Cercle+ Card */}
      <Animated.View style={[styles.cerclePlusSkeleton, { opacity: pulseAnim }]} />

      {/* 4. SKELETON: Buscador de Productos */}
      <Animated.View style={[styles.searchBarSkeleton, { opacity: pulseAnim }]} />



      {/* 5. SKELETON: Lista de Productos */}
      <View style={styles.productListSkeleton}>
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.productCardSkeleton}>
            {/* Imagen del producto */}
            <Animated.View style={[styles.productImageSkeleton, { opacity: pulseAnim }]} />
            
            {/* Detalles del producto */}
            <View style={styles.productDetailsSkeleton}>
              <View style={styles.detailsLeft}>
                <Animated.View style={[styles.productTitleSkeleton, { opacity: pulseAnim }]} />
                <Animated.View style={[styles.productStoreSkeleton, { opacity: pulseAnim }]} />
                <Animated.View style={[styles.productPriceSkeleton, { opacity: pulseAnim }]} />
              </View>
              {/* Botón Añadir */}
              <Animated.View style={[styles.addButtonSkeleton, { opacity: pulseAnim }]} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerSkeletonContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#ffffff',
    marginBottom: 55, // Espacio para alojar la mitad inferior del avatar flotante
  },
  bannerSkeleton: {
    width: '100%',
    height: 220,
    backgroundColor: '#EAEAEA',
  },
  circularButtonLeftSkeleton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    opacity: 0.45,
  },

  avatarSkeleton: {
    position: 'absolute',
    bottom: -45,
    alignSelf: 'center',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#EAEAEA',
  },
  infoSkeletonContainer: {
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    gap: 10,
  },
  titleSkeleton: {
    width: 220,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EAEAEA',
  },
  statsRowSkeleton: {
    width: 280,
    height: 14,
    borderRadius: 6,
    backgroundColor: '#EAEAEA',
  },
  locationRowSkeleton: {
    width: 110,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F3F3F3',
  },
  cerclePlusSkeleton: {
    height: 60,
    borderRadius: 22,
    backgroundColor: '#EAEAEA',
    marginHorizontal: 20,
    marginTop: 18,
  },
  searchBarSkeleton: {
    height: 50,
    borderRadius: 22,
    backgroundColor: '#F3F3F3',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  productListSkeleton: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  productCardSkeleton: {
    width: '100%',
    marginBottom: 24,
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
  },
  detailsLeft: {
    flex: 1,
    gap: 6,
  },
  productTitleSkeleton: {
    width: '75%',
    height: 16,
    borderRadius: 4,
    backgroundColor: '#EAEAEA',
  },
  productStoreSkeleton: {
    width: '35%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#F3F3F3',
  },
  productPriceSkeleton: {
    width: '25%',
    height: 16,
    borderRadius: 4,
    backgroundColor: '#EAEAEA',
    marginTop: 4,
  },
  addButtonSkeleton: {
    width: 80,
    height: 38,
    backgroundColor: '#EAEAEA',
    borderRadius: 22,
    marginLeft: 12,
  },
});
