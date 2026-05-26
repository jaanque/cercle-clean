import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileButton from './profile-button';
import SearchBar from './search-bar';
import { Colors } from '@/constants/theme';

/**
 * Header - Componente contenedor de la cabecera superior.
 * Agrupa la barra de búsqueda y el botón del perfil de usuario en una fila horizontal.
 * Gestiona el área segura del notch (SafeAreaView) de forma optimizada sin agregar relleno inferior.
 */
export default function Header() {
  return (
    // SafeAreaView optimizado limitando los bordes para evitar espaciados innecesarios abajo
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <ProfileButton />
        <SearchBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background1, // Mantiene el color blanco consistente
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});


