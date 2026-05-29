import { Store } from '@/components/homeScreen/locales/locale-card';
import { Product } from '@/components/homeScreen/ofertas/oferta-card';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { useEffect, useState } from 'react';

export function useHomeData() {
  const [stores, setStores] = useState<Store[]>([]);
  const [ofertas, setOfertas] = useState<Product[]>([]);
  const [userStamps, setUserStamps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { session } = useAuth();
    const { cartCount, syncCartState } = useCart();

    useEffect(() => {
      let isMounted = true;
      setLoading(true);
      setError(null);

      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
      const authorizationToken = session?.access_token || supabaseAnonKey;

      // Coordenadas actuales (Ajustadas a 41.63, 0.64 para concordar perfectamente con la zona de cobertura real del local a ~4.6 km / 1 hora andando)
      const userLat = 41.63;
      const userLon = 0.64;

      // Pasamos las coordenadas a la Edge Function
      const fetchUrl = `${supabaseUrl}/functions/v1/select-stores?lat=${userLat}&lon=${userLon}`;

      fetch(fetchUrl, {
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
            // El backend ya nos devuelve la lista filtrada y ordenada perfectamente
            setStores(data.stores || []);
            setOfertas(data.products || []);
            setUserStamps(data.user_stamps || []);

            syncCartState(data);
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
    }, [session, syncCartState]);

  return {
    stores,
    ofertas,
    userStamps,
    cartCount,
    loading,
    error,
  };
}