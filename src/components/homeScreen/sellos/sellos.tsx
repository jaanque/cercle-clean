import React from 'react';
import { StyleSheet, View } from 'react-native';
import SellosCard from './sellos-card';

/**
 * Sellos - Componente wrapper de la sección de la Tarjeta de Sellos.
 * Actúa como orquestador estético manejando el espaciado simétrico exterior (marginTop: 20).
 */
export default function Sellos() {
  return (
    <View style={styles.container}>
      <SellosCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20, // Distancia simétrica de 20px respecto al componente anterior
    paddingHorizontal: 16,
    width: '100%',
  },
});

