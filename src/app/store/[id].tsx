import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useHomeData } from '@/hooks/useHomeData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStoreDistance } from '@/components/homeScreen/locales/locale-card';
import OfertaCard from '@/components/homeScreen/ofertas/oferta-card';

export default function StoreDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { stores, ofertas, loading, error } = useHomeData();

  // Find current store
  const store = stores.find((s) => s.id === id);

  // Filter products for this store
  const storeProducts = ofertas.filter((p) => p.store_id === id);

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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Fijo con el nombre del Comercio */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <SymbolView name="chevron.left" size={20} tintColor="#1C1C1E" weight="bold" />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.ellipsisBtn, pressed && { opacity: 0.7 }]}>
          <SymbolView name="ellipsis" size={20} tintColor="#1C1C1E" weight="bold" />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* PROFILE SECTION */}
        <View style={styles.profileSection}>
          <Text style={styles.storeNameText}>{store.name}</Text>
          
          {/* Rating and Distance Row (Without Cercle+) */}
          <View style={styles.storeMetaRow}>
            <Text style={styles.storeMetaText}>
              {store.rating} <SymbolView name="star.fill" size={12} tintColor="#F59E0B" /> {
                store.reviews_count 
                  ? (store.reviews_count.includes('(') ? store.reviews_count : `(${store.reviews_count})`) 
                  : '(1.5k+)'
              } • {getStoreDistance(store)}
            </Text>
          </View>

          {/* Location row */}
          <View style={styles.addressRow}>
            <SymbolView name="mappin.and.ellipse" size={12} tintColor="#64748B" />
            <Text style={styles.addressText}>{store.location || 'Barcelona, España'}</Text>
          </View>
        </View>

        {/* SINGLE BENEFIT BLOCK: Real Pickup Time */}
        <View style={styles.singleBenefitContainer}>
          <SymbolView name="clock.fill" size={13} tintColor="#64748B" style={{ marginRight: 6 }} />
          <Text style={styles.singleBenefitText}>
            Listo para recoger en: <Text style={styles.singleBenefitBold}>{store.delivery_time ? store.delivery_time.replace(/Listo en /i, '') : '15 min'}</Text>
          </Text>
        </View>

        {/* DISCRETE CONTACT & NAVIGATION ACTIONS ROW */}
        <View style={styles.storeContactActionsRow}>
          <Pressable 
            style={({ pressed }) => [styles.contactActionBtn, pressed && { opacity: 0.75 }]}
            onPress={() => Alert.alert('Llamar', `Llamando al comercio ${store.name}...`)}
          >
            <SymbolView name="phone.fill" size={11} tintColor="#475569" />
            <Text style={styles.contactActionBtnText}>Llamar</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.contactActionBtn, pressed && { opacity: 0.75 }]}
            onPress={() => Alert.alert('Cómo llegar', `Abriendo mapa para navegar a ${store.location || 'Barcelona'}...`)}
          >
            <SymbolView name="arrow.triangle.turn.up.right.diamond.fill" size={11} tintColor="#475569" />
            <Text style={styles.contactActionBtnText}>Cómo llegar</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.contactActionBtn, pressed && { opacity: 0.75 }]}
            onPress={() => Alert.alert('Web', `Abriendo sitio web de ${store.name}...`)}
          >
            <SymbolView name="globe" size={11} tintColor="#475569" />
            <Text style={styles.contactActionBtnText}>Web</Text>
          </Pressable>
        </View>

        {/* PRODUCTS SECTION (Grid list layout like before but without pickup info) */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Excedentes del día</Text>
          {storeProducts.length > 0 ? (
            <View style={styles.productsGrid}>
              {storeProducts.map((prod) => (
                <OfertaCard key={prod.id} oferta={prod} grid={true} hidePickup={true} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyProducts}>
              <SymbolView name="bag.badge.minus" size={32} tintColor="#C7C7CC" />
              <Text style={styles.emptyText}>No hay productos disponibles</Text>
            </View>
          )}
        </View>

        {/* Extra margin bottom for custom tabs nav spacing */}
        <View style={styles.extraSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
    borderRadius: 22,
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

  // STANDARD TOP FIXED HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    zIndex: 1000,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ellipsisBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // PROFILE INFO SECTION
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 20,
  },
  storeNameText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  storeMetaRow: {
    marginTop: 4,
  },
  storeMetaText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    gap: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },

  // SINGLE BENEFIT BLOCK STYLE
  singleBenefitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    marginHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    marginBottom: 24,
  },
  singleBenefitText: {
    fontSize: 13.5,
    color: '#475569',
    fontWeight: '500',
  },
  singleBenefitBold: {
    fontWeight: '800',
    color: '#0F172A',
  },

  // DISCRETE CONTACT ACTIONS ROW STYLE
  storeContactActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 26,
    paddingHorizontal: 20,
  },
  contactActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    gap: 5,
    height: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactActionBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },

  // PRODUCTS GRID STYLES
  productsSection: {
    width: '100%',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.4,
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
  extraSpacing: {
    height: 40,
  },
});

