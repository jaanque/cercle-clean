import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image, RefreshControl } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';

import CerclePlus from '@/components/homeScreen/cercle-plus/cercle-plus';
import Header from '@/components/homeScreen/header/header';
import Locales from '@/components/homeScreen/locales/locales';
import Sellos from '@/components/homeScreen/sellos/sellos';
import HomeSkeleton from '@/components/skeletons/homeSkeleton';
import { useHomeData } from '@/hooks/useHomeData';
import { SelectionsBottomSheet } from '@/components/selections-bottom-sheet';
import { Colors } from '@/constants/theme';

// Importación de imágenes locales generadas de alta calidad
const selectionsBannerImg = require('../../assets/images/home/selections_banner.png');

/**
 * HomeScreen - Pantalla principal de inicio.
 * Es un componente visual "escaparate" 100% declarativo y libre de lógica.
 * Consume los datos y el estado dinámico directamente de useHomeData.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { 
    stores, 
    userStamps, 
    categories,
    loading, 
    error,
    refetch,
  } = useHomeData();

  const [selectionsVisible, setSelectionsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Cabecera Estática con Buscador Fijo */}
      <Header />

      {/* Contenedor con Scroll Vertical para Contenido Dinámico */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.accent]}
            tintColor={Colors.accent}
          />
        }
      >
        
        {/* Fila horizontal de píldoras de filtro (no fija, se desplaza con el scroll) */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.chipsContainer}
          style={styles.chipsScrollView}
        >
          {/* Categorías dinámicas de la base de datos */}
          {categories.map((category) => (
            <Pressable 
              key={category.id} 
              style={[
                styles.chip, 
                category.is_ai 
                  ? { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#4F46E5' }
                  : { backgroundColor: category.active_color || '#F5F5F7' }
              ]}
              onPress={() => {
                if (category.is_ai) {
                  router.push('/ai-chat');
                } else {
                  router.push({ pathname: '/explore', params: { q: category.title } } as any);
                }
              }}
            >
              <Text style={[styles.chipText, category.is_ai && { color: '#4F46E5' }]}>
                {category.emoji ? category.emoji + ' ' : ''}{category.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          // Skeleton Loader de pulso premium y ultra realista
          <View style={{ paddingHorizontal: 16 }}>
            <HomeSkeleton />
          </View>
        ) : error ? (
          // Mensaje visual elegante de error de red
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudieron cargar los datos.</Text>
            <Text style={styles.errorSubtext}>Revisa tu conexión a internet e inténtalo de nuevo.</Text>
          </View>
        ) : (
          // Vista principal ordenada con espaciados
          <View style={styles.dynamicContent}>
            
            {/* --- BANNER DESTACADO DELGADO Y ANCHO (Verde) --- */}
            <View style={styles.paddingWrapper}>
              <Pressable 
                style={({ pressed }) => [
                  styles.wideBannerCard,
                  pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] }
                ]}
                onPress={() => setSelectionsVisible(true)}
              >
                <View style={styles.bannerTextCol}>
                  <Text style={styles.selectionsTitle} numberOfLines={2}>
                    Selecciones{"\n"}queridas para ti
                  </Text>
                  <Text style={styles.selectionsSubtitle}>
                    Belleza y tecnología a tu alcance
                  </Text>
                </View>
                
                {/* Imagen del banner a la derecha */}
                <Image 
                  source={selectionsBannerImg} 
                  style={styles.wideBannerImage}
                  resizeMode="cover"
                />
              </Pressable>
            </View>

            {/* Tarjeta de Sellos del Usuario */}
            <View style={styles.paddingWrapper}>
              <Sellos userStamps={userStamps} />
            </View>

            {/* Locales Cerca de Ti (cajas en scroll horizontal) */}
            <Locales stores={stores} loading={false} />

            {/* Banner Informativo CerclePlus */}
            <View style={styles.paddingWrapper}>
              <CerclePlus />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sheet de Selecciones Queridas Para Ti */}
      <SelectionsBottomSheet 
        visible={selectionsVisible} 
        onClose={() => setSelectionsVisible(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0, // Pega el scroll al buscador sin espacio de separación
    paddingBottom: 110, // Espacio inferior amplio para el menú de navegación
  },
  chipsScrollView: {
    marginTop: 0,
    marginBottom: 8,
    paddingVertical: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7', // Gris suave premium
    borderRadius: 22, // Esquinas estrictamente a 22px
    paddingVertical: 7,
    paddingHorizontal: 14,
    gap: 6,
    height: 36,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  
  // Estructura de contenido dinámico
  dynamicContent: {
    width: '100%',
    gap: 20, // Espaciado simétrico entre secciones principales
  },
  paddingWrapper: {
    paddingHorizontal: 16,
  },

  wideBannerCard: {
    width: '100%',
    height: 105, // Delgado
    backgroundColor: Colors.accent, // Verde oliva corporativo
    borderRadius: 22, // Bordes estrictamente a 22px
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 18,
    paddingRight: 0,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerTextCol: {
    flex: 1.2,
    justifyContent: 'center',
    gap: 2,
  },
  selectionsTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  selectionsSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  wideBannerImage: {
    width: 130,
    height: '100%',
    borderRadius: 0,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    backgroundColor: Colors.accent,
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