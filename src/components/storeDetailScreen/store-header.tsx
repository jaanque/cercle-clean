import React from 'react';
import { View, StyleSheet, Image, Pressable, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';

interface StoreHeaderProps {
  name: string;
  image: string;
  logo?: string;
}

/**
 * StoreHeader - Cabecera premium inmersiva según la referencia de diseño de alta fidelidad.
 * - Cuenta con botones circulares translúcidos superpuestos en la imagen.
 * - Integra un avatar de comercio flotante (circular con borde blanco) centrado en el borde inferior.
 */
export default function StoreHeader({ name, image, logo }: StoreHeaderProps) {
  const router = useRouter();
  
  // Usar la imagen de la tienda como logotipo si no se proporciona uno específico
  const logoUri = logo || image;

  return (
    <View style={styles.container}>
      {/* Banner de la tienda */}
      <Image source={{ uri: image }} style={styles.bannerImage} />

      {/* Capa translúcida superior para mejor contraste de los botones */}
      <View style={styles.topGradient} />

      {/* Botón Volver (Izquierda) */}
      <Pressable style={styles.circularButtonLeft} onPress={() => router.back()}>
        <SymbolView
          name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
          size={20}
          tintColor="#ffffff"
          weight="bold"
        />
      </Pressable>

      {/* Fila de Botones de Acción (Derecha) */}
      <View style={styles.rightActionsContainer}>
        <Pressable style={styles.circularButtonRight}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={18}
            tintColor="#ffffff"
            weight="bold"
          />
        </Pressable>

        <Pressable style={styles.circularButtonRight}>
          <SymbolView
            name={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
            size={18}
            tintColor="#ffffff"
            weight="bold"
          />
        </Pressable>

        <Pressable style={styles.circularButtonRight}>
          <SymbolView
            name={{ ios: 'ellipsis', android: 'more_vert', web: 'more_vert' }}
            size={18}
            tintColor="#ffffff"
            weight="bold"
          />
        </Pressable>
      </View>

      {/* Logotipo/Avatar Flotante Central Inferior */}
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: logoUri }} style={styles.avatarImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220, // Altura inmersiva óptima para albergar el avatar
    position: 'relative',
    backgroundColor: '#ffffff',
    marginBottom: 55, // Espacio suficiente para albergar la mitad inferior del avatar flotante
  },
  bannerImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 100 : 70,
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Capa sutil superior
  },
  circularButtonLeft: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  rightActionsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 99,
  },
  circularButtonRight: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -45, // Mitad fuera del banner
    alignSelf: 'center',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    zIndex: 100,
    // Sombra premium muy suave
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
