import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { Store } from '@/components/homeScreen/locales/locale-card';
import { Product } from '@/components/homeScreen/ofertas/oferta-card';

/**
 * useStoreDetail - Hook para obtener y gestionar de forma centralizada
 * todos los datos requeridos por la pantalla de detalle de una tienda (StoreDetail).
 * - Filtra la tienda específica y sus productos a partir de los datos consolidados.
 * - Expone de forma limpia y tipada el estado de carga, errores y datos.
 */
export function useStoreDetail(storeId: string) {
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { session } = useAuth();
  const { setCartItems } = useCart();

  useEffect(() => {
    if (!storeId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
    const authorizationToken = session?.access_token || supabaseAnonKey;

    fetch(`${supabaseUrl}/functions/v1/select-stores?storeId=${storeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorizationToken}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de servidor (${response.status}): ${errorText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted && data) {
          // La Edge Function con storeId filtrado ya devuelve la tienda concreta, sus productos y el carrito
          const currentStore = data.stores?.[0] || null;
          setStore(currentStore);
          setProducts(data.products || []);

          // Sincronizar el mapa del carrito si viene en los datos del GET
          if (data && Array.isArray(data.cart_items)) {
            const itemsMap: Record<string, number> = {};
            data.cart_items.forEach((item: any) => {
              if (item.product_id) {
                itemsMap[item.product_id] = item.quantity || 0;
              }
            });
            setCartItems(itemsMap);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Ocurrió un error inesperado al conectar con el servidor.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [storeId, session, setCartItems]);

  return {
    store,
    products,
    loading,
    error,
  };
}
