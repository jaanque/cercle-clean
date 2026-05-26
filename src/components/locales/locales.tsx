import React from 'react';
import { View, StyleSheet } from 'react-native';
import LocalesHeader from './locales-header';
import LocaleCard from './locale-card';
import { mockLocales } from '@/mockData/locales';

export default function Locales() {
  return (
    <View style={styles.container}>
      <LocalesHeader />
      <View style={styles.listContainer}>
        {mockLocales.map((locale) => (
          <LocaleCard key={locale.id} locale={locale} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    width: '100%',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});
