import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Animated } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

interface FloatingCartProps {
  count: number;
  onPress?: () => void;
}

/**
 * FloatingCart - Tarjeta flotante premium del carrito de compras.
 * Diseñada meticulosamente para resaltar de forma elegante sin romper la estética de la app.
 * Incorpora micro-animaciones suaves, bordes con realce de acento y un sutil sombreado de color corporativo.
 */
export default function FloatingCart({ count, onPress }: FloatingCartProps) {
  // Inicialización de valores para animaciones fluidas
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (count > 0) {
      // Animación de entrada suave (fade + slide up)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 60,
          friction: 9,
          useNativeDriver: true,
        }),
      ]).start();

      // Micro-animación de pulso/escala al actualizar la cantidad de productos
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.04,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [count]);

  if (count <= 0) return null;

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
      <Pressable style={styles.card} onPress={onPress}>
        {/* Barra de acento vertical izquierda: guía visual elegante y sutil */}
        <View style={styles.accentBar} />

        {/* Contenido principal izquierdo: Icono de carrito con Badge */}
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <SymbolView
                name={{ ios: 'bag.fill', android: 'shopping_bag', web: 'shopping_bag' }}
                size={18}
                tintColor={Colors.accent}
              />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>Ver tu carrito</Text>
            <Text style={styles.subtitle}>
              Tienes {count} {count === 1 ? 'producto añadido' : 'productos añadidos'}
            </Text>
          </View>
        </View>

        {/* Lado derecho: Flecha de acción premium */}
        <View style={styles.actionContainer}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={16}
            tintColor={Colors.accent}
            weight="bold"
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 28,
    left: 20,
    right: 20,
    zIndex: 999,
  },
  card: {
    backgroundColor: '#ffffff', // Blanco puro para contrastar sobre fondos F7F7F7
    borderWidth: 1,
    borderColor: 'rgba(91, 35, 51, 0.15)', // Borde de acento muy suave y premium
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingLeft: 24, // Espacio suficiente para la barra lateral
    paddingRight: 20,
    overflow: 'hidden', // Necesario para recortar la barra lateral de acento

    // Sombreado premium con tintura de color acento para dar profundidad
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: Colors.accent, // Franja lateral distintiva
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    position: 'relative',
  },
  iconWrapper: {
    backgroundColor: 'rgba(91, 35, 51, 0.08)', // Círculo sutil rosa/granate de fondo
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.accent,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff', // Borde blanco para separar visualmente el badge
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    gap: 2,
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    color: '#6E6E6E',
    fontSize: 12,
    fontWeight: '500',
  },
  actionContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(91, 35, 51, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

