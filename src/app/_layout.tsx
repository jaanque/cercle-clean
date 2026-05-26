import { Slot } from 'expo-router';
import { View } from 'react-native';

import { Colors } from '@/constants/theme';

/**
 * RootLayout - Layout raíz global de la aplicación.
 * Define la estructura base, inyecta la navegación de Expo Router (<Slot />)
 * y garantiza un fondo uniforme y controlado para todas las pantallas del proyecto.
 */
export default function RootLayout() {
  return (
    // Contenedor principal que previene pantallas negras y aplica el color de fondo primario (#ffffff)
    <View style={{ flex: 1, backgroundColor: Colors.background1 }}>
      <Slot />
    </View>
  );
}