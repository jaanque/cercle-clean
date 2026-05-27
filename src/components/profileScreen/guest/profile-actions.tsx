import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';

import { useRouter } from 'expo-router';

/**
 * ProfileActions - Botones de acción principales (Iniciar Sesión y Crear Cuenta)
 * con radio de bordes unificado a 22px de forma consistente.
 */
export default function ProfileActions() {
  const router = useRouter();

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: Colors.background1,
    paddingVertical: 16,
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
