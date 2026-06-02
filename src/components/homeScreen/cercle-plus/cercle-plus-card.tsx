import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

interface CerclePlusCardProps {
  compact?: boolean;
  onPress?: () => void;
}

export default function CerclePlusCard({ compact = false, onPress }: CerclePlusCardProps) {
  const features = [
    'Sin comisiones en tus pedidos',
    'Acceso exclusivo e ilimitado a Cercle AI',
    'Envíos gratis y prioridad de entrega',
  ];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compactCard,
        pressed && { opacity: 0.93, transform: [{ scale: 0.985 }] }
      ]}
    >
      {/* Header Row */}
      <View style={[styles.headerRow, compact && styles.compactHeaderRow]}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Cercle</Text>
          <View style={styles.plusBadge}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </View>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Probar gratis</Text>
        </Pressable>
      </View>

      {/* Features List (Hided when compact is true) */}
      {!compact && (
        <View style={styles.featuresList}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.checkBadge}>
                <SymbolView
                  name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                  size={10}
                  tintColor="#ffffff"
                  weight="bold"
                />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(72, 110, 60, 0.08)', // Beautiful tinted olive green background
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(72, 110, 60, 0.15)', // Matching subtle border
    padding: 20,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1E00', // Premium dark green text
  },
  plusBadge: {
    backgroundColor: Colors.accent,
    width: 22,
    height: 22,
    borderRadius: 6, // Square-ish modern badge like the bottomsheet
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-12deg' }], // Playful matching rotation!
  },
  plusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 16,
  },
  button: {
    backgroundColor: Colors.accent, // Premium solid button
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#ffffff', // Crisp white text
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkBadge: {
    backgroundColor: Colors.accent, // Matching cohesive badge color
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#3A4D39', // Premium dark slate green text
    fontWeight: '600',
  },
  compactCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  compactHeaderRow: {
    marginBottom: 0,
  },
});
