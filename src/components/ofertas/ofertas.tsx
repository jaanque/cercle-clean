import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import OfertasHeader from './ofertas-header';
import OfertaCard from './oferta-card';
import { mockOfertas } from '@/mockData/ofertas';

export default function Ofertas() {
  return (
    <View style={styles.container}>
      <OfertasHeader />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mockOfertas.map((oferta) => (
          <OfertaCard key={oferta.id} oferta={oferta} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
