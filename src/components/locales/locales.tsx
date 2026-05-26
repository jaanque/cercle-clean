import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import LocalesHeader from './locales-header';
import LocaleCard, { Store } from './locale-card';

export default function Locales() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://icjheiuqbgaozzmgdmpg.supabase.co/functions/v1/select-stores')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.stores) {
          setStores(data.stores);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching stores:', error);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <LocalesHeader />
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#5B2333" style={{ marginVertical: 20 }} />
        ) : (
          stores.map((store) => (
            <LocaleCard key={store.id} locale={store} />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});
