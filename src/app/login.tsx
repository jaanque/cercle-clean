import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import LoginForm from '@/components/profileScreen/login/login-form';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

/**
 * LoginScreen - Pantalla de inicio de sesión con escudo de navegación (Route Guard).
 * Evita accesos redundantes redirigiendo automáticamente si hay una sesión activa.
 */
export default function LoginScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Escudo de navegación (Route Guard)
  useEffect(() => {
    if (user) {
      router.replace('/profile');
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LoginForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
