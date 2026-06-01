import React from 'react';
import { StyleSheet, View } from 'react-native';
import SellosCard from './sellos-card';

/**
 * Sellos - Componente wrapper de la sección de la Tarjeta de Sellos.
 * Actúa como orquestador estético manejando el espaciado simétrico exterior (marginTop: 20).
 */
export default function Sellos({ userStamps }: { userStamps: any[] }) {
  return (
    <View style={styles.container}>
      <SellosCard userStamps={userStamps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
