import React from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';

/**
 * ProfileLogged - Interfaz premium de Usuario Autenticado.
 * Muestra el perfil clásico con opciones navegables y detalles del usuario.
 */
export default function ProfileLogged() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Obtiene la primera letra del correo en mayúscula para el Avatar
  const getAvatarLetter = () => {
    if (!user || !user.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const getUsername = () => {
    if (!user || !user.email) return 'Usuario';
    return user.email.split('@')[0];
  };

  const handlePersonalInfo = () => {
    Alert.alert('Información Personal', `Correo electrónico:\n${user?.email || 'No disponible'}`);
  };

  const handleSupport = () => {
    Alert.alert('Ayuda y Soporte', 'Para cualquier consulta, escríbenos a:\nsoporte@cercle.app');
  };

  const menuItems = [
    {
      title: 'Mis pedidos',
      icon: 'bag.fill',
      onPress: () => router.push('/orders'),
    },
    {
      title: 'Mis sellos',
      icon: 'seal.fill',
      onPress: () => router.push('/stamps'),
    },
    {
      title: 'Información personal',
      icon: 'person.fill',
      onPress: handlePersonalInfo,
    },
    {
      title: 'Ayuda y soporte',
      icon: 'questionmark.circle.fill',
      onPress: handleSupport,
    },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Tarjeta de Usuario Premium */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{getAvatarLetter()}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{getUsername()}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      {/* 2. Menú de Opciones Clásicas */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
              index === 0 && styles.firstMenuItem,
              index === menuItems.length - 1 && styles.lastMenuItem,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconWrapper}>
                <SymbolView name={item.icon as any} size={18} tintColor={Colors.accent} />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <SymbolView name={"chevron.right" as any} size={14} tintColor="#A0A0A0" />
          </Pressable>
        ))}
      </View>

      {/* 3. Botón de Cerrar Sesión */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }
        ]}
        onPress={signOut}
      >
        <SymbolView name={"power" as any} size={16} tintColor="#EF4444" style={{ marginRight: 8 }} />
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background2,
    borderRadius: 22, // Strict 22px design system constraint
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: 10,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  menuContainer: {
    backgroundColor: Colors.background2,
    borderRadius: 22, // Strict 22px design system constraint
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuItemPressed: {
    backgroundColor: '#F8FAFC',
  },
  firstMenuItem: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  logoutButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FEF2F2',
    borderRadius: 22, // Strict 22px design system constraint
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '800',
  },
});
