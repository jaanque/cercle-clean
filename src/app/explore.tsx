import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/components/homeScreen/header/header';
import CerclePlus from '@/components/homeScreen/cercle-plus/cercle-plus';
import { useHomeData } from '@/hooks/useHomeData';
import { Colors } from '@/constants/theme';
import LocaleCard, { getStoreDistance } from '@/components/homeScreen/locales/locale-card';
import OfertaCard, { Product } from '@/components/homeScreen/ofertas/oferta-card';
import ExploreSkeleton from '@/components/skeletons/exploreSkeleton';
import { supabaseAuth } from '@/lib/supabase/supabase';
import { useAuth } from '@/providers/AuthProvider';

// Función para extraer la raíz o lexema de una palabra en español (Stemming de alto rendimiento)
function getSpanishStem(word: string): string {
  let w = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (w.length <= 3) return w;

  // Sufijos comunes en español organizados por longitud descendente
  const suffixes = [
    'amente', 'mente',
    'itas', 'itos', 'illas', 'illos', 'istas', 'eras', 'eros', 'arias', 'arios', 'ivas', 'ivos',
    'ita', 'ito', 'illa', 'illo', 'ista', 'era', 'ero', 'aria', 'ario', 'iva', 'ivo',
    'eria', 'ería', 'idad', 'ades', 'icon', 'icos', 'icas', 'ismo', 'amos',
    'otes', 'otas', 'ones', 'azas', 'azos',
    'as', 'os', 'es', 'a', 'o', 'e', 's'
  ];

  for (const suffix of suffixes) {
    if (w.endsWith(suffix) && w.length - suffix.length >= 3) {
      return w.substring(0, w.length - suffix.length);
    }
  }

  return w;
}

// --- MOTOR DE BÚSQUEDA PREMIUM ROBUSTO Y FLEXIBLE (Tolerante a tildes, morfologías y palabras desordenadas) ---
function robustMatch(targetText: string | undefined | null, queryText: string): boolean {
  if (!targetText) return false;
  
  // 1. Normalizar texto destino
  const normalize = (str: string) => 
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const cleanTarget = normalize(targetText);
  const cleanQuery = normalize(queryText).trim();
  
  if (!cleanQuery) return true;

  // 2. Tokenizar la consulta
  const queryTokens = cleanQuery.split(/\s+/);
  
  // 3. Comparar las raíces (stems) de los tokens de búsqueda en el destino
  return queryTokens.every((token) => {
    const stem = getSpanishStem(token);
    return cleanTarget.includes(stem);
  });
}

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const query = (params.q as string || '').trim().toLowerCase();
  
  // Es un estado de búsqueda activo cuando el usuario ha escrito algo.
  const isSearchActive = query.length > 0;

  const { user } = useAuth();
  const { categories, stores, ofertas, recentSearches, loading } = useHomeData();

  // Estado local sincronizado para opacidad instantánea en la UI al borrar/añadir
  const [localRecentSearches, setLocalRecentSearches] = useState<any[] | null>(null);

  // Efecto que re-consulta de Supabase las búsquedas recientes reales en tiempo real cuando se borra el buscador o cambia el estado
  useEffect(() => {
    let isMounted = true;
    
    async function fetchSearches() {
      if (!user) return;
      console.log('[ExploreScreen] Querying recent_searches from Supabase for user:', user.id);
      try {
        const { data, error } = await supabaseAuth
          .from('recent_searches')
          .select('*')
          .eq('user_id', user.id)
          .order('searched_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('[ExploreScreen] Supabase error fetching recent_searches:', error);
        } else if (isMounted && data) {
          console.log('[ExploreScreen] Successfully fetched recent_searches:', data);
          setLocalRecentSearches(data);
        }
      } catch (err) {
        console.error('[ExploreScreen] Failed to execute select query:', err);
      }
    }

    fetchSearches();

    return () => {
      isMounted = false;
    };
  }, [isSearchActive, user, recentSearches]);

  const recentSearchesList = localRecentSearches !== null ? localRecentSearches : recentSearches;

  // Recomendados o tendencias
  const trendingSearches = [
    { title: 'Cercle AI ✨', subtitle: 'Recomendaciones inteligentes', query: 'Cercle AI' },
    { title: '🏀 Deportes al aire libre', subtitle: 'Artículos locales', query: 'Deportes' },
    { title: '💄 Cosmética ecológica', subtitle: 'Belleza e higiene', query: 'Belleza' },
    { title: '💻 Gadgets reacondicionados', subtitle: 'Tecnología barata', query: 'Tech' },
  ];

  // Guardar búsqueda real en base de datos al seleccionar
  const handleSelectSearch = async (searchTerm: string) => {
    router.setParams({ q: searchTerm });
    const term = searchTerm.trim();
    if (!term || !user) return;

    try {
      // Evitar duplicación de búsqueda reciente moviéndola arriba
      await supabaseAuth
        .from('recent_searches')
        .delete()
        .eq('user_id', user.id)
        .eq('query', term);

      await supabaseAuth
        .from('recent_searches')
        .insert({
          user_id: user.id,
          query: term
        });
    } catch (e) {
      console.error('Error saving recent search:', e);
    }
  };

  // Eliminar una búsqueda reciente real
  const removeRecentSearch = async (id: string | number) => {
    const updated = recentSearchesList.filter((item) => item.id !== id);
    setLocalRecentSearches(updated);

    try {
      await supabaseAuth
        .from('recent_searches')
        .delete()
        .eq('id', id);
    } catch (e) {
      console.error('Error deleting recent search:', e);
    }
  };

  // Borrar todo el historial de búsquedas del usuario real
  const clearAllRecentSearches = async () => {
    setLocalRecentSearches([]);
    if (!user) return;

    try {
      await supabaseAuth
        .from('recent_searches')
        .delete()
        .eq('user_id', user.id);
    } catch (e) {
      console.error('Error clearing all recent searches:', e);
    }
  };

  // Filtrado de datos real en base a la búsqueda usando el nuevo motor robustMatch
  const matchedCategories = categories.filter(
    (cat) => robustMatch(cat.title, query)
  );

  // Si la búsqueda coincide con una categoría, extraemos los términos significativos para ampliar los resultados de comercios y productos
  const categoryKeywords = matchedCategories.flatMap((cat) =>
    cat.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/\s+/)
      .filter((word: string) => word.length > 3)
  );

  const matchedProducts = ofertas.filter((product) => {
    const storeName = stores.find((s) => s.id === product.store_id)?.name || '';
    const matchesDirect = robustMatch(product.name, query) || robustMatch(storeName, query);
    
    // Coincidencia secundaria si se busca por categoría
    const matchesCategory = categoryKeywords.some((keyword) =>
      robustMatch(product.name, keyword) || robustMatch(storeName, keyword)
    );
    
    return matchesDirect || matchesCategory;
  });

  const matchedStores = stores.filter((store) => {
    const matchesDirect = 
      robustMatch(store.name, query) || 
      robustMatch(store.tagline, query) ||
      robustMatch(store.location, query);
      
    // Coincidencia secundaria si se busca por categoría
    const matchesCategory = categoryKeywords.some((keyword) =>
      robustMatch(store.name, keyword) || 
      robustMatch(store.tagline, keyword) ||
      robustMatch(store.location, keyword)
    );
    
    // La tienda vende un producto que coincide con la búsqueda
    const matchesProduct = matchedProducts.some((product) => product.store_id === store.id);
    
    return matchesDirect || matchesCategory || matchesProduct;
  });

  // Obtener recomendaciones de títulos parecidos en tiempo real (excluyendo el término de búsqueda actual por ser redundante)
  const suggestions = [
    ...ofertas
      .filter((prod) => robustMatch(prod.name, query) && prod.name.toLowerCase() !== query.toLowerCase())
      .map((prod) => ({ id: `prod-${prod.id}`, text: prod.name, type: 'product' })),
    ...categories
      .filter((cat) => robustMatch(cat.title, query) && cat.title.toLowerCase() !== query.toLowerCase())
      .map((cat) => ({ id: `cat-${cat.id}`, text: cat.title, type: 'category' })),
    ...stores
      .filter((store) => robustMatch(store.name, query) && store.name.toLowerCase() !== query.toLowerCase())
      .map((store) => ({ id: `store-${store.id}`, text: store.name, type: 'store' })),
  ]
    .filter((value, index, self) => self.findIndex((t) => t.text.toLowerCase() === value.text.toLowerCase()) === index)
    .slice(0, 10);

  const hasResults = matchedCategories.length > 0 || matchedStores.length > 0 || matchedProducts.length > 0;

  return (
    <View style={styles.container}>
      {/* Cabecera Estática con Buscador Fijo */}
      <Header />

      <ScrollView 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {/* 1. EXPLORAR POR CATEGORÍAS (100% Idéntico a HomeScreen en la parte superior, fuera del condicional, filtrado en tiempo real) */}
        {matchedCategories.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.chipsContainer}
            style={styles.chipsScrollView}
          >
            {matchedCategories.map((category) => (
              <Pressable 
                key={category.id} 
                style={[styles.chip, { backgroundColor: category.active_color || '#F5F5F7' }]}
                onPress={() => handleSelectSearch(category.title)}
              >
                <Text style={styles.chipText}>
                  {category.emoji ? category.emoji + ' ' : ''}{category.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {!isSearchActive ? (
          loading ? (
            <ExploreSkeleton />
          ) : (
            // --- ESTADO INICIAL: Flat List de Recientes, Cercle+ Real, Tendencias ---
            <View style={styles.suggestedContainer}>
              
              {/* 2. BÚSQUEDAS RECIENTES: Lista plana y limpia en el fondo blanco, sin cajas */}
              {recentSearchesList.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Búsquedas recientes</Text>
                    <Pressable onPress={clearAllRecentSearches}>
                      <Text style={styles.clearAllText}>Borrar todo</Text>
                    </Pressable>
                  </View>
                  
                  <View style={styles.flatRecentList}>
                    {recentSearchesList.map((item) => (
                      <View key={item.id} style={styles.flatRecentRow}>
                        <Pressable 
                          style={styles.recentItemClickable}
                          onPress={() => handleSelectSearch(item.query)}
                        >
                          <SymbolView name="clock" size={16} tintColor="#8E8E93" style={styles.itemIcon} />
                          <Text style={styles.recentItemText}>{item.query}</Text>
                        </Pressable>
                        <Pressable 
                          onPress={() => removeRecentSearch(item.id)}
                          style={styles.deleteSearchButton}
                        >
                          <SymbolView name="xmark" size={14} tintColor="#C7C7CC" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* 3. EL REAL CERCLE+ BANNER COMPACTO */}
              <View style={styles.section}>
                <CerclePlus compact={true} />
              </View>

              {/* 5. TENDENCIAS DE BÚSQUEDA: Lista plana sin cajas individuales */}
              <View style={[styles.section, { marginTop: 6 }]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Lo que más se busca hoy</Text>
                </View>
                <View style={styles.flatTrendingList}>
                  {trendingSearches.map((item, index) => (
                    <Pressable 
                      key={index} 
                      style={styles.flatTrendingRow}
                      onPress={() => handleSelectSearch(item.query)}
                    >
                      <View style={styles.trendingLeft}>
                        <View style={styles.trendIndexWrapper}>
                          <Text style={styles.trendIndexText}>{index + 1}</Text>
                        </View>
                        <View>
                          <Text style={styles.trendingTitle}>{item.title}</Text>
                          <Text style={styles.trendingSubtitle}>{item.subtitle}</Text>
                        </View>
                      </View>
                      <SymbolView name="chevron.right" size={12} tintColor="#C7C7CC" />
                    </Pressable>
                  ))}
                </View>
              </View>

            </View>
          )
        ) : (
          // --- ESTADO ACTIVO DE BÚSQUEDA: Resultados en Tiempo Real ---
          <View style={styles.resultsContainer}>

            {/* Recomendaciones de títulos parecidos en tiempo real */}
            {suggestions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.resultHeaderTitle}>Recomendaciones de búsqueda</Text>
                <View style={styles.flatRecentList}>
                  {suggestions.map((item) => (
                    <Pressable 
                      key={item.id} 
                      style={styles.flatRecentRow}
                      onPress={() => handleSelectSearch(item.text)}
                    >
                      <View style={styles.recentItemClickable}>
                        <SymbolView 
                          name={item.type === 'store' ? 'mappin.and.ellipse' : item.type === 'product' ? 'bag.fill' : 'tag.fill'} 
                          size={14} 
                          tintColor="#8E8E93" 
                          style={styles.itemIcon} 
                        />
                        <Text style={styles.recentItemText}>{item.text}</Text>
                      </View>
                      <SymbolView name="arrow.up.left" size={14} tintColor="#C7C7CC" />
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Productos encontrados en la búsqueda */}
            {matchedProducts.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.resultHeaderTitle}>Productos en tiendas locales</Text>
                <View style={styles.productsGrid}>
                  {matchedProducts.map((product) => (
                    <OfertaCard key={product.id} oferta={product} grid={true} />
                  ))}
                </View>
              </View>
            )}

            {/* Locales/Comercios encontrados en la búsqueda */}
            <View style={styles.section}>
              <Text style={styles.resultHeaderTitle}>Locales cerca de ti</Text>
              
              {matchedStores.length > 0 ? (
                <View style={styles.storesVerticalList}>
                  {matchedStores.map((store) => (
                    <LocaleCard key={store.id} locale={store} />
                  ))}
                </View>
              ) : (
                // Si no hay resultados
                !hasResults && (
                  <View style={styles.noResultsBox}>
                    <SymbolView name="magnifyingglass" size={44} tintColor="#C7C7CC" />
                    <Text style={styles.noResultsText}>No hay resultados para "{query}"</Text>
                    <Text style={styles.noResultsSubtext}>Intenta buscar con otros términos o explora las tendencias.</Text>
                  </View>
                )
              )}
            </View>

          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110, // Espacio amplio para el menú de navegación inferior
  },
  suggestedContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 24,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 20,
  },
  section: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.3,
  },
  resultHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearAllText: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '600',
  },
  
  // Estilo de Lista Plana y Minimalista para Búsquedas Recientes (Sin Cajas Envolventes)
  flatRecentList: {
    width: '100%',
  },
  flatRecentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  recentItemClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  itemIcon: {
    marginRight: 10,
  },
  recentItemText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  deleteSearchButton: {
    padding: 8,
  },
  
  // Estilo de Categorías Populares (Mismos chips que la HomeScreen)
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

  // Estilos de Tendencias Planas
  flatTrendingList: {
    width: '100%',
  },
  flatTrendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  trendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trendIndexWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trendIndexText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8E8E93',
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  trendingSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 1,
  },
  storesVerticalList: {
    gap: 12,
  },
  noResultsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 18,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
});
