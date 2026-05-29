import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { Store } from '@/components/homeScreen/locales/locale-card';
import { Product } from '@/components/homeScreen/ofertas/oferta-card';

// Esquemas estrictos de validación en tiempo de ejecución (Zero Trust Network response validation)
const storeSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.string(),
  reviews_count: z.string(),
  delivery_time: z.string(),
  image: z.string(),
  logo: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  distance: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  original_price: z.string(),
  image: z.string(),
  rating: z.string(),
  reviews_count: z.string(),
  store_id: z.string(),
  stock: z.number(),
});

const selectStoresResponseSchema = z.object({
  stores: z.array(storeSchema).optional().nullable(),
  products: z.array(productSchema).optional().nullable(),
  cart_items: z.array(z.object({
    product_id: z.string(),
    quantity: z.number(),
  })).optional().nullable(),
});

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
  const { syncCartState } = useCart();

  useEffect(() => {
    // Sanitización rigurosa de storeId para prevenir inyecciones en la URL de consulta
    const safeStoreId = storeId.replace(/[^a-zA-Z0-9-]/g, '');
    if (!safeStoreId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
    const authorizationToken = session?.access_token || supabaseAnonKey;

    fetch(`${supabaseUrl}/functions/v1/select-stores?storeId=${safeStoreId}`, {
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
      .then((rawData) => {
        if (!isMounted) return;

        // Validación estricta con Zod de los datos de entrada de la API
        const validation = selectStoresResponseSchema.safeParse(rawData);
        if (!validation.success) {
          console.error("Zero-Trust Response Validation failed:", validation.error.format());
          throw new Error("Los datos recibidos del servidor no son válidos.");
        }

        const data = validation.data;
        
        // La Edge Function con storeId filtrado ya devuelve la tienda concreta, sus productos y el carrito
        const currentStore = (data.stores?.[0] || null) as Store | null;
        setStore(currentStore);
        setProducts((data.products || []) as Product[]);

        // Sincronizar el estado del carrito de forma centralizada
        syncCartState(rawData);
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
  }, [storeId, session, syncCartState]);

  return {
    store,
    products,
    loading,
    error,
  };
}
