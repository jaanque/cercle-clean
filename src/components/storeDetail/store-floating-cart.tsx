import React from 'react';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

interface StoreFloatingCartProps {
  totalItems: number;
  totalPrice: string;
  bottomInset: number;
  onCheckout: () => void;
}

export default function StoreFloatingCart({
  totalItems,
  totalPrice,
  bottomInset,
  onCheckout,
}: StoreFloatingCartProps) {
  // Cart animations
  const cartSlideAnim = React.useRef(new Animated.Value(100)).current;
  const cartOpacityAnim = React.useRef(new Animated.Value(0)).current;
  const badgeScaleAnim = React.useRef(new Animated.Value(1)).current;
  const priceScaleAnim = React.useRef(new Animated.Value(1)).current;

  // Track entry and exit transitions
  React.useEffect(() => {
    if (totalItems > 0) {
      Animated.parallel([
        Animated.spring(cartSlideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 12,
        }),
        Animated.timing(cartOpacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(cartSlideAnim, {
          toValue: 100,
          useNativeDriver: true,
          tension: 100,
          friction: 14,
        }),
        Animated.timing(cartOpacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [totalItems > 0]);

  // Track badge popping animation (discretely)
  React.useEffect(() => {
    if (totalItems > 0) {
      badgeScaleAnim.setValue(0.92);
      Animated.spring(badgeScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 14,
      }).start();
    }
  }, [totalItems]);

  // Track price popping animation (discretely)
  React.useEffect(() => {
    if (totalItems > 0) {
      priceScaleAnim.setValue(0.95);
      Animated.spring(priceScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 14,
      }).start();
    }
  }, [totalPrice]);

  return (
    <Animated.View 
      style={[
        styles.cartFloatingContainer, 
        { 
          bottom: Math.max(bottomInset, 16),
          opacity: cartOpacityAnim,
          transform: [{ translateY: cartSlideAnim }]
        }
      ]}
      pointerEvents={totalItems > 0 ? 'auto' : 'none'}
    >
      <Pressable 
        style={({ pressed }) => [
          styles.cartFloatingBtn, 
          pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }
        ]}
        onPress={onCheckout}
      >
        {/* Left: Bag Icon */}
        <SymbolView name="bag.fill" size={18} tintColor="#ffffff" weight="bold" />

        {/* Center: Title */}
        <View style={styles.cartTextContainer}>
          <Text style={styles.cartText} numberOfLines={1}>
            Ver carrito
            <Text style={styles.cartTextDivider}> • </Text>
            <Animated.Text style={[styles.cartTextCount, { transform: [{ scale: badgeScaleAnim }] }]}>
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </Animated.Text>
          </Text>
        </View>

        {/* Right: Price Pill */}
        <View style={styles.pricePill}>
          <Animated.Text style={[styles.pricePillText, { transform: [{ scale: priceScaleAnim }] }]}>
            {totalPrice} €
          </Animated.Text>
          <SymbolView name="arrow.right" size={11} tintColor={Colors.accent} weight="bold" />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cartFloatingContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 2000,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  cartFloatingBtn: {
    backgroundColor: Colors.accent, // Use accent theme color
    borderRadius: 22, // Border rounded strictly to 22px
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cartTextContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  cartText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14.5,
  },
  cartTextDivider: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontWeight: '500',
  },
  cartTextCount: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    fontSize: 13.5,
  },
  pricePill: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pricePillText: {
    color: Colors.accent,
    fontWeight: '800',
    fontSize: 13.5,
  },
});
