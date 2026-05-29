import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function EmptyCart() {
  const router = useRouter();

  const handleExplore = () => {
    try {
      router.replace('/');
    } catch {
      // Fallback in case of navigation issues
    }
  };

  return (
    <View style={styles.emptyContainer}>
      <SymbolView name="cart.badge.minus" size={60} tintColor="#CCCCCC" />
      <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptySubtitle}>
        Explora nuestros locales y añade productos premium a tu cesta.
      </Text>
      <Pressable 
        style={styles.exploreButton}
        onPress={handleExplore}
      >
        <Text style={styles.exploreButtonText}>Explorar tiendas</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  exploreButton: {
    height: 48,
    backgroundColor: Colors.accent,
    borderRadius: 22, // Redondeado corporativo a 22px
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
