import { Slot, usePathname, useRouter } from 'expo-router';
import { View, StyleSheet, Text, Pressable, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Colors } from '@/constants/theme';
import { AuthProvider } from '@/providers/AuthProvider';

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
    { name: 'Perfil', path: '/profile', icon: 'person.crop.circle', activeIcon: 'person.crop.circle.fill' },
  ];

  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: Colors.background1 }}>
        <Slot />

        {/* Menú de navegación inferior premium */}
        {!hideNavBar && (
          <View style={styles.navBar}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Pressable
                  key={item.name}
                  style={styles.navItem}
                  onPress={() => router.push(item.path as any)}
                >
                  <SymbolView
                    name={(isActive ? item.activeIcon : item.icon) as any}
                    size={21}
                    tintColor={isActive ? Colors.accent : '#707070'}
                  />
                  <Text style={[styles.navText, isActive ? styles.activeNavText : {}]}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 86 : 66,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    // Sombra suave de alta definición
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    flex: 1,
    gap: 4,
  },
  navText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#707070',
  },
  activeNavText: {
    color: Colors.accent,
    fontWeight: '800',
  },
});