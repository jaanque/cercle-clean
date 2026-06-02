import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import ProfileActions from '@/components/profileScreen/guest/profile-actions';
import ProfileContent from '@/components/profileScreen/guest/profile-content';
import ProfileLogged from '@/components/profileScreen/logged/profile-logged';
import ProfileSkeleton from '@/components/skeletons/profileSkeleton';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

/**
 * ProfileScreen - Pantalla principal de Perfil de usuario.
 * Utiliza el AuthProvider global para renderizar condicionalmente
 * los componentes visuales de visita (guest) o de usuario autenticado (logged).
 */
export default function ProfileScreen() {
  const { user, isLoading } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Contenido dinámico o de Carga */}
        <View style={[styles.dynamicContent, user && { justifyContent: 'flex-start', paddingTop: 20 }]}>
          {isLoading ? (
            // Loader de carga premium animado
            <ProfileSkeleton />
          ) : user ? (
            // Componente modularizado para Usuario Autenticado
            <ProfileLogged />
          ) : (
            // Componentes modularizados para Invitado (Guest)
            <View style={styles.guestContainer}>
              <ProfileContent />
              <ProfileActions />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dynamicContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  guestContainer: {
    width: '100%',
    alignItems: 'center',
  },
});