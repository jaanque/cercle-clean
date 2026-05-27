import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

type CartContextType = {
  cartCount: number;
  cartItems: Record<string, number>;
  setCartItems: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  updateProductQuantity: (productId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CartProvider - Proveedor global reactivo para el carrito de compras.
 * Sincroniza el contador y las cantidades individuales de cada producto en tiempo real
 * entre todas las pantallas de la aplicación (HomeScreen, StoreDetailScreen, etc.).
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const { session } = useAuth();

  // Reiniciar el carrito al cerrar sesión
  useEffect(() => {
    if (!session) {
      setCartItems({});
    }
  }, [session]);

  const updateProductQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
  };

  // Calcular el conteo total dinámicamente sumando las cantidades de todos los artículos
  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, setCartItems, updateProductQuantity }}>
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
