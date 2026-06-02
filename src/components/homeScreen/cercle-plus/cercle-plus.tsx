import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CerclePlusCard from './cercle-plus-card';
import { CerclePlusBottomSheet } from '../../cercle-plus-bottom-sheet';

export default function CerclePlus({ compact = false }: { compact?: boolean }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <CerclePlusCard compact={compact} onPress={() => setVisible(true)} />
      <CerclePlusBottomSheet visible={visible} onClose={() => setVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
