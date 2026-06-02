import React from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';

/**
 * ProfileLogged - Interfaz premium de Usuario Autenticado.
 * Muestra el perfil clásico con secciones navegables y detalles del usuario.
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

  const sections = [
    {
      title: 'Mi Actividad',
      items: [
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
      ]
    },
    {
      title: 'Mi Perfil',
      items: [
        {
          title: 'Información personal',
          icon: 'person.fill',
          onPress: handlePersonalInfo,
        },
        {
          title: 'Métodos de pago',
          icon: 'creditcard.fill',
          onPress: () => Alert.alert('Métodos de Pago', 'Próximamente podrás gestionar tus tarjetas aquí.'),
        },
        {
          title: 'Direcciones guardadas',
          icon: 'mappin.and.ellipse',
          onPress: () => Alert.alert('Direcciones', 'Próximamente podrás gestionar tus direcciones de envío.'),
        },
      ]
    },
    {
      title: 'Ajustes',
      items: [
        {
          title: 'Notificaciones',
          icon: 'bell.fill',
          onPress: () => Alert.alert('Notificaciones', 'Puedes gestionar las notificaciones de la app desde los ajustes del sistema.'),
        },
      ]
    },
    {
      title: 'Soporte y Legal',
      items: [
        {
          title: 'Ayuda y soporte',
          icon: 'questionmark.circle.fill',
          onPress: handleSupport,
        },
        {
          title: 'Términos y condiciones',
          icon: 'doc.text.fill',
          onPress: () => Alert.alert('Términos y Condiciones', 'Términos de servicio de Cercle...'),
        },
      ]
    }
  ];

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
    >
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

      {/* 2. Secciones del menú */}
      {sections.map((section, secIdx) => (
        <View key={secIdx} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.menuContainer}>
            {section.items.map((item, itemIdx) => {
              const isFirst = itemIdx === 0;
              const isLast = itemIdx === section.items.length - 1;
              return (
                <Pressable
                  key={itemIdx}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                    isFirst && styles.firstMenuItem,
                    isLast && styles.lastMenuItem,
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemLeft}>
                    <SymbolView name={item.icon as any} size={18} tintColor={Colors.accent} style={styles.menuItemIcon} />
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <SymbolView name={"chevron.right" as any} size={14} tintColor="#A0A0A0" />
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 120, // Prevent overlapping with bottom navigation bar
    gap: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 10,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 22, // Strict 22px design system constraint
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
  sectionContainer: {
    width: '100%',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingLeft: 4,
  },
  menuContainer: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  menuItemPressed: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  firstMenuItem: {},
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 22, // Strict 22px design system constraint
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 8,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  logoutButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 22, // Strict 22px design system constraint
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '800',
  },
});
