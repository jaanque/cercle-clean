import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

/**
 * StoresListSkeleton - Premium pulse skeleton loader matching the LocaleCard list layout.
 */
export default function StoresListSkeleton() {
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
      {Array.from({ length: 3 }).map((_, index) => (
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
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 20,
  },
  storeCardSkeleton: {
    width: '100%',
    marginBottom: 20,
  },
  storeImageSkeleton: {
    height: 190,
    backgroundColor: '#F0F0F0',
    borderRadius: 22, // Strict 22px borderRadius design constraint
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
});
