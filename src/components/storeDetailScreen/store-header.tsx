import React from 'react';
import { View, StyleSheet, Text, ImageBackground, Pressable, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';

interface StoreHeaderProps {
  name: string;
  image: string;
}

/**
 * StoreHeader - Cabecera premium y estática estándar para la pantalla de detalle de tienda.
 * Posiciona el botón volver con coordenadas absolutas de forma robusta e independiente de SafeAreas.
 */
export default function StoreHeader({ name, image }: StoreHeaderProps) {
  const router = useRouter();

  return (
    <ImageBackground source={{ uri: image }} style={styles.imageBackground}>
      {/* Capa de degradado oscuro inferior para legibilidad del texto blanco */}
      <View style={styles.gradientOverlay} />

      {/* Botón Volver Flotante Absoluto (Garantiza posición exacta e independiente) */}
      <Pressable style={styles.absoluteBackButton} onPress={() => router.back()}>
        <SymbolView
          name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
          size={20}
          tintColor="#333333"
          weight="bold"
        />
      </Pressable>

      {/* Información superpuesta al final de la imagen */}
      <View style={styles.bottomInfoContainer}>
        <Text style={styles.storeName}>{name}</Text>
        <Pressable style={styles.moreInfoRow}>
          <Text style={styles.moreInfoText}>Más información</Text>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={12}
            tintColor="#ffffff"
          />
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: 200, // Alto premium delgado solicitado
    justifyContent: 'flex-end',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Sombra general para realzar textos y botones
  },
  absoluteBackButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16, // Altura precisa ideal en iOS para librar la barra horaria y Android estándar
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    // Sombra premium suave para dar profundidad
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  bottomInfoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 4,
  },
  storeName: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  moreInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moreInfoText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
});
