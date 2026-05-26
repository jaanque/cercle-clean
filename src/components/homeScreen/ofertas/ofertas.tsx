import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import OfertasHeader from './ofertas-header';
import OfertaCard, { Product } from './oferta-card';

interface OfertasProps {
  ofertas: Product[];
}

export default function Ofertas({ ofertas }: OfertasProps) {
  return (
    <View style={styles.container}>
      <OfertasHeader />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ofertas.map((oferta) => (
          <OfertaCard key={oferta.id} oferta={oferta} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
