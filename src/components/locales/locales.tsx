import { ActivityIndicator, StyleSheet, View } from 'react-native';
import LocaleCard, { Store } from './locale-card';
import LocalesHeader from './locales-header';

// Ahora recibe los datos como "props" (parametros)
export default function Locales({ stores, loading }: { stores: Store[], loading: boolean }) {
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
  container: { marginTop: 20, width: '100%' },
  listContainer: { paddingHorizontal: 16 },
});