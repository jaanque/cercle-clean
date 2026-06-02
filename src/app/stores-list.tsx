import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LocaleCard, { Store, getStoreDistance } from '@/components/homeScreen/locales/locale-card';
import { useHomeData } from '@/hooks/useHomeData';
import StoresListSkeleton from '@/components/skeletons/storesListSkeleton';

export default function StoresListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const { categories } = useHomeData(); // Use categories from hook

  const [stores, setStores] = useState<Store[]>([]);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');

  // Fetch stores from Edge Function dynamically based on limit
  const fetchStores = async (currentLimit: number, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
      const authorizationToken = session?.access_token || supabaseAnonKey;
      const userLat = 41.63;
      const userLon = 0.64;

      const fetchUrl = `${supabaseUrl}/functions/v1/select-stores?lat=${userLat}&lon=${userLon}&limit=${currentLimit}`;
      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authorizationToken}`,
        },
      });

      if (!response.ok) throw new Error('Error al conectar con el servidor.');

      const data = await response.json();
      const fetchedStores: Store[] = data.stores || [];

      setStores(fetchedStores);
      
      // If we loaded fewer stores than the current limit, we have reached the end
      if (fetchedStores.length < currentLimit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudieron cargar los comercios.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchStores(limit);
  }, [limit, session]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLimit((prev) => prev + 10);
    }
  };

  // Local filtering & sorting logic
  const filteredStores = stores
    .filter((store) => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (store.location && store.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (store.tagline && store.tagline.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter simulation (using matching tags or store categories in description)
      const matchesCategory = !selectedCategory || 
        store.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (store.tagline && store.tagline.toLowerCase().includes(selectedCategory.toLowerCase()));

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return parseFloat(b.rating) - parseFloat(a.rating);
      } else {
        // Distance sorting
        const distA = parseFloat(getStoreDistance(a).replace(/[^0-9.]/g, '')) || 999;
        const distB = parseFloat(getStoreDistance(b).replace(/[^0-9.]/g, '')) || 999;
        return distA - distB;
      }
    });

  return (
    <View style={styles.container}>
      {/* Fixed header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <SymbolView name="chevron.left" size={20} tintColor="#1C1C1E" weight="bold" />
        </Pressable>
        <Text style={styles.headerTitle}>Comercios</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search bar identical to home screen */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <SymbolView name="magnifyingglass" size={18} tintColor="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar comercios..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <SymbolView name="xmark.circle.fill" size={16} tintColor="#C7C7CC" />
              </Pressable>
            )}
          </View>
        </View>
        {/* Categories scrollable row */}
        <View style={styles.chipsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            <Pressable 
              style={[styles.chip, !selectedCategory && styles.activeChip]}
              onPress={() => setSelectedCategory(null)}
            >
              {!selectedCategory && (
                <SymbolView name="checkmark" size={11} tintColor="#ffffff" weight="bold" />
              )}
              <Text style={[styles.chipText, !selectedCategory && styles.activeChipText]}>Todos</Text>
            </Pressable>

            {categories.filter(c => !c.is_ai).map((category) => {
              const isSelected = selectedCategory === category.title;
              return (
                <Pressable 
                  key={category.id} 
                  style={[
                    styles.chip, 
                    isSelected ? styles.activeChip : { backgroundColor: category.active_color || '#F5F5F7' }
                  ]}
                  onPress={() => setSelectedCategory(isSelected ? null : category.title)}
                >
                  {isSelected && (
                    <SymbolView name="checkmark" size={11} tintColor="#ffffff" weight="bold" />
                  )}
                  <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                    {category.emoji ? category.emoji + ' ' : ''}{category.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Extra Quick Filters (Sorting toggles) */}
        <View style={styles.filterOptionsRow}>
          <Pressable 
            style={[styles.filterToggle, sortBy === 'distance' && styles.activeToggle]}
            onPress={() => setSortBy('distance')}
          >
            <SymbolView name="location.fill" size={12} tintColor={sortBy === 'distance' ? '#ffffff' : '#64748B'} />
            <Text style={[styles.filterToggleText, sortBy === 'distance' && styles.activeToggleText]}>Cercanos</Text>
          </Pressable>

          <Pressable 
            style={[styles.filterToggle, sortBy === 'rating' && styles.activeToggle]}
            onPress={() => setSortBy('rating')}
          >
            <SymbolView name="star.fill" size={12} tintColor={sortBy === 'rating' ? '#ffffff' : '#64748B'} />
            <Text style={[styles.filterToggleText, sortBy === 'rating' && styles.activeToggleText]}>Mejor valorados</Text>
          </Pressable>
        </View>

        {/* Store List */}
        <View style={styles.listContainer}>
          {loading ? (
            <StoresListSkeleton />
          ) : filteredStores.length > 0 ? (
            filteredStores.map((store) => (
              <LocaleCard key={store.id} locale={store} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <SymbolView name="magnifyingglass" size={40} tintColor="#CBD5E1" />
              <Text style={styles.emptyText}>No se encontraron comercios</Text>
            </View>
          )}

          {/* Load More Button */}
          {hasMore && !loading && filteredStores.length > 0 && (
            <Pressable 
              style={({ pressed }) => [
                styles.loadMoreBtn, 
                pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] }
              ]}
              onPress={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.loadMoreText}>Cargar más locales</Text>
              )}
            </Pressable>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  scrollContent: {
    paddingTop: 16,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 22, // rounded strictly to 22px
    height: 46,
    paddingHorizontal: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  chipsSection: {
    marginBottom: 16,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 22, // rounded strictly to 22px
    paddingVertical: 7,
    paddingHorizontal: 14,
    gap: 6,
    height: 36,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeChip: {
    backgroundColor: Colors.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  activeChipText: {
    color: '#ffffff',
  },
  filterOptionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 22, // rounded strictly to 22px
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  activeToggle: {
    backgroundColor: '#0F172A', // Dark elegant active toggle
  },
  filterToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  activeToggleText: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  loadMoreBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 22, // rounded strictly to 22px
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  loadMoreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
