import React from 'react';
import { View, StyleSheet } from 'react-native';
import CerclePlusCard from './cercle-plus-card';

export default function CerclePlus() {
  return (
    <View style={styles.container}>
      <CerclePlusCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 16,
    width: '100%',
  },
});
