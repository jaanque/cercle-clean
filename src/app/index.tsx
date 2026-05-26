import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import CerclePlus from '@/components/cercle-plus/cercle-plus';
import Header from '@/components/header/header';
import { Store } from '@/components/locales/locale-card';
import Locales from '@/components/locales/locales';
import { Product } from '@/components/ofertas/oferta-card';
import Ofertas from '@/components/ofertas/ofertas';
import Sellos from '@/components/sellos/sellos';

export default function HomeScreen() {
  // ==========================================
  // 1. ESTADOS LOCALES (STATE MANAGEMENT)
  // ==========================================
  const [stores, setStores] = useState<Store[]>([]);       // Listado de tiendas (Locales)
  const [ofertas, setOfertas] = useState<Product[]>([]);   // Listado de productos (Ofertas)
  const [loading, setLoading] = useState<boolean>(true);   // Indicador de carga asíncrona

  // ==========================================
  // 2. EFECTOS (NETWORK PETITIONS)
  // ==========================================
  useEffect(() => {
    // Recuperamos la clave pública protegida desde el entorno local seguro
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

    // Petición única optimizada para recuperar todo el contenido dinámico
    fetch('https://icjheiuqbgaozzmgdmpg.supabase.co/functions/v1/select-stores', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
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
  }, []);

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