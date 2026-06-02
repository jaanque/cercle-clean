import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

/**
 * OrdersSkeleton - Skeleton Loader premium y ultra fiel para la pantalla de Pedidos.
 * Sincroniza al píxel el diseño del listado de pedidos:
 * 1. Control Segmentado (Filtros) -> Alto: 42px
 * 2. Tarjetas de Pedido (OrderCard) -> Alto: ~150px, con ID, Badge de estado y botón central.
 */
export default function OrdersSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Animación de pulso infinito suave y unificada
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
      {/* 1. SKELETON: Control Segmentado Superior (Filtros) */}
      <Animated.View style={[styles.segmentedSkeleton, { opacity: pulseAnim }]} />

      {/* 2. SKELETON: Listado de Tarjetas de Pedido */}
      <View style={styles.listContainer}>
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.orderCardSkeleton}>
            {/* Cabecera de Tarjeta: ID + Status Badge */}
            <View style={styles.orderHeaderSkeleton}>
              <Animated.View style={[styles.lineSkeleton, { width: 90, height: 16, opacity: pulseAnim }]} />
              <Animated.View style={[styles.statusBadgeSkeleton, { opacity: pulseAnim }]} />
            </View>

            {/* Detalles del Pedido */}
            <View style={styles.detailsContainer}>
              <Animated.View style={[styles.lineSkeleton, { width: '70%', height: 14, opacity: pulseAnim }]} />
              <Animated.View style={[styles.lineSkeleton, { width: '50%', height: 14, opacity: pulseAnim }]} />
              <Animated.View style={[styles.lineSkeleton, { width: '40%', height: 14, opacity: pulseAnim }]} />
            </View>

            {/* Botón de Detalles */}
            <Animated.View style={[styles.buttonSkeleton, { opacity: pulseAnim }]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 20,
  },
  segmentedSkeleton: {
    height: 42,
    backgroundColor: '#F0F0F0',
    borderRadius: 14,
    marginHorizontal: 20,
    marginVertical: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 4,
  },
  orderCardSkeleton: {
    backgroundColor: '#F7F7F9',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    gap: 12,
  },
  orderHeaderSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    paddingBottom: 10,
    marginBottom: 4,
  },
  lineSkeleton: {
    backgroundColor: '#EAEAEA',
    borderRadius: 4,
  },
  statusBadgeSkeleton: {
    width: 76,
    height: 22,
    backgroundColor: '#EAEAEA',
    borderRadius: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  buttonSkeleton: {
    height: 40,
    backgroundColor: '#EAEAEA',
    borderRadius: 22,
    marginTop: 4,
  },
});
