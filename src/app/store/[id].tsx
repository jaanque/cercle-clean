import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Platform, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import { useStoreDetail } from '@/hooks/useStoreDetail';
import { useCart } from '@/providers/CartProvider';
import StoreHeader from '@/components/storeDetailScreen/store-header';
import OfertaCard from '@/components/homeScreen/ofertas/oferta-card';
import FloatingCart from '@/components/homeScreen/cart/floating-cart';
import StoreDetailSkeleton from '@/components/skeletons/storeDetailSkeleton';

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

  // Consumimos el carrito global sincronizado
  const { cartCount } = useCart();
  // Estado para controlar la visibilidad de la barra de navegación pegajosa en scroll
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  // Estado para la búsqueda de productos
  const [searchQuery, setSearchQuery] = useState('');

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
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
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la información del local.</Text>
        <Text style={styles.errorSubtext}>{error || 'El local seleccionado no existe.'}</Text>
      </View>
    );
  }

  // Filtrado dinámico de productos basado en la búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.screenContainer}>
      {/* Barra de Navegación Pegajosa (Sticky Header on Scroll) */}
      {showStickyHeader && (
        <View style={styles.stickyHeader}>
          <Pressable style={styles.stickyBackButton} onPress={() => router.back()}>
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
      >
        {/* Cabecera Estática Estándar y Segura de Store */}
        <StoreHeader name={store.name} image={store.image} />

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
            onChangeText={setSearchQuery}
            placeholder="Buscar productos..."
            placeholderTextColor="#9EA8B6"
            style={styles.searchInput}
            clearButtonMode="while-editing"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        {/* --- SECCIÓN: MENÚ GENERAL / ENTRANTES (Vertical) --- */}
        {filteredProducts.length > 0 ? (
          <View style={[styles.sectionContainer, styles.verticalSectionSpacing]}>
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
    </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 16,
    color: '#888888',
    fontWeight: '600',
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accent,
  },
  horizontalScrollPadding: {
    paddingLeft: 20,
    paddingRight: 6,
    paddingBottom: 12, // Evita cortar sombras de los botones plus flotantes
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
});
