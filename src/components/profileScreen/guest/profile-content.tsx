import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

/**
 * ProfileContent - Ilustración, textos de bienvenida y subtítulos explicativos.
 */
export default function ProfileContent() {
  return (
    <View style={styles.content}>
      <SymbolView name="person.crop.circle.fill" size={80} tintColor={Colors.accent} style={styles.avatar} />
      <Text style={styles.welcomeText}>Únete a CercleApp</Text>
      <Text style={styles.subtitle}>
        Empieza a salvar comida y descubre las mejores ofertas cerca de ti.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  avatar: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});
