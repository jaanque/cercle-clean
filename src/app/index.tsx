import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import CerclePlus from '@/components/homeScreen/cercle-plus/cercle-plus';
import Header from '@/components/homeScreen/header/header';
import { Store } from '@/components/homeScreen/locales/locale-card';
import Locales from '@/components/homeScreen/locales/locales';
import { Product } from '@/components/homeScreen/ofertas/oferta-card';
import Ofertas from '@/components/homeScreen/ofertas/ofertas';
import Sellos from '@/components/homeScreen/sellos/sellos';
import { useAuth } from '@/providers/AuthProvider';

export default function HomeScreen() {
  // ==========================================
  // 1. ESTADOS LOCALES (STATE MANAGEMENT)
  // ==========================================
  const [stores, setStores] = useState<Store[]>([]);       // Listado de tiendas (Locales)
  const [ofertas, setOfertas] = useState<Product[]>([]);   // Listado de productos (Ofertas)
  const [loading, setLoading] = useState<boolean>(true);   // Indicador de carga asíncrona

  // Consumimos el contexto de sesión real global
  const { session } = useAuth();

  // ==========================================
  // 2. EFECTOS (NETWORK PETITIONS)
  // ==========================================
  useEffect(() => {
    setLoading(true);
    // Recuperamos la base de la URL y la clave pública protegida desde las variables de entorno
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

    // Enviar el token JWT real del usuario si está logueado, sino usar la Anon Key
    const authorizationToken = session?.access_token || supabaseAnonKey;

    // Petición única optimizada para recuperar todo el contenido dinámico (construida dinámicamente)
    fetch(`${supabaseUrl}/functions/v1/select-stores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorizationToken}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // Asignación de datos recibidos a los estados tipados correspondientes
          setStores(data.stores || []);
          setOfertas(data.products || []);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data from Supabase Edge Function:', error);
        setLoading(false);
      });
  }, [session]); // Reactivo a los cambios de sesión (Login/Logout) para actualizar el pasaporte de acceso de inmediato

  // ==========================================
  // 3. RENDERIZADO DE INTERFAZ (UI RENDER)
  // ==========================================
  return (
    <>
      {/* Cabecera Estática / Barra de Búsqueda y Perfil */}
      <Header />

      {/* Contenedor con Scroll Vertical para Contenido Dinámico */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {loading ? (
          // Spinner de carga con color corporativo
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#5B2333" />
          </View>
        ) : (
          // Vista principal secuencial ordenada con espaciados unificados de 20px
          <>
            {/* Tarjeta de Sellos del Usuario */}
            <Sellos />

            {/* Listado Horizontal de Ofertas/Productos dinámicos */}
            <Ofertas ofertas={ofertas} />

            {/* Banner Informativo CerclePlus */}
            <CerclePlus />

            {/* Listado Vertical de Locales/Tiendas dinámicos */}
            <Locales stores={stores} loading={false} />
          </>
        )}
      </ScrollView>
    </>
  );
}