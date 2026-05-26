import { StyleSheet, View } from 'react-native';
import SellosCard from './sellos-card';

export default function Sellos() {
  return (
    <View style={styles.container}>
      <SellosCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    width: '100%',
  },
});
