import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

/**
 * HomeSkeleton - Skeleton Loader premium y ultra fiel para la HomeScreen.
 * Rediseñado para coincidir exactamente con el orden y las proporciones de los widgets reales de index.tsx:
 * 1. Wide Banner Card (Verde/Selecciones) -> Alto: 105px
 * 2. Tarjeta de Sellos (SellosCard) -> Alto: 82px
 * 3. Sección de Locales (LocalesHeader + LocaleCards) -> Cabecera + Cards con imagen de 190px y filas de info
 * 4. Tarjeta Informativa CerclePlus -> Alto: 150px
 */
export default function HomeSkeleton() {
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
      {/* 1. SKELETON: Wide Banner Card (Selecciones) */}
      <Animated.View style={[styles.wideBannerSkeleton, { opacity: pulseAnim }]} />

      {/* 2. SKELETON: Tarjeta de Sellos */}
      <Animated.View style={[styles.sellosCardSkeleton, { opacity: pulseAnim }]} />

      {/* 3. SKELETON: Sección de Locales (Header + Lista Vertical) */}
      <View style={styles.localesHeaderSkeleton}>
        <Animated.View style={[styles.titleSkeleton, { width: 140, opacity: pulseAnim }]} />
      </View>
      
      <View style={styles.verticalList}>
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.storeCardSkeleton}>
            <Animated.View style={[styles.storeImageSkeleton, { opacity: pulseAnim }]} />
            <View style={styles.storeDetails}>
              <View style={styles.storeRow}>
                <Animated.View style={[styles.lineSkeleton, { width: '50%', opacity: pulseAnim }]} />
                <Animated.View style={[styles.lineSkeleton, { width: '15%', opacity: pulseAnim }]} />
              </View>
              <Animated.View style={[styles.lineSkeleton, { width: '30%', marginTop: 6, opacity: pulseAnim }]} />
            </View>
          </View>
        ))}
      </View>

      {/* 4. SKELETON: Banner CerclePlus */}
      <Animated.View style={[styles.cerclePlusSkeleton, { opacity: pulseAnim }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 20,
    gap: 20, // Coincide con styles.dynamicContent de index.tsx (gap: 20)
  },
  wideBannerSkeleton: {
    width: '100%',
    height: 105, // Coincide exactamente con wideBannerCard de index.tsx
    backgroundColor: '#F0F0F0',
    borderRadius: 22,
  },
  sellosCardSkeleton: {
    width: '100%',
    height: 82, // Coincide exactamente con SellosCard de index.tsx
    backgroundColor: '#F0F0F0',
    borderRadius: 22,
  },
  localesHeaderSkeleton: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  titleSkeleton: {
    height: 22,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
  },
  verticalList: {
    gap: 20,
  },
  storeCardSkeleton: {
    width: '100%',
  },
  storeImageSkeleton: {
    height: 190, // Coincide exactamente con LocaleCard de index.tsx
    backgroundColor: '#F0F0F0',
    borderRadius: 22,
    width: '100%',
  },
  storeDetails: {
    marginTop: 10,
    paddingHorizontal: 4,
    gap: 4,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineSkeleton: {
    height: 14,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  cerclePlusSkeleton: {
    width: '100%',
    height: 150, // Coincide con CerclePlusCard de index.tsx
    backgroundColor: '#F0F0F0',
    borderRadius: 22,
  },
});
