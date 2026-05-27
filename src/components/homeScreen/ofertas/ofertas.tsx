import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import OfertasHeader from './ofertas-header';
import OfertaCard, { Product } from './oferta-card';

interface OfertasProps {
  ofertas: Product[];
  onProductAdded?: () => void;
  onProductRemoved?: (quantity: number) => void;
}

export default function Ofertas({ ofertas, onProductAdded, onProductRemoved }: OfertasProps) {
  return (
    <View style={styles.container}>
      <OfertasHeader />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ofertas.map((oferta) => (
          <OfertaCard 
            key={oferta.id} 
            oferta={oferta} 
            onProductAdded={onProductAdded} 
            onProductRemoved={onProductRemoved}
          />
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
