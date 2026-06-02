import { Slot, usePathname, useRouter } from 'expo-router';
import { View, StyleSheet, Text, Pressable, Platform, LayoutAnimation, UIManager } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';

import { Colors } from '@/constants/theme';
import { AuthProvider } from '@/providers/AuthProvider';

// Habilitar animaciones de diseño en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * RootLayout - Layout raíz global de la aplicación.
 * Define la estructura base, inyecta el AuthProvider global y la navegación de Expo Router (<Slot />).
 * Integra un menú de navegación inferior premium y flotante con transición activa.
 */
export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();

  // Ocultar el menú de navegación inferior en las pantallas de inicio de sesión, registro y explorar
  const hideNavBar = pathname === '/login' || pathname === '/register' || pathname === '/explore';

  const navItems = [
    { name: 'Inicio', path: '/', icon: 'house', activeIcon: 'house.fill' },
    { name: 'Pedidos', path: '/orders', icon: 'bag', activeIcon: 'bag.fill' },
    { name: 'Perfil', path: '/profile', icon: 'person', activeIcon: 'person.fill' },
  ];

  // Animar suavemente el menú de navegación al cambiar de pestaña
  useEffect(() => {
    LayoutAnimation.configureNext({
      duration: 350,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.68, // Efecto rebote moderno, muy responsivo y fluido
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        duration: 0, // Desaparece al instante para evitar retrasos visuales
        property: LayoutAnimation.Properties.opacity,
      },
    });
  }, [pathname]);

  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: Colors.background1 }}>
        <Slot />

        {/* Menú de navegación inferior premium */}
        {!hideNavBar && (
          <View style={styles.navBarContainer} pointerEvents="box-none">
            <View style={styles.navBar}>
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Pressable
                    key={item.name}
                    style={[styles.navItem, isActive && styles.activeNavItem]}
                    onPress={() => router.push(item.path as any)}
                  >
                    <SymbolView
                      name={(isActive ? item.activeIcon : item.icon) as any}
                      size={21}
                      tintColor={isActive ? Colors.accent : '#666666'}
                      weight="bold"
                    />
                    {isActive && (
                      <Text style={styles.activeNavText}>
                        {item.name}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  navBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  navBar: {
    backgroundColor: '#ffffff',
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    gap: 3,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 25,
    gap: 8,
  },
  activeNavItem: {
    backgroundColor: 'rgba(91, 35, 51, 0.08)', // Tono suave de Colors.accent (#5B2333)
  },
  activeNavText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
});