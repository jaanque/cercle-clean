import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import CerclePlus from '@/components/homeScreen/cercle-plus/cercle-plus';
import Header from '@/components/homeScreen/header/header';
import Locales from '@/components/homeScreen/locales/locales';
import Ofertas from '@/components/homeScreen/ofertas/ofertas';
import Sellos from '@/components/homeScreen/sellos/sellos';
import { useHomeData } from '@/hooks/useHomeData';

/**
 * HomeScreen - Pantalla principal de inicio.
 * Es un componente visual "declarativo" y limpio.
 * Delega la lógica de red y estado de datos al hook personalizado useHomeData.
 */
export default function HomeScreen() {
  const { stores, ofertas, userStamps, loading, error } = useHomeData();

  return (
    <>
      {/* Cabecera Estática / Barra de Búsqueda y Perfil */}
      <Header />

      {/* Contenedor con Scroll Vertical para Contenido Dinámico */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          // Spinner de carga con color corporativo
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color="#5B2333" />
          </View>
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

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  centeredContainer: {
    marginTop: 40,
    alignItems: 'center',
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