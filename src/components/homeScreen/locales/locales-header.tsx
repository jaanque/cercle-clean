import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function LocalesHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cerca de ti</Text>
      <Pressable style={styles.button} onPress={() => router.push('/stores-list')}>
        <Text style={styles.buttonText}>Ver más</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.background2,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
});
