import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { z } from 'zod';
import { Colors } from '@/constants/theme';
import { supabaseAuth } from '@/lib/supabase/supabase';

// Sanitizador avanzado nivel Bestia contra SQL Injection, NoSQL Injection y XSS
const sanitizeInput = (val: string): string => {
  return val
    .replace(/['"`;\\-]/g, '') // Elimina comillas, punto y coma, barras diagonales inversas y guiones de comentarios SQL
    .replace(/[<>]/g, '');     // Filtra corchetes angulares para neutralizar XSS
};

// Esquema Zod de Validación Estricta para Registro
const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(50, { message: 'El nombre no puede superar los 50 caracteres.' }),
  email: z
    .string()
    .trim()
    .email({ message: 'El formato del correo electrónico es inválido.' })
    .max(100, { message: 'El correo electrónico no puede superar los 100 caracteres.' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    .max(64, { message: 'La contraseña no puede superar los 64 caracteres.' }),
});

/**
 * RegisterForm - Formulario de registro de usuario premium y responsivo.
 * Sigue la guía de estilos con bordes de 22px y espaciados consistentes.
 */
export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Sanitización inicial de todas las entradas
    const cleanName = sanitizeInput(name.trim());
    const cleanEmail = sanitizeInput(email.trim());
    const cleanPassword = sanitizeInput(password);

    // Validación extrema con Zod
    const validationResult = registerSchema.safeParse({
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
    });

    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues[0].message;
      Alert.alert('Entrada no válida', errorMsg);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabaseAuth.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            full_name: cleanName,
          },
        },
      });

      if (error) {
        let errorMsg = 'Hubo un problema al crear tu cuenta. Por favor, inténtalo de nuevo.';
        // Evaluamos códigos de error estandarizados y HTTP status para una robustez total
        if (error.status === 422 && (error.code === 'user_already_exists' || error.message.toLowerCase().includes('exists') || error.message.toLowerCase().includes('registered'))) {
          errorMsg = 'Este correo electrónico ya está registrado.';
        } else if (error.status === 400 && (error.code === 'validation_failed' || error.message.toLowerCase().includes('email'))) {
          errorMsg = 'El formato del correo electrónico no es válido.';
        } else if (error.status === 400 && error.message.toLowerCase().includes('password')) {
          errorMsg = 'La contraseña es demasiado corta (mínimo 6 caracteres).';
        } else if (!error.status) {
          errorMsg = 'Error de conexión de red. Revisa tu internet.';
        }
        Alert.alert('Error de registro', errorMsg);
        setLoading(false);
      } else {
        Alert.alert('¡Cuenta creada!', '¡Te has registrado con éxito!', [
          {
            text: 'OK',
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/profile');
              }
            }
          }
        ]);
      }
    } catch (err: unknown) {
      Alert.alert('Error', 'Ocurrió un error inesperado al intentar crear la cuenta.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón superior de regreso y título */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <SymbolView name="chevron.left" size={20} tintColor="#1C1C1E" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Cuenta</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Comienza ahora</Text>
        <Text style={styles.subtitle}>Crea tu cuenta de CercleApp en unos simples pasos.</Text>

        {/* Inputs */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Juan Pérez"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="•••••••• (mín. 6 caracteres)"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Botón de envío */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Enlace para alternar al login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.footerLink}>Inicia sesión aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    gap: 20, // Espaciado vertical consistente de 20px
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  input: {
    height: 54,
    backgroundColor: Colors.background2,
    borderRadius: 22, // Redondeado unificado de 22px
    paddingHorizontal: 20,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  submitButton: {
    height: 54,
    backgroundColor: Colors.accent,
    borderRadius: 22, // Redondeado unificado de 22px
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  footerLink: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: 'bold',
  },
});
