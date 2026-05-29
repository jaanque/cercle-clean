import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable, Animated, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

interface CartItemRowProps {
  product: any;
  quantity: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  parsePrice: (priceStr: string | undefined | null) => number;
}

/**
 * CartItemRow - Celda individual de producto en el carrito.
 * - Integra de forma independiente el efecto deslizante/opacidad animada al alterar cantidades (como en la Home).
 */
export default function CartItemRow({ product, quantity, onUpdateQuantity, parsePrice }: CartItemRowProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const prevQuantity = useRef(quantity);

  useEffect(() => {
    if (quantity === prevQuantity.current) return;

    const isIncrement = quantity > prevQuantity.current;
    prevQuantity.current = quantity;

    // Resetear posición inicial fuera de foco
    translateY.setValue(isIncrement ? 10 : -10);
    opacity.setValue(0);

    // Animación fluida de deslizamiento y aparición gradual idéntica a la Home
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [quantity]);

  const itemTotal = (parsePrice(product.price) * quantity).toFixed(2);
  const productImageUri = product.image || '';

  return (
    <View style={styles.cartProductCard}>
      <Image 
        source={productImageUri ? { uri: productImageUri } : undefined} 
        style={styles.cartProductImage} 
      />
      
      <View style={styles.cartProductDetails}>
        <View style={styles.cartProductTitleRow}>
          <Text style={styles.cartProductTitle} numberOfLines={2}>
            {product.name || ''}
          </Text>
          <Text style={styles.cartProductPrice}>{itemTotal} €</Text>
        </View>
        
        <Text style={styles.cartProductSubtitle}>
          Precio unitario: {product.price || ''}
        </Text>

        {/* Fila de Acciones: Cantidad & Eliminar */}
        <View style={styles.cartProductActionsRow}>
          {/* Botón Papelera Premium idéntico al de OfertaCard a la izquierda */}
          <Pressable 
            style={styles.trashIconContainer} 
            onPress={() => onUpdateQuantity(product.id, 0)}
          >
            <SymbolView
              name={{ ios: 'trash.fill', android: 'delete', web: 'delete' }}
              size={16}
              tintColor="#999999"
            />
          </Pressable>

          {/* Selector de cantidad reactivo y animado idéntico a la Home */}
          <View style={styles.quantitySelector}>
            <Pressable 
              style={styles.selectorButton}
              onPress={() => onUpdateQuantity(product.id, quantity - 1)}
            >
              <Text style={styles.selectorButtonText}>-</Text>
            </Pressable>
            
            <Animated.View style={{ transform: [{ translateY }], opacity }}>
              <Text style={styles.quantityText}>{quantity}</Text>
            </Animated.View>
            
            <Pressable 
              style={styles.selectorButton}
              onPress={() => onUpdateQuantity(product.id, quantity + 1)}
            >
              <Text style={styles.selectorButtonText}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartProductCard: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: Colors.background1,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 22, // Redondeado corporativo a 22px
    padding: 16,
    marginBottom: 20,
  },
  cartProductImage: {
    width: 80,
    height: 80,
    borderRadius: 22, // Redondeado corporativo a 22px
    backgroundColor: Colors.background2,
  },
  cartProductDetails: {
    flex: 1,
  },
  cartProductTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cartProductTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    lineHeight: 18,
  },
  cartProductPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  cartProductSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  cartProductActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background2, // Gris oficial de la app #F7F7F7
    borderRadius: 22, // Redondeado corporativo a 22px
    borderWidth: 1,
    borderColor: '#EAEAEA',
    height: 38,
    paddingHorizontal: 6,
    gap: 12,
  },
  selectorButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  selectorButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 16,
    textAlign: 'center',
  },
  trashIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background2, // Gris oficial de la app #F7F7F7
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
});
