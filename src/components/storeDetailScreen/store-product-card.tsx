import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, Pressable, Alert, Animated } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { cartSyncSchema, cartDeleteSchema } from '@/lib/schemas/cart';
import { Product } from '../homeScreen/ofertas/oferta-card';

interface StoreProductCardProps {
  product: Product;
  mode?: 'horizontal' | 'vertical';
  onProductAdded?: () => void;
  onProductRemoved?: (quantity: number) => void;
}

const calculateSavings = (originalPriceStr?: string, priceStr?: string): string | null => {
  if (!originalPriceStr || !priceStr) return null;
  const orig = parseFloat(originalPriceStr.replace(/,/g, '.').replace(/[^0-9.]/g, '')) || 0;
  const price = parseFloat(priceStr.replace(/,/g, '.').replace(/[^0-9.]/g, '')) || 0;
  const savings = orig - price;
  if (savings <= 0) return null;
  return `${savings.toFixed(2).replace('.', ',')} €`;
};

/**
 * StoreProductCard - Tarjeta premium de producto adaptada a la vista de detalle de la tienda.
 * Soporta dos modos visuales muy pulidos:
 * - 'horizontal': Para el listado de "Most popular" (carrusel horizontal).
 * - 'vertical': Para el catálogo de categorías (listado vertical completo).
 * Cuenta con selector de cantidad integrado, transiciones animadas y validación pre-vuelo mediante Zod.
 */
export default function StoreProductCard({
  product,
  mode = 'horizontal',
  onProductAdded,
  onProductRemoved,
}: StoreProductCardProps) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const savingsText = calculateSavings(product.original_price, product.price);

  // Animación de escala y números reactivos
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const prevQuantity = useRef(0);

  useEffect(() => {
    if (quantity === 0) {
      prevQuantity.current = 0;
      return;
    }
    const isIncrement = quantity > prevQuantity.current;
    prevQuantity.current = quantity;

    translateY.setValue(isIncrement ? 8 : -8);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [quantity]);

  // Upsert a la Edge Function
  const syncCartQuantity = async (targetQty: number) => {
    const validation = cartSyncSchema.safeParse({
      product_id: product.id,
      quantity: targetQty,
    });

    if (!validation.success) {
      const errorMsg = validation.error.issues.map((i) => i.message).join('\n');
      throw new Error(errorMsg);
    }

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const response = await fetch(`${supabaseUrl}/functions/v1/select-stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(validation.data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Error al actualizar el carrito');
    }

    if (onProductAdded) onProductAdded();
  };

  // DELETE a la Edge Function
  const deleteFromCartAPI = async () => {
    const validation = cartDeleteSchema.safeParse({
      product_id: product.id,
    });

    if (!validation.success) {
      const errorMsg = validation.error.issues.map((i) => i.message).join('\n');
      throw new Error(errorMsg);
    }

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const response = await fetch(`${supabaseUrl}/functions/v1/select-stores`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(validation.data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Error al eliminar del carrito');
    }

    if (onProductRemoved) onProductRemoved(quantity);
  };

  const handleAddOne = async () => {
    if (!session) {
      Alert.alert('Acceso Requerido', 'Inicia sesión para añadir productos a tu carrito.');
      return;
    }
    setLoading(true);
    try {
      await syncCartQuantity(1);
      setQuantity(1);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async () => {
    const newQty = quantity + 1;
    if (newQty > product.stock) {
      Alert.alert('Stock Límite', `Solo quedan ${product.stock} unidades en tienda.`);
      return;
    }
    setLoading(true);
    try {
      await syncCartQuantity(newQty);
      setQuantity(newQty);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    const newQty = quantity - 1;
    setLoading(true);
    try {
      if (newQty === 0) {
        await deleteFromCartAPI();
        setQuantity(0);
      } else {
        await syncCartQuantity(newQty);
        setQuantity(newQty);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'horizontal') {
    return (
      <View style={styles.hCard}>
        {/* Contenedor de la Imagen con Botón de Añadir Flotante */}
        <View style={styles.hImageContainer}>
          <Image source={{ uri: product.image }} style={styles.hImage} />

          {/* Selector de cantidad / Botón Plus flotante (esquina inferior derecha de la imagen) */}
          <View style={styles.floatingAction}>
            {quantity > 0 ? (
              <View style={styles.compactSelector}>
                <Pressable style={styles.compactBtn} onPress={handleDecrement} disabled={loading}>
                  <Text style={styles.compactBtnText}>-</Text>
                </Pressable>
                <Animated.View style={{ transform: [{ translateY }], opacity }}>
                  <Text style={styles.compactQtyText}>{quantity}</Text>
                </Animated.View>
                <Pressable style={styles.compactBtn} onPress={handleIncrement} disabled={loading || quantity >= product.stock}>
                  <Text style={styles.compactBtnText}>+</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.addButton} onPress={handleAddOne} disabled={loading}>
                <Text style={styles.addButtonText}>Añadir +</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Detalles en la parte inferior */}
        <View style={styles.hDetails}>
          <View style={styles.hPriceRow}>
            <Text style={styles.hPrice}>{product.price}</Text>
            {product.original_price && (
              <Text style={styles.hOriginalPrice}>{product.original_price}</Text>
            )}
            {savingsText && (
              <View style={styles.hSavingsBadge}>
                <Text style={styles.hSavingsText}>-{savingsText}</Text>
              </View>
            )}
          </View>
          <Text style={styles.hTitle} numberOfLines={2}>{product.name}</Text>
        </View>
      </View>
    );
  }

  // MODO: vertical (Fila integrada con imagen a la derecha y detalles a la izquierda)
  return (
    <View style={styles.vCard}>
      {/* Información del producto (Lado izquierdo) */}
      <View style={styles.vInfoCol}>
        <Text style={styles.vTitle}>{product.name}</Text>
        <Text style={styles.vDescription} numberOfLines={2}>
          Receta clásica con carne de primera, verduras frescas y salsa secreta de la casa.
        </Text>
        <View style={styles.vPriceRow}>
          <Text style={styles.vPrice}>{product.price}</Text>
          {product.original_price && (
            <Text style={styles.vOriginalPrice}>{product.original_price}</Text>
          )}
          {savingsText && (
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>Ahorras {savingsText}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Imagen y Acción (Lado derecho, apilados limpiamente sin superponer) */}
      <View style={styles.vRightCol}>
        <Image source={{ uri: product.image }} style={styles.vImage} />

        <View style={styles.vActionContainer}>
          {quantity > 0 ? (
            <View style={styles.vSelector}>
              <Pressable style={styles.compactBtn} onPress={handleDecrement} disabled={loading}>
                <Text style={styles.compactBtnText}>-</Text>
              </Pressable>
              <Animated.View style={{ transform: [{ translateY }], opacity }}>
                <Text style={styles.compactQtyText}>{quantity}</Text>
              </Animated.View>
              <Pressable style={styles.compactBtn} onPress={handleIncrement} disabled={loading || quantity >= product.stock}>
                <Text style={styles.compactBtnText}>+</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.addButton} onPress={handleAddOne} disabled={loading}>
              <Text style={styles.addButtonText}>Añadir +</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- ESTILOS HORIZONTALES (CARRUSEL) ---
  hCard: {
    width: 140,
    marginRight: 14,
  },
  hImageContainer: {
    width: '100%',
    height: 110,
    borderRadius: 22,
    overflow: 'visible', // Necesario para dejar que el botón plus flote fuera levemente si es preciso
    position: 'relative',
    backgroundColor: '#F7F7F7',
  },
  hImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    resizeMode: 'cover',
  },
  hPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hOriginalPrice: {
    fontSize: 12,
    color: '#888888',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  floatingAction: {
    position: 'absolute',
    bottom: -10,
    right: -2,
    zIndex: 10,
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
    width: 96, // Ajustado a 96px para alinearse perfectamente con la imagen
    height: 38,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  compactSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    height: 32,
    paddingHorizontal: 4,
    gap: 8,
  },
  compactBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
  },
  compactQtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 12,
    textAlign: 'center',
  },
  hDetails: {
    marginTop: 16,
    paddingHorizontal: 2,
    gap: 2,
  },
  hPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  hTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
    lineHeight: 16,
  },

  // --- ESTILOS VERTICALES (FILA) ---
  vCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#F3F3F3',
  },
  vInfoCol: {
    flex: 1,
    paddingRight: 16,
    gap: 6,
  },
  vPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vOriginalPrice: {
    fontSize: 13,
    color: '#888888',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  vTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  vDescription: {
    fontSize: 13,
    color: '#777777',
    lineHeight: 18,
  },
  vPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  vRightCol: {
    alignItems: 'center',
    gap: 8,
    width: 96,
  },
  vImage: {
    width: 96,
    height: 96,
    borderRadius: 22,
    resizeMode: 'cover',
  },
  vActionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  vSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    height: 38,
    width: 96,
    paddingHorizontal: 6,
  },
  savingsBadge: {
    backgroundColor: Colors.accent, // Solid brand accent burgundy background
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingsText: {
    color: '#ffffff', // White text
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.1,
  },
  hSavingsBadge: {
    backgroundColor: Colors.accent,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hSavingsText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
