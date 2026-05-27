import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Animated } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

interface FloatingCartProps {
  count: number;
  onPress?: () => void;
}

/**
 * FloatingCart - Botón/Píldora flotante compacta del carrito de compras.
 * Inspirado en diseños premium (apretadito, forma de píldora redondeada, flotante al centro).
 * Se adapta perfectamente al color corporativo de la aplicación (Colors.accent).
 */
export default function FloatingCart({ count, onPress }: FloatingCartProps) {
  const [shouldRender, setShouldRender] = React.useState(count > 0);
  const fadeAnim = useRef(new Animated.Value(count > 0 ? 1 : 0)).current;
  const slideAnim = useRef(new Animated.Value(count > 0 ? 0 : 25)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (count > 0) {
      setShouldRender(true);
      // Animación suave de entrada (fade-in + slide-up)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 9,
          useNativeDriver: true,
        }),
      ]).start();

      // Micro-animación de pulso/escala al cambiar la cantidad de artículos
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.06,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animación suave de salida (fade-out + slide-down) antes de desmontar
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 30,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [count]);

  if (!shouldRender) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Pressable style={styles.pill} onPress={onPress}>
        {/* Lado izquierdo: Icono de cesta/carrito en blanco */}
        <SymbolView
          name={{ ios: 'basket.fill', android: 'shopping_basket', web: 'shopping_basket' }}
          size={18}
          tintColor="#ffffff"
        />

        {/* Centro: Texto principal */}
        <Text style={styles.text}>Ver carrito</Text>

        {/* Lado derecho: Círculo oscuro con la cantidad de artículos */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center', // Flota perfectamente centrado horizontalmente
    zIndex: 999,
  },
  pill: {
    backgroundColor: Colors.accent, // Color corporativo #5B2333
    borderRadius: 999, // Forma de píldora súper redondeada
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    gap: 10,

    // Sombra premium suave estándar para elevar la píldora de forma limpia
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Círculo oscuro semitransparente como la referencia
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
});


