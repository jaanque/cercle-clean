import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

/**
 * StampsSkeleton - Loader animado premium y fiel para la pantalla de Fidelidad y Sellos.
 * Imita perfectamente la estructura compacta y minimalista de la pantalla final.
 */
export default function StampsSkeleton() {
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
    <View style={styles.container}>
      {/* 1. SKELETON: Tarjeta de Sellos Compacta (walletCard) */}
      <View style={styles.walletCardSkeleton}>
        {/* Grid de 5 sellos roseta */}
        <View style={styles.stampsGridSkeleton}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Animated.View key={index} style={[styles.stampSlotSkeleton, { opacity: pulseAnim }]} />
          ))}
        </View>
        {/* Texto de progreso */}
        <Animated.View style={[styles.lineSkeleton, { width: '60%', height: 12, opacity: pulseAnim, marginTop: 12 }]} />
        {/* Barra de progreso */}
        <Animated.View style={[styles.lineSkeleton, { width: '100%', height: 8, opacity: pulseAnim, marginTop: 8 }]} />
      </View>

      {/* 2. SKELETON: Recompensas disponibles */}
      <View style={styles.sectionSkeleton}>
        <Animated.View style={[styles.titleSkeleton, { width: 180, opacity: pulseAnim }]} />
        
        <View style={styles.rewardsListSkeleton}>
          {Array.from({ length: 2 }).map((_, index) => (
            <View key={index} style={styles.rewardCardSkeleton}>
              <View style={styles.rewardHeaderSkeleton}>
                <Animated.View style={[styles.iconCircleSkeleton, { opacity: pulseAnim }]} />
                <View style={styles.rewardTextsSkeleton}>
                  <Animated.View style={[styles.lineSkeleton, { width: 120, height: 14, opacity: pulseAnim }]} />
                  <Animated.View style={[styles.lineSkeleton, { width: '90%', height: 12, opacity: pulseAnim, marginTop: 6 }]} />
                </View>
              </View>
              <Animated.View style={[styles.buttonSkeleton, { opacity: pulseAnim }]} />
            </View>
          ))}
        </View>
      </View>

      {/* 3. SKELETON: Cómo funciona */}
      <View style={styles.sectionSkeleton}>
        <Animated.View style={[styles.titleSkeleton, { width: 130, opacity: pulseAnim }]} />
        <View style={styles.instructionsListSkeleton}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.stepItemSkeleton}>
              <Animated.View style={[styles.stepIconSkeleton, { opacity: pulseAnim }]} />
              <View style={styles.stepTextsSkeleton}>
                <Animated.View style={[styles.lineSkeleton, { width: 100, height: 12, opacity: pulseAnim }]} />
                <Animated.View style={[styles.lineSkeleton, { width: '80%', height: 10, opacity: pulseAnim, marginTop: 6 }]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 24,
  },
  walletCardSkeleton: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
  },
  stampsGridSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  stampSlotSkeleton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EAEAEA',
    transform: [{ rotate: '45deg' }],
  },
  lineSkeleton: {
    backgroundColor: '#EAEAEA',
    borderRadius: 4,
  },
  sectionSkeleton: {
    gap: 14,
  },
  titleSkeleton: {
    height: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    marginBottom: 4,
  },
  rewardsListSkeleton: {
    gap: 14,
  },
  rewardCardSkeleton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 22,
    padding: 16,
    gap: 16,
  },
  rewardHeaderSkeleton: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconCircleSkeleton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAEAEA',
  },
  rewardTextsSkeleton: {
    flex: 1,
  },
  buttonSkeleton: {
    height: 40,
    backgroundColor: '#EAEAEA',
    borderRadius: 18,
  },
  instructionsListSkeleton: {
    gap: 16,
    backgroundColor: '#F7F7F9',
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  stepItemSkeleton: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  stepIconSkeleton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAEAEA',
  },
  stepTextsSkeleton: {
    flex: 1,
  },
});
