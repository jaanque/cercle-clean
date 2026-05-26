import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import Stamp from './stamp';

export default function SellosCard() {
  return (
    <Pressable style={styles.card}>
      {/* Left Column */}
      <View style={styles.leftColumn}>
        <Text style={styles.title}>Tarjeta de sellos</Text>
        <Text style={styles.subtitle}>3 de 5 completados</Text>
      </View>

      {/* Right Column */}
      <View style={styles.rightColumn}>
        <View style={styles.stampsRow}>
          <Stamp completed={true} />
          <Stamp completed={true} />
          <Stamp completed={true} />
          <Stamp completed={false} />
          <Stamp completed={false} />
        </View>
        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={16}
          tintColor="#5B2333"
          weight="semibold"
          style={styles.chevron}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background2,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stampsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chevron: {
    marginLeft: 4,
  },
});
