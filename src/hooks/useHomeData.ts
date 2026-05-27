import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { Store } from '@/components/homeScreen/locales/locale-card';
import { Product } from '@/components/homeScreen/ofertas/oferta-card';

/**
 * useHomeData - Hook personalizado para obtener y gestionar de forma centralizada
 * todos los datos requeridos por la HomeScreen de CercleApp.
 * - Encapsula el fetch a Supabase Edge Function.
 * - Maneja estados de carga, error y mounted flag para prevenir race conditions.
 * - Centraliza el estado y contador de artículos del carrito (liberando a la UI de lógica).
 * - Sincroniza la información reactivamente cuando la sesión del usuario cambia.
 */
export function useHomeData() {
  const [stores, setStores] = useState<Store[]>([]);
  const [ofertas, setOfertas] = useState<Product[]>([]);
  const [userStamps, setUserStamps] = useState<any[]>([]); // Sellos del usuario
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Consumimos el estado de autenticación real global y del carrito global
  const { session } = useAuth();
  const { cartCount, setCartItems } = useCart();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Recuperamos la base de la URL y la clave pública protegida desde las variables de entorno
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

    // Enviar el token JWT real del usuario si está logueado, sino usar la Anon Key
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
          setStores(data.stores || []);
          setOfertas(data.products || []);
          setUserStamps(data.user_stamps || []);
          
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
  }, [session, setCartItems]); // Reactivo a la sesión (Login/Logout)

  return { 
    stores, 
    ofertas, 
    userStamps, 
    cartCount, 
    loading, 
    error,
  };
}
