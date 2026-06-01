import React from 'react';
import { View, StyleSheet } from 'react-native';
import OfertasHeader from './ofertas-header';
import OfertaCard, { Product } from './oferta-card';

interface OfertasProps {
  ofertas: Product[];
}

export default function Ofertas({ ofertas }: OfertasProps) {
  return (
    <View style={styles.container}>
      <OfertasHeader />
      <View style={styles.gridContainer}>
        {ofertas.map((oferta) => (
          <OfertaCard 
            key={oferta.id} 
            oferta={oferta} 
            grid={true}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
});
