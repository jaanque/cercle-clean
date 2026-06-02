import { ActivityIndicator, StyleSheet, View } from 'react-native';
import LocaleCard, { Store } from './locale-card';
import LocalesHeader from './locales-header';

import { Colors } from '@/constants/theme';

// Recibe los datos y los renderiza en una lista vertical con las tarjetas originales
export default function Locales({ stores, loading }: { stores: Store[], loading: boolean }) {
  return (
    <View style={styles.container}>
      <LocalesHeader />
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.accent} style={{ marginVertical: 20 }} />
        ) : (
          stores.slice(0, 10).map((store) => (
            <LocaleCard key={store.id} locale={store} />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: '100%' 
  },
  listContainer: { 
    paddingHorizontal: 16,
  },
});