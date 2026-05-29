import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, Pressable, Alert, Animated } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';


export interface Product {
  id: string;
  name: string;
  price: string;
  original_price: string;
  image: string;
  rating: string;
  reviews_count: string;
  store_id: string;
  stock: number;
}

interface OfertaCardProps {
  oferta: Product;
  onProductAdded?: () => void;
  onProductRemoved?: (quantity: number) => void;
  fullWidth?: boolean;
}

// Helper to compute savings amount from price strings (e.g. "120 €" - "45 €" = 75)
const getSavingAmount = (originalPriceStr: string, priceStr: string): number => {
  const orig = parseFloat(originalPriceStr.replace(/[^0-9.]/g, '')) || 0;
  const curr = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  return Math.max(0, Math.round(orig - curr));
};

const formatReviewsCount = (reviewsCount: string | undefined | null) => {
  if (!reviewsCount) return '';
  const numbersOnly = reviewsCount.replace(/[^0-9.,]/g, '');
  return `(${numbersOnly})`;
};

export default function OfertaCard({ oferta, onProductAdded, onProductRemoved, fullWidth = false }: OfertaCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Consumimos el estado del carrito global sincronizado por producto
  const { cartItems, updateProductQuantity } = useCart();
  const quantity = cartItems[oferta.id] || 0;

  // Valores de animación para la transición del número de cantidad
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const prevQuantity = useRef(0);

  const savingAmount = getSavingAmount(oferta.original_price, oferta.price);

  // Efecto para disparar la animación de subida/bajada cuando cambia la cantidad
  useEffect(() => {
    if (quantity === 0) {
      prevQuantity.current = 0;
      return;
    }

    // Determinar la dirección de la transición (subir o bajar)
    const isIncrement = quantity > prevQuantity.current;
    prevQuantity.current = quantity;

    // Resetear posición inicial fuera de foco
    translateY.setValue(isIncrement ? 10 : -10);
    opacity.setValue(0);

    // Animación fluida de deslizamiento y aparición gradual
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

  const handleInitialAdd = async () => {
    if (!user) {
      Alert.alert(
        'Iniciar Sesión',
        'Debes iniciar sesión para añadir productos a tu carrito.',
        [
          { text: 'Iniciar Sesión', onPress: () => router.push('/login') },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }

    setLoading(true);
    try {
      await updateProductQuantity(oferta.id, 1);
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo añadir el producto al carrito.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async () => {
    const newQty = quantity + 1;
    if (newQty > oferta.stock) {
      Alert.alert('Límite de stock', `Lo sentimos, solo hay ${oferta.stock} unidades disponibles.`);
      return;
    }

    setLoading(true);
    try {
      await updateProductQuantity(oferta.id, newQty);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo actualizar el carrito.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    const newQty = quantity - 1;

    setLoading(true);
    try {
      await updateProductQuantity(oferta.id, newQty);
      if (newQty === 0 && onProductRemoved) {
        onProductRemoved(quantity);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo actualizar el carrito.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePress = async () => {
    setLoading(true);
    try {
      await updateProductQuantity(oferta.id, 0);
      if (onProductRemoved) {
        onProductRemoved(quantity);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'No se pudo eliminar el producto del carrito.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable style={[styles.card, fullWidth && styles.fullWidthCard]}>
      {/* Image Area with Badges */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: oferta.image }} style={styles.image} />
        
        {/* Top-Left Savings Badge */}
        {savingAmount > 0 && (
          <View style={styles.savingBadge}>
            <Text style={styles.savingText}>Ahorras {savingAmount}€</Text>
          </View>
        )}

        {/* Bottom-Right Rating Badge */}
        <View style={styles.ratingBadge}>
          <SymbolView
            name={{ ios: 'star.fill', android: 'star', web: 'star' }}
            size={12}
            tintColor="#F5A623"
          />
          <Text style={styles.ratingText}>
            {oferta.rating} <Text style={styles.ratingCount}>{formatReviewsCount(oferta.reviews_count)}</Text>
          </Text>
        </View>
      </View>

      {/* Details Row */}
      <View style={styles.detailsRow}>
        {/* Left Column (Info & Price) */}
        <View style={styles.infoCol}>
          <Text style={styles.title} numberOfLines={1}>
            {oferta.name}
          </Text>
          <Text style={styles.storeName}>Fashion Hub</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>{oferta.price}</Text>
            <Text style={styles.originalPrice}>{oferta.original_price}</Text>
          </View>
        </View>

        {/* Right Column (Añadir o Selector de cantidad) */}
        <View style={styles.actionContainer}>
          {quantity > 0 ? (
            // Selector de cantidad con Papelera al lado. Mantiene estructura visual y solo aplica opacidad en carga.
            <View style={[styles.quantityContainerRow, loading && { opacity: 0.65 }]}>
              {/* Icono de papelera premium (ahora funcional y conectada al DELETE de la Edge) */}
              <Pressable 
                style={styles.trashIconContainer} 
                onPress={handleDeletePress}
                disabled={loading}
              >
                <SymbolView
                  name={{ ios: 'trash.fill', android: 'delete', web: 'delete' }}
                  size={16}
                  tintColor="#999999"
                />
              </Pressable>

              {/* Selector de cantidad reactivo */}
              <View style={styles.quantitySelector}>
                <Pressable 
                  style={[styles.selectorButton, loading && styles.disabledButton]} 
                  onPress={handleDecrement}
                  disabled={loading}
                >
                  <Text style={styles.selectorButtonText}>-</Text>
                </Pressable>
                
                {/* Número animado para efecto subir/bajar */}
                <Animated.View style={{ transform: [{ translateY }], opacity }}>
                  <Text style={styles.quantityText}>{quantity}</Text>
                </Animated.View>
                
                <Pressable 
                  style={[
                    styles.selectorButton, 
                    (quantity >= oferta.stock || loading) && styles.disabledButton
                  ]} 
                  onPress={handleIncrement}
                  disabled={quantity >= oferta.stock || loading}
                >
                  <Text style={styles.selectorButtonText}>+</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            // Botón inicial de Añadir. Conserva estructura fija y atenúa opacidad durante carga.
            <Pressable 
              style={[styles.addButton, loading && { opacity: 0.65 }]} 
              onPress={handleInitialAdd}
              disabled={loading}
            >
              <Text style={styles.addButtonText}>Añadir +</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 270,
    marginRight: 16,
  },
  fullWidthCard: {
    width: '100%',
    marginRight: 0,
    marginBottom: 20, // Aireado simétrico de 20px idéntico a las secciones
  },
  imageContainer: {
    width: '100%',
    height: 155,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  savingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(30, 20, 24, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  savingText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
  },
  ratingCount: {
    color: '#888888',
    fontWeight: '400',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  infoCol: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  storeName: {
    fontSize: 13,
    color: '#888888',
    marginTop: 2,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  originalPrice: {
    fontSize: 14,
    color: '#888888',
    textDecorationLine: 'line-through',
  },
  actionContainer: {
    minWidth: 96,
    height: 38,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  addButton: {
    backgroundColor: Colors.background2,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    height: 38,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  quantityContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trashIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background2,
    borderRadius: 22,
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
  disabledButton: {
    opacity: 0.4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 16,
    textAlign: 'center',
  },
});
