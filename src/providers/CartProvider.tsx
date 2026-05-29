import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthProvider';
import { cartSyncSchema, cartDeleteSchema } from '@/lib/schemas/cart';
import { Alert } from 'react-native';
import { z } from 'zod';

// --- ESQUEMAS DE SEGURIDAD ZERO-TRUST PARA VALIDACIÓN DE RESPUESTAS ---
const cartProductResponseSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9-]+$/),
  name: z.string().min(1),
  price: z.coerce.string(),
  original_price: z.coerce.string().optional().nullable(),
  image: z.string().url().optional().nullable().or(z.string().max(0)),
  store_id: z.string().regex(/^[a-zA-Z0-9-]+$/),
  stock: z.number().int().nonnegative(),
  rating: z.coerce.string().optional().nullable(),
  reviews_count: z.coerce.string().optional().nullable()
});

const cartItemDetailsResponseSchema = z.object({
  product_id: z.string().regex(/^[a-zA-Z0-9-]+$/),
  quantity: z.number().int().nonnegative(),
  product: cartProductResponseSchema
});

export const cartEdgeResponseSchema = z.object({
  success: z.boolean().optional(),
  cart_items: z.array(cartItemDetailsResponseSchema).optional().nullable(),
  cart_items_map: z.record(z.string(), z.coerce.number()).optional().nullable(),
  cartItemsMap: z.record(z.string(), z.coerce.number()).optional().nullable(),
  subtotal: z.number().optional().nullable(),
  cart_subtotal: z.number().optional().nullable()
});

type CartContextType = {
  cartCount: number;
  cartItems: Record<string, number>;
  cartItemsDetails: any[];
  cartSubtotal: number;
  loading: boolean;
  setCartItems: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  updateProductQuantity: (productId: string, quantity: number) => Promise<void>;
  syncCartState: (data: any) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Utility parser to normalize different responses from the Edge Function
 */
export const parseCartResponse = (data: any) => {
  // Validación Zero-Trust estricta de la estructura de red entrante
  const validation = cartEdgeResponseSchema.safeParse(data);
  if (!validation.success) {
    console.error("Zero-Trust Response Validation failed:", validation.error.format());
    throw new Error("Datos de red corruptos o sospechosos detectados.");
  }

  const cleanData = validation.data;
  const cartItemsMap: Record<string, number> = {};
  
  // Try camelCase first (from POST/DELETE), then snake_case (from GET)
  const rawMap = cleanData.cartItemsMap || cleanData.cart_items_map;
  if (rawMap && typeof rawMap === 'object') {
    Object.entries(rawMap).forEach(([key, val]) => {
      cartItemsMap[key] = Number(val) || 0;
    });
  } else if (Array.isArray(cleanData.cart_items)) {
    cleanData.cart_items.forEach((item: any) => {
      if (item && item.product_id) {
        cartItemsMap[item.product_id] = item.quantity || 0;
      }
    });
  }

  const cartItemsDetails = Array.isArray(cleanData.cart_items) ? cleanData.cart_items : [];
  const cartSubtotal = typeof cleanData.subtotal === 'number' 
    ? cleanData.subtotal 
    : (typeof cleanData.cart_subtotal === 'number' ? cleanData.cart_subtotal : 0);

  return { cartItemsMap, cartItemsDetails, cartSubtotal };
};

/**
 * CartProvider - Proveedor global reactivo para el carrito de compras.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartItemsDetails, setCartItemsDetails] = useState<any[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { session, user } = useAuth();

  // Cerrojo de Transacciones (Request Concurrency Lock)
  // Evita spam, sobreescrituras por clics repetidos rápidos o condiciones de carrera
  const transactionLockRef = useRef<boolean>(false);

  // Reiniciar el carrito al cerrar sesión
  useEffect(() => {
    if (!session) {
      setCartItems({});
      setCartItemsDetails([]);
      setCartSubtotal(0);
    }
  }, [session]);

  const syncCartState = useCallback((data: any) => {
    try {
      const parsed = parseCartResponse(data);
      setCartItems(parsed.cartItemsMap);
      setCartItemsDetails(parsed.cartItemsDetails);
      setCartSubtotal(parsed.cartSubtotal);
    } catch (err: any) {
      console.error("Cart sync validation blocked:", err.message);
    }
  }, []);

  const updateProductQuantity = useCallback(async (productId: string, quantity: number) => {
    // 1. Defensa de Concurrencia (Cerrojo Transaccional Mutex)
    if (transactionLockRef.current) {
      console.warn("Seguridad: Operación de carrito bloqueada por transacción activa.");
      return;
    }

    // 2. Defensa de Sesión: Autenticación Mandatoria
    if (!user || !session?.access_token || typeof session.access_token !== 'string') {
      Alert.alert(
        'Iniciar Sesión',
        'Debes iniciar sesión para actualizar tu carrito de forma segura.',
        [{ text: 'Aceptar' }]
      );
      return;
    }

    // Activar Cerrojo de Transacción
    transactionLockRef.current = true;
    setLoading(true);

    // 3. Sanitización estricta de Entradas (Búnker)
    const cleanProductId = String(productId).trim().replace(/[^a-zA-Z0-9-]/g, '');
    const cleanQuantity = Math.max(0, Math.min(99, Math.floor(Number(quantity) || 0)));

    if (!cleanProductId) {
      Alert.alert('Error de Seguridad', 'El identificador del producto es inválido.');
      transactionLockRef.current = false;
      setLoading(false);
      return;
    }

    try {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
      if (!supabaseUrl.startsWith('https://') && !supabaseUrl.includes('localhost') && !supabaseUrl.includes('127.0.0.1')) {
        throw new Error('Canal de comunicación inseguro detectado.');
      }
      
      if (cleanQuantity <= 0) {
        // Validación Zod para el DELETE
        const validation = cartDeleteSchema.safeParse({ product_id: cleanProductId });
        if (!validation.success) {
          throw new Error(validation.error.issues.map(i => i.message).join('\n'));
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/select-stores`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(validation.data),
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error || 'Error al eliminar del carrito.');
        }

        const result = await response.json();
        syncCartState(result);
      } else {
        // Validación Zod para el POST (Add/Update)
        const validation = cartSyncSchema.safeParse({ product_id: cleanProductId, quantity: cleanQuantity });
        if (!validation.success) {
          throw new Error(validation.error.issues.map(i => i.message).join('\n'));
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/select-stores`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(validation.data),
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error || 'Error al actualizar el carrito.');
        }

        const result = await response.json();
        syncCartState(result);
      }
    } catch (err: any) {
      console.error("Secure Cart Sync Error:", err);
      let friendlyMessage = 'No se pudo sincronizar el carrito por motivos de seguridad.';
      if (err.message && !err.message.includes('db') && !err.message.includes('postgres') && !err.message.includes('row') && !err.message.includes('null')) {
        friendlyMessage = err.message;
      }
      Alert.alert('Error', friendlyMessage);
    } finally {
      // Liberar Cerrojo Transaccional
      transactionLockRef.current = false;
      setLoading(false);
    }
  }, [session, user, syncCartState]);

  // Calcular el conteo total dinámicamente sumando las cantidades de todos los artículos
  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  return (
    <CartContext.Provider value={{
      cartCount,
      cartItems,
      cartItemsDetails,
      cartSubtotal,
      loading,
      setCartItems,
      updateProductQuantity,
      syncCartState
    }}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart - Hook personalizado para interactuar de forma segura con el estado global del carrito.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser utilizado exclusivamente dentro de un CartProvider.');
  }
  return context;
};

