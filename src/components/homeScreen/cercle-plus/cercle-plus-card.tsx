import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

interface CerclePlusCardProps {
  compact?: boolean;
}

export default function CerclePlusCard({ compact = false }: CerclePlusCardProps) {
  const features = [
    'Sin comisiones en tus pedidos',
    'Acceso exclusivo e ilimitado a Cercle AI',
    'Envíos gratis y prioridad de entrega',
  ];

  return (
    <View style={[styles.card, compact && styles.compactCard]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background2,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
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
    gap: 6,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  plusBadge: {
    backgroundColor: Colors.accent,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 16,
  },
  button: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
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
    backgroundColor: '#10B981', // Vibrant green
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  compactCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  compactHeaderRow: {
    marginBottom: 0, // No bottom margin because there are no features below it
  },
});
