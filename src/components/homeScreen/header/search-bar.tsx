import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Animated } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { usePathname, useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { supabaseAuth } from '@/lib/supabase/supabase';
import { Colors } from '@/constants/theme';

export default function SearchBar() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>(null);

  const { user } = useAuth();
  const isExplore = pathname === '/explore';
  const hasText = ((params.q as string) || '').length > 0;

  // Animaciones de React Native
  const backAnim = useRef(new Animated.Value(0)).current;
  const clearAnim = useRef(new Animated.Value(0)).current;

  // Animación del botón volver atrás al entrar a la pantalla de explorar
  useEffect(() => {
    if (isExplore) {
      Animated.spring(backAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      backAnim.setValue(0);
    }
  }, [isExplore]);

  // Animación del botón limpiar buscador
  useEffect(() => {
    Animated.timing(clearAnim, {
      toValue: hasText ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [hasText]);

  // Manejo de volver atrás (limpia búsqueda y regresa a inicio)
  const handleGoBack = () => {
    router.setParams({ q: '' });
    router.push('/');
  };

  const handleSearchSubmit = async () => {
    const term = ((params.q as string) || '').trim();
    if (!term) return;

    // Guardar en base de datos si el usuario está logueado
    if (user) {
      try {
        // Eliminar duplicado anterior para colocarlo al principio
        await supabaseAuth
          .from('recent_searches')
          .delete()
          .eq('user_id', user.id)
          .eq('query', term);

        // Insertar la nueva búsqueda reciente
        await supabaseAuth
          .from('recent_searches')
          .insert({
            user_id: user.id,
            query: term,
          });
      } catch (e) {
        console.error('Error saving search on submit:', e);
      }
    }
  };

  // Escuchar el evento de foco de la navegación para levantar el teclado al 100% de forma nativa una vez terminada la transición
  useEffect(() => {
    if (isExplore) {
      const unsubscribe = navigation.addListener('focus', () => {
        const timer = setTimeout(() => {
          inputRef.current?.focus();
        }, 200); // 200ms de retraso óptimo para asegurar que la transición de pantalla ha terminado y el renderizado es estable
        return () => clearTimeout(timer);
      });
      return unsubscribe;
    }
  }, [navigation, isExplore]);

  // Interpolar animación volver atrás (desplazamiento y opacidad)
  const backTranslateX = backAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 0],
  });

  if (isExplore) {
    return (
      <View style={styles.row}>
        {/* Botón Volver Atrás Animado (Amazon/Premium style) */}
        <Animated.View style={{ opacity: backAnim, transform: [{ translateX: backTranslateX }] }}>
          <Pressable onPress={handleGoBack} style={styles.backButton}>
            <SymbolView name="chevron.left" size={24} tintColor="#1C1C1E" />
          </Pressable>
        </Animated.View>

        <View style={[styles.container, { flex: 1 }]}>
          <View style={styles.leftContainer}>
            <SymbolView
              name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              size={18}
              tintColor="#1C1C1E"
              style={styles.icon}
            />
            <TextInput
              ref={inputRef}
              placeholder="Buscar o hacer una pregunta"
              placeholderTextColor="#707070"
              style={styles.input}
              autoFocus={true}
              value={(params.q as string) || ''}
              onChangeText={(text) => {
                router.setParams({ q: text });
              }}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {hasText && (
              <Animated.View style={{ transform: [{ scale: clearAnim }], opacity: clearAnim }}>
                <Pressable 
                  onPress={() => router.setParams({ q: '' })} 
                  style={styles.clearButton}
                >
                  <SymbolView name="xmark.circle.fill" size={18} tintColor="#9EA8B6" />
                </Pressable>
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <Pressable 
      style={styles.container} 
      onPress={() => router.push('/explore?focus=true' as any)}
    >
      <View style={styles.leftContainer}>
        <SymbolView
          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          size={18}
          tintColor="#1C1C1E"
          style={styles.icon}
        />
        <Text style={styles.placeholder}>Buscar o hacer una pregunta</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 22,
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  container: {
    width: '100%', // Ancho completo garantizado
    height: 50, // Altura sólida fija de 50px
    borderRadius: 22,
    backgroundColor: '#ffffff', // Fondo blanco sólido premium
    borderWidth: 1,
    borderColor: '#EAEAEA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    fontSize: 15,
    color: '#707070',
    fontWeight: '400',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '400',
    padding: 0,
    height: '100%',
  },
  clearButton: {
    padding: 4,
    marginRight: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchSubmitButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSubmitButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
