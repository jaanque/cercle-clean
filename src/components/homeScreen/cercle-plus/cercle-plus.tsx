import React from 'react';
import { View, StyleSheet } from 'react-native';
import CerclePlusCard from './cercle-plus-card';

export default function CerclePlus({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.container}>
      <CerclePlusCard compact={compact} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
