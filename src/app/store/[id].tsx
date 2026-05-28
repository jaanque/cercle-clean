import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Platform, Pressable, TextInput, Linking, Alert, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import { useStoreDetail } from '@/hooks/useStoreDetail';
import { useCart } from '@/providers/CartProvider';
import StoreHeader from '@/components/storeDetailScreen/store-header';
import OfertaCard from '@/components/homeScreen/ofertas/oferta-card';
import FloatingCart from '@/components/homeScreen/cart/floating-cart';
import StoreDetailSkeleton from '@/components/skeletons/storeDetailSkeleton';
import CerclePlusCard from '@/components/homeScreen/cercle-plus/cercle-plus-card';
import { getStoreDistance } from '@/components/homeScreen/locales/locale-card';

const formatReviewsCount = (reviewsCount: string | undefined | null) => {
  if (!reviewsCount) return '(2.000)';
  const numbersOnly = reviewsCount.replace(/[^0-9.,]/g, '');
  return `(${numbersOnly})`;
};

/**
 * StoreDetailScreen - Pantalla inmersiva y de alta fidelidad para el detalle de locales.
 * - Recupera el ID de la tienda dinámicamente mediante useLocalSearchParams.
 * - Consume los datos de la tienda y sus productos del hook personalizado useStoreDetail.
 * - Renderiza de forma estándar y robusta con scroll nativo (sin animaciones complejas de imagen).
 */
export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { store, products, loading, error } = useStoreDetail(id || '');

  const handleOpenMaps = async () => {
    if (!store) return;
    try {
      const { latitude, longitude, name, location } = store;
      let url = '';
      
      if (latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null) {
        const latLng = `${latitude},${longitude}`;
        const label = encodeURIComponent(name || 'Tienda');
        url = Platform.select({
          ios: `maps://0,0?q=${label}@${latLng}`,
          android: `geo:0,0?q=${latLng}(${label})`,
          web: `https://www.google.com/maps/search/?api=1&query=${latLng}`
        }) || '';
      } else if (location) {
        const query = encodeURIComponent(location);
        url = Platform.select({
          ios: `maps://0,0?q=${query}`,
          android: `geo:0,0?q=${query}`,
          web: `https://www.google.com/maps/search/?api=1&query=${query}`
        }) || '';
      }

      if (url) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Plataforma no soportada', 'No se pudo abrir la aplicación de mapas en este dispositivo.');
        }
      }
    } catch (err) {
      console.error("Error launching maps:", err);
      Alert.alert('Error', 'Ocurrió un problema inesperado al intentar abrir el mapa.');
    }
  };

  // Consumimos el carrito global sincronizado
  const { cartCount } = useCart();
  // Estado para controlar la visibilidad de la barra de navegación pegajosa en scroll
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  // Estado para la búsqueda de productos
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (text: string) => {
    // Sanitización en caliente nivel Bestia contra XSS e inyección en el buscador
    const sanitized = text.replace(/['"`;\\<>]/g, '');
    setSearchQuery(sanitized);
  };

  const handleScroll = (event: any) => {
    const offsetY = event?.nativeEvent?.contentOffset?.y || 0;
    // Activamos la cabecera fija compacta cuando el scroll Y supera la altura del título en la cabecera original
    if (offsetY > 130) {
      if (!showStickyHeader) setShowStickyHeader(true);
    } else {
      if (showStickyHeader) setShowStickyHeader(false);
    }
  };

  if (loading) {
    return <StoreDetailSkeleton />;
  }

  if (error || !store) {
    // Logueamos el error internamente de forma segura para desarrollo
    if (error) console.error("StoreDetail load error:", error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del local.</Text>
        <Text style={styles.errorSubtext}>El local seleccionado no está disponible en este momento.</Text>
      </View>
    );
  }

  // Filtrado dinámico de productos basado en la búsqueda (Búnker antierrores de renderizado)
  const filteredProducts = products.filter((product) => {
    if (!product || typeof product.name !== 'string') return false;
    return product.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Pressable style={styles.screenContainer} onPress={Keyboard.dismiss} accessible={false}>
      {/* Barra de Navegación Pegajosa (Sticky Header on Scroll) */}
      {showStickyHeader && (
        <View style={styles.stickyHeader}>
          <Pressable 
            style={({ pressed }) => [styles.stickyBackButton, pressed && { opacity: 0.6 }]} 
            onPress={() => router.back()}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor="#333333"
              weight="bold"
            />
          </Pressable>
          <Text style={styles.stickyTitle} numberOfLines={1}>
            {store.name}
          </Text>
          <View style={styles.stickyRightSpacer} />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabecera Estática Estándar y Segura de Store */}
        <StoreHeader name={store.name} image={store.image} logo={store.logo} />

        {/* Información central de la Tienda (según la referencia visual) */}
        <View style={styles.storeInfoContainer}>
          <Text style={styles.storeTitleName}>{store.name}</Text>
          
          <View style={styles.statsRow}>
            <SymbolView
              name={{ ios: 'star.fill', android: 'star', web: 'star' }}
              size={13}
              tintColor="#F5A623"
            />
            <Text style={styles.statsText}>
              {store.rating} {formatReviewsCount(store.reviews_count)} • {getStoreDistance(store)} • Listo en {store.delivery_time || '10-15 min'}
            </Text>
          </View>
          
          <Pressable 
            style={({ pressed }) => [styles.locationRow, pressed && { opacity: 0.6 }]} 
            onPress={handleOpenMaps}
          >
            <SymbolView
              name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
              size={13}
              tintColor="#333333"
            />
            <Text style={styles.locationText}>Ver ubicación</Text>
          </Pressable>
        </View>

        {/* Banner Promocional Cercle+ Reutilizado */}
        <View style={styles.cerclePlusWrapper}>
          <CerclePlusCard compact={true} />
        </View>

        {/* Buscador interactivo que sustituye a "Entrantes" */}
        <View style={styles.searchContainer}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={18}
            tintColor="#9EA8B6"
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Buscar productos..."
            placeholderTextColor="#9EA8B6"
            style={styles.searchInput}
            clearButtonMode="while-editing"
            autoCorrect={false}
            autoCapitalize="none"
            maxLength={60}
          />
        </View>



        {/* --- SECCIÓN: MENÚ GENERAL / ENTRANTES (Vertical) --- */}
        {filteredProducts.length > 0 ? (
          <View style={styles.verticalSectionSpacing}>
            <View style={styles.verticalListContainer}>
              {filteredProducts.map((product) => (
                <OfertaCard
                  key={product.id}
                  oferta={product}
                  fullWidth={true}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron productos</Text>
          </View>
        )}
      </ScrollView>

      {/* Píldora de Carrito Flotante */}
      <FloatingCart count={cartCount} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 110, // Espaciado extra para evitar solapamiento con el carrito flotante
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 8,
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 20,
  },
  verticalSectionSpacing: {
    paddingHorizontal: 20,
  },
  verticalListContainer: {
    marginTop: 8,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 96 : 60,
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ECEFF1',
    zIndex: 100,
    // Sombra sutil premium
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  stickyBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  stickyRightSpacer: {
    width: 36, // Balancea exactamente el ancho del botón volver para centrar el título perfectamente
  },
  searchContainer: {
    height: 50,
    borderRadius: 22,
    backgroundColor: Colors.background2,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '400',
    paddingVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#888888',
    fontWeight: '500',
  },
  storeInfoContainer: {
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    gap: 6,
  },
  storeTitleName: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    opacity: 0.7,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  cerclePlusWrapper: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
});
