import { Store } from '@/components/homeScreen/locales/locale-card';
import { Product } from '@/components/homeScreen/ofertas/oferta-card';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { supabaseAuth } from '@/lib/supabase/supabase';

export function useHomeData() {
  const [stores, setStores] = useState<Store[]>([]);
  const [ofertas, setOfertas] = useState<Product[]>([]);
  const [userStamps, setUserStamps] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { session } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
    const authorizationToken = session?.access_token || supabaseAnonKey;

    // Coordenadas actuales (Ajustadas a 41.63, 0.64 para concordar perfectamente con la zona de cobertura real del local a ~4.6 km / 1 hora andando)
    const userLat = 41.63;
    const userLon = 0.64;

    // Pasamos las coordenadas y el límite a la Edge Function
    const fetchUrl = `${supabaseUrl}/functions/v1/select-stores?lat=${userLat}&lon=${userLon}&limit=10`;

    try {
      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authorizationToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error de servidor (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('--- FETCHED HOME DATA ---', data);
      if (data) {
        // El backend ya nos devuelve la lista filtrada y ordenada perfectamente
        setStores(data.stores || []);
        setOfertas(data.products || []);
        setUserStamps(data.user_stamps || []);
        setCategories(data.categories || []);
        setRecentSearches(data.recent_searches || []);
      }

      // Consulta de banners activos desde Supabase
      const { data: bannersData, error: bannersError } = await supabaseAuth
        .from('banners')
        .select('*')
        .eq('is_active', true);

      if (bannersError) {
        console.error('Error fetching banners:', bannersError);
      } else {
        setBanners(bannersData || []);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  return {
    stores,
    ofertas,
    userStamps,
    categories,
    recentSearches,
    banners,
    loading,
    error,
    refetch: fetchData,
  };
}