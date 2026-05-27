import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Colors } from '@/constants/theme';

/**
 * ProfileSkeleton - Esqueleto de carga premium para la pantalla de perfil.
 * - Simula el diseño de perfil (avatar circular, textos centrados y botón de acción).
 * - Utiliza animaciones de pulso fluidas e inmersivas.
 */
export default function ProfileSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Animación de pulso infinita y fluida
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.8,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Avatar circular animado */}
      <Animated.View style={[styles.avatar, { opacity: pulseAnim }]} />

      {/* Bloque de textos centrados */}
      <View style={styles.textBlock}>
        <Animated.View style={[styles.titleLine, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.subtitleLine, { opacity: pulseAnim }]} />
      </View>

      {/* Botón inferior animado */}
      <Animated.View style={[styles.button, { opacity: pulseAnim }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    paddingVertical: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EAEAEA',
  },
  textBlock: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  titleLine: {
    width: 180,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#EAEAEA',
  },
  subtitleLine: {
    width: 240,
    height: 16,
    borderRadius: 6,
    backgroundColor: '#F3F3F3',
  },
  button: {
    width: '100%',
    height: 54,
    borderRadius: 22,
    backgroundColor: '#EAEAEA',
    marginTop: 10,
  },
});
