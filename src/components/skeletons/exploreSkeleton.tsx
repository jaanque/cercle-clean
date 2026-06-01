import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

/**
 * ExploreSkeleton - Skeleton Loader premium con efecto de pulso suave
 * diseñado especialmente para la interfaz de la ExploreScreen.
 */
export default function ExploreSkeleton() {
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
      {/* 1. SKELETON: Búsquedas Recientes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Animated.View style={[styles.titleSkeleton, { width: 140, opacity: pulseAnim }]} />
          <Animated.View style={[styles.linkSkeleton, { width: 70, opacity: pulseAnim }]} />
        </View>
        <View style={styles.list}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.recentRow}>
              <Animated.View style={[styles.circleIconSkeleton, { opacity: pulseAnim }]} />
              <Animated.View style={[styles.textLineSkeleton, { width: '50%', opacity: pulseAnim }]} />
            </View>
          ))}
        </View>
      </View>

      {/* 2. SKELETON: Banner CerclePlus */}
      <Animated.View style={[styles.bannerSkeleton, { opacity: pulseAnim }]} />

      {/* 3. SKELETON: Tendencias ("Lo que más se busca hoy") */}
      <View style={[styles.section, { marginTop: 12 }]}>
        <View style={styles.sectionHeader}>
          <Animated.View style={[styles.titleSkeleton, { width: 180, opacity: pulseAnim }]} />
        </View>
        <View style={styles.list}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.trendingRow}>
              <View style={styles.trendingLeft}>
                <Animated.View style={[styles.indexSkeleton, { opacity: pulseAnim }]} />
                <View style={styles.trendingTextCol}>
                  <Animated.View style={[styles.textLineSkeleton, { width: 120, height: 14, opacity: pulseAnim }]} />
                  <Animated.View style={[styles.textLineSkeleton, { width: 180, height: 11, marginTop: 6, opacity: pulseAnim }]} />
                </View>
              </View>
              <Animated.View style={[styles.chevronSkeleton, { opacity: pulseAnim }]} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 28,
  },
  section: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleSkeleton: {
    height: 18,
    backgroundColor: '#EAEAEA',
    borderRadius: 6,
  },
  linkSkeleton: {
    height: 14,
    backgroundColor: '#EAEAEA',
    borderRadius: 4,
  },
  list: {
    width: '100%',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
    gap: 12,
  },
  circleIconSkeleton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EAEAEA',
  },
  textLineSkeleton: {
    height: 14,
    backgroundColor: '#EAEAEA',
    borderRadius: 4,
  },
  bannerSkeleton: {
    height: 90,
    backgroundColor: '#EAEAEA',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  trendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  trendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  indexSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EAEAEA',
  },
  trendingTextCol: {
    flex: 1,
  },
  chevronSkeleton: {
    width: 10,
    height: 14,
    backgroundColor: '#EAEAEA',
    borderRadius: 3,
  },
});
