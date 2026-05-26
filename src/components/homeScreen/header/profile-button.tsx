import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router'; // 1. Importamos el router
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

export default function ProfileButton() {
  const router = useRouter(); // 2. Instanciamos el router

  return (
    // 3. Añadimos el evento onPress apuntando a la ruta que hemos creado
    <Pressable style={styles.button} onPress={() => router.push('/profile')}>
      <SymbolView
        name={{ ios: 'person', android: 'person', web: 'person' }}
        size={22}
        tintColor="#333333"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 22,
    backgroundColor: Colors.background2,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});