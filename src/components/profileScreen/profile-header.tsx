import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

/**
 * ProfileHeader - Cabecera superior para la pantalla de Perfil.
 * Contiene el botón de regreso y el título centrado.
 */
export default function ProfileHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <SymbolView name="chevron.left" size={24} tintColor={Colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Mi Perfil</Text>
      {/* Espaciador de simetría */}
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    width: '100%',
  },
  backButton: {
    padding: 8,
    borderRadius: 22,
    backgroundColor: Colors.background2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
});
