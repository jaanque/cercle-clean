import { Slot } from 'expo-router';
import { View } from 'react-native';

import { Colors } from '@/constants/theme';
import { AuthProvider } from '@/providers/AuthProvider';
import { CartProvider } from '@/providers/CartProvider';

/**
 * RootLayout - Layout raíz global de la aplicación.
 * Define la estructura base, inyecta el AuthProvider global y la navegación de Expo Router (<Slot />)
 * y garantiza un fondo uniforme y controlado para todas las pantallas del proyecto.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* Contenedor principal que previene pantallas negras y aplica el color de fondo primario (#ffffff) */}
        <View style={{ flex: 1, backgroundColor: Colors.background1 }}>
          <Slot />
        </View>
      </CartProvider>
    </AuthProvider>
  );
}