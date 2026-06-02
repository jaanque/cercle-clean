import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useHomeData } from '@/hooks/useHomeData';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStoreDistance } from '@/components/homeScreen/locales/locale-card';
import OfertaCard from '@/components/homeScreen/ofertas/oferta-card';

// Modular Store Detail Components
import StoreHeader from '@/components/storeDetail/store-header';
import StoreHero from '@/components/storeDetail/store-hero';
import StoreInfo from '@/components/storeDetail/store-info';
import StoreActions from '@/components/storeDetail/store-actions';
import StoreFloatingCart from '@/components/storeDetail/store-floating-cart';

export default function StoreDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { stores, ofertas, loading, error } = useHomeData();
  const insets = useSafeAreaInsets();

  // Find current store
  const store = stores.find((s) => s.id === id);

  // Filter products for this store
  const storeProducts = ofertas.filter((p) => p.store_id === id);

  // Local cart state
  const [cart, setCart] = React.useState<Record<string, number>>({});

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [productId, qty]) => {
    const prod = storeProducts.find(p => p.id === productId);
    if (!prod) return sum;
    const priceNum = parseFloat(prod.price.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    return sum + priceNum * qty;
  }, 0).toFixed(2);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </SafeAreaView>
    );
  }

  if (error || !store) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <SymbolView name="exclamationmark.triangle.fill" size={32} tintColor="#FF3B30" />
        <Text style={styles.errorText}>No se pudo encontrar el comercio</Text>
        <Pressable style={styles.errorButton} onPress={() => router.back()}>
          <Text style={styles.errorButtonText}>Volver atrás</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Floating Header */}
      <StoreHeader 
        onBack={() => router.back()} 
        onMore={() => Alert.alert('Opciones', 'Más opciones no disponibles en esta versión.')}
        topInset={insets.top}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner and Overlapping Logo */}
        <StoreHero 
          imageUri={store.image} 
          logoUri={store.logo} 
        />

        {/* Store Profile details (Name, Tagline, Address, Stats tags) */}
        <StoreInfo
          name={store.name}
          tagline={store.tagline}
          location={store.location}
          rating={store.rating}
          reviewsCount={store.reviews_count}
          distance={getStoreDistance(store)}
          deliveryTime={store.delivery_time}
        />

        {/* Contact actions row */}
        <StoreActions
          onCall={() => Alert.alert('Llamar', `Llamando al comercio ${store.name}...`)}
          onDirections={() => Alert.alert('Cómo llegar', `Abriendo mapa para navegar a ${store.location || 'Barcelona'}...`)}
          onWeb={() => Alert.alert('Web', `Abriendo sitio web de ${store.name}...`)}
        />

        {/* PRODUCTS SECTION */}
        <View style={styles.productsSection}>
          {storeProducts.length > 0 ? (
            <View style={styles.productsGrid}>
              {storeProducts.map((prod) => (
                <OfertaCard 
                  key={prod.id} 
                  oferta={prod} 
                  grid={true} 
                  hidePickup={true} 
                  quantity={cart[prod.id] || 0}
                  onQuantityChange={(newQty) => setCart(prev => {
                    const next = { ...prev };
                    if (newQty === 0) {
                      delete next[prod.id];
                    } else {
                      next[prod.id] = newQty;
                    }
                    return next;
                  })}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyProducts}>
              <SymbolView name="bag.badge.minus" size={32} tintColor="#C7C7CC" />
              <Text style={styles.emptyText}>No hay productos disponibles</Text>
            </View>
          )}
        </View>

        {/* Bottom space for safe scrolling */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Cart Banner */}
      <StoreFloatingCart
        totalItems={totalItems}
        totalPrice={totalPrice}
        bottomInset={insets.bottom}
        onCheckout={() => Alert.alert('Completar Pedido', `¿Deseas tramitar tu pedido por un valor de ${totalPrice} € (${totalItems} excedentes)?`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    gap: 12,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22, // rounded strictly to 22px
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 100,
  },
  productsSection: {
    width: '100%',
    paddingHorizontal: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  emptyProducts: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8E8E93',
  },
});
