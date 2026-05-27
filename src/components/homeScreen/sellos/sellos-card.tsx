import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import Stamp from './stamp';
import { useAuth } from '@/providers/AuthProvider';

/**
 * SellosCard - Tarjeta dinámica que renderiza la acumulación de sellos.
 * Muestra el progreso real del usuario logueado o le invita a iniciar sesión si es visitante.
 */
export default function SellosCard({ userStamps }: { userStamps: any[] }) {
  const { user } = useAuth();

  // Calcular sellos completados de forma modular (máximo de 5)
  const totalStamps = 5;
  const completedCount = user ? Math.min(userStamps.length, totalStamps) : 0;

  return (
    <Pressable style={styles.card}>
      {/* Columna Izquierda: Información de progreso */}
      <View style={styles.leftColumn}>
        <Text style={styles.title}>Tarjeta de sellos</Text>
        <Text style={styles.subtitle}>
          {user ? `${completedCount} de ${totalStamps} completados` : 'Inicia sesión para acumular sellos'}
        </Text>
      </View>

      {/* Columna Derecha: Fila de sellos visuales y navegación */}
      <View style={styles.rightColumn}>
        <View style={styles.stampsRow}>
          {Array.from({ length: totalStamps }).map((_, index) => (
            <Stamp key={index} completed={index < completedCount} />
          ))}
        </View>
        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={16}
          tintColor="#5B2333"
          weight="semibold"
          style={styles.chevron}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background2,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flexDirection: 'column',
    gap: 4,
    flex: 1, // Permite que el texto se adapte y no colisione en pantallas pequeñas
    paddingRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '500',
    lineHeight: 18,
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stampsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chevron: {
    marginLeft: 4,
  },
});
