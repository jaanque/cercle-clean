import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from './search-bar';
import { Colors } from '@/constants/theme';

/**
 * Header - Componente contenedor de la cabecera superior estática.
 * Agrupa la barra de búsqueda y garantiza que permanezca siempre fija en la parte superior.
 */
export default function Header() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <SearchBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background1,
    zIndex: 999,
  },
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: Colors.background1,
  },
});


