import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
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

  useEffect(() => {
    if (!storeId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
    const authorizationToken = session?.access_token || supabaseAnonKey;

    fetch(`${supabaseUrl}/functions/v1/select-stores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorizationToken}`,
      },
    })
      .then(async (response) => {
        const text = await response.text();
        if (!response.ok) {
          throw new Error(`Error de servidor (${response.status}): ${text}`);
        }
        return JSON.parse(text);
      })
      .then((data) => {
        if (isMounted && data) {
          // Filtrar la tienda seleccionada
          const allStores: Store[] = data.stores || [];
          const currentStore = allStores.find((s) => String(s.id) === String(storeId)) || null;
          setStore(currentStore);

          // Filtrar los productos pertenecientes a esta tienda
          const allProducts: Product[] = data.products || [];
          const storeProducts = allProducts.filter((p) => String(p.store_id) === String(storeId));
          setProducts(storeProducts);
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
  }, [storeId, session]);

  return {
    store,
    products,
    loading,
    error,
  };
}
