import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

/**
 * ProfileLogged - Interfaz premium de Usuario Autenticado.
 * Encapsula la visualización de datos de perfil y la acción de cerrar sesión.
 */
export default function ProfileLogged() {
  const { user, signOut } = useAuth();

  // Obtiene la primera letra del correo en mayúscula para el Avatar
  const getAvatarLetter = () => {
    if (!user || !user.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <View style={styles.loggedInContainer}>
      {/* Contenedor redondo del Avatar premium */}
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{getAvatarLetter()}</Text>
      </View>

      {/* Mensajes de bienvenida y datos del usuario */}
      <View style={styles.infoContainer}>
        <Text style={styles.welcomeTitle}>¡Hola de nuevo!</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Botón premium de Cerrar Sesión con redondeado de 22px */}
      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loggedInContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 32, // Espacio limpio y consistente
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // Forma circular perfecta
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: 'bold',
  },
  infoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
  },
  logoutButton: {
    width: '100%',
    height: 54,
    backgroundColor: Colors.background2,
    borderRadius: 22, // Redondeado unificado de 22px
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
  },
  logoutButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
