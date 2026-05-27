import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import CerclePlus from '@/components/homeScreen/cercle-plus/cercle-plus';
import Header from '@/components/homeScreen/header/header';
import Locales from '@/components/homeScreen/locales/locales';
import Ofertas from '@/components/homeScreen/ofertas/ofertas';
import Sellos from '@/components/homeScreen/sellos/sellos';
import FloatingCart from '@/components/homeScreen/cart/floating-cart';
import HomeSkeleton from '@/components/skeletons/homeSkeleton';
import { useHomeData } from '@/hooks/useHomeData';

/**
 * HomeScreen - Pantalla principal de inicio.
 * Es un componente visual "escaparate" 100% declarativo y libre de lógica.
 * Consume los datos y el estado dinámico directamente de useHomeData.
 */
export default function HomeScreen() {
  const { 
    stores, 
    ofertas, 
    userStamps, 
    cartCount, 
    loading, 
    error,
  } = useHomeData();

  return (
    <>
      {/* Cabecera Estática / Barra de Búsqueda y Perfil */}
      <Header />

      {/* Contenedor con Scroll Vertical para Contenido Dinámico */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          // Skeleton Loader de pulso premium y ultra realista
          <HomeSkeleton />
        ) : error ? (
          // Mensaje visual elegante de error de red
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudieron cargar los datos.</Text>
            <Text style={styles.errorSubtext}>Revisa tu conexión a internet e inténtalo de nuevo.</Text>
          </View>
        ) : (
          // Vista principal secuencial ordenada con espaciados unificados de 20px
          <>
            {/* Tarjeta de Sellos del Usuario (alimentada dinámicamente) */}
            <Sellos userStamps={userStamps} />

            {/* Listado Horizontal de Ofertas/Productos dinámicos */}
            <Ofertas 
              ofertas={ofertas} 
            />

            {/* Banner Informativo CerclePlus */}
            <CerclePlus />

            {/* Listado Vertical de Locales/Tiendas dinámicos */}
            <Locales stores={stores} loading={false} />
          </>
        )}
      </ScrollView>

      {/* Carrito Flotante Premium (se dibuja automáticamente al tener elementos) */}
      <FloatingCart count={cartCount} />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 96, // Espacio extra inferior para evitar solapar el carrito flotante
  },
  errorContainer: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});