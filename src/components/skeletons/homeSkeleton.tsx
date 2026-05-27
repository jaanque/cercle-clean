import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';

/**
 * HomeSkeleton - Skeleton Loader premium y ultra fiel para la HomeScreen.
 * Utiliza la API de Animated de React Native para lograr un efecto de desvanecimiento
 * y pulso continuo extremadamente suave, simulando la carga real de los widgets.
 * 
 * NOTA: Diseñado como un View plano para integrarse limpiamente dentro del ScrollView principal
 * y evitar advertencias de contenedores de scroll anidados en React Native.
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
      {/* 1. SKELETON: Tarjeta de Sellos */}
      <Animated.View style={[styles.sellosCardSkeleton, { opacity: pulseAnim }]} />

      {/* 2. SKELETON: Sección de Ofertas (Horizontal List) */}
      <View style={styles.sectionHeader}>
        <Animated.View style={[styles.titleSkeleton, { width: 120, opacity: pulseAnim }]} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={styles.ofertaCardSkeleton}>
            <Animated.View style={[styles.ofertaImageSkeleton, { opacity: pulseAnim }]} />
            <View style={styles.ofertaDetails}>
              <View style={styles.detailsLeft}>
                <Animated.View style={[styles.lineSkeleton, { width: '80%', opacity: pulseAnim }]} />
                <Animated.View style={[styles.lineSkeleton, { width: '50%', marginTop: 6, opacity: pulseAnim }]} />
                <Animated.View style={[styles.lineSkeleton, { width: '40%', marginTop: 8, opacity: pulseAnim }]} />
              </View>
              <Animated.View style={[styles.addButtonSkeleton, { opacity: pulseAnim }]} />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 3. SKELETON: Banner CerclePlus */}
      <Animated.View style={[styles.bannerSkeleton, { opacity: pulseAnim }]} />

      {/* 4. SKELETON: Sección de Locales (Vertical List) */}
      <View style={styles.sectionHeader}>
        <Animated.View style={[styles.titleSkeleton, { width: 140, opacity: pulseAnim }]} />
      </View>
      <View style={styles.verticalList}>
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.storeCardSkeleton}>
            <Animated.View style={[styles.storeImageSkeleton, { opacity: pulseAnim }]} />
            <View style={styles.storeDetails}>
              <View style={styles.storeRow}>
                <Animated.View style={[styles.lineSkeleton, { width: '60%', opacity: pulseAnim }]} />
                <Animated.View style={[styles.lineSkeleton, { width: '15%', opacity: pulseAnim }]} />
              </View>
              <Animated.View style={[styles.lineSkeleton, { width: '40%', marginTop: 8, opacity: pulseAnim }]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sellosCardSkeleton: {
    height: 82,
    backgroundColor: '#EAEAEA',
    borderRadius: 22,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  titleSkeleton: {
    height: 20,
    backgroundColor: '#EAEAEA',
    borderRadius: 6,
  },
  horizontalScroll: {
    gap: 16,
    paddingBottom: 10,
  },
  ofertaCardSkeleton: {
    width: 270,
  },
  ofertaImageSkeleton: {
    height: 155,
    backgroundColor: '#EAEAEA',
    borderRadius: 22,
    width: '100%',
  },
  ofertaDetails: {
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
  bannerSkeleton: {
    height: 150,
    backgroundColor: '#EAEAEA',
    borderRadius: 22,
    marginTop: 28,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  verticalList: {
    gap: 20,
    marginTop: 4,
  },
  storeCardSkeleton: {
    width: '100%',
  },
  storeImageSkeleton: {
    height: 190,
    backgroundColor: '#EAEAEA',
    borderRadius: 22,
    width: '100%',
  },
  storeDetails: {
    marginTop: 12,
    paddingHorizontal: 4,
    gap: 4,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
