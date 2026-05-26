import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={18}
        tintColor="#9EA8B6"
        style={styles.icon}
      />
      <Text style={styles.placeholder}>Buscar productos, locales...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background2,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    fontSize: 15,
    color: '#9EA8B6',
    fontWeight: '400',
  },
});
