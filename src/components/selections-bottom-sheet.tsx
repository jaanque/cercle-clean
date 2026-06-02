import { SymbolView } from 'expo-symbols';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SelectionsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const ITEMS = [
  {
    emoji: '💄',
    title: 'Cosmética Natural y Belleza',
    desc: 'Productos seleccionados con ingredientes orgánicos y cruelty-free para tu cuidado diario.',
  },
  {
    emoji: '🎧',
    title: 'Tecnología Inteligente',
    desc: 'Dispositivos de última generación, wearables y accesorios de audio de alta fidelidad.',
  },
  {
    emoji: '🌱',
    title: 'Bienestar Sostenible',
    desc: 'Alternativas eco-friendly y gadgets diseñados para mejorar tu calidad de vida y cuidar el planeta.',
  },
  {
    emoji: '✨',
    title: 'Ediciones Limitadas',
    desc: 'Acceso exclusivo a colaboraciones especiales y lanzamientos con stock súper reducido.',
  },
];

export function SelectionsBottomSheet({ visible, onClose }: SelectionsBottomSheetProps) {
  const [showModal, setShowModal] = useState(visible);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Gesture responder for dragging sheet down to close
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Highly sensitive downward drag detection
        return gestureState.dy > 4;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.4) {
          handleClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 340,
          easing: Easing.out(Easing.bezier(0.25, 1, 0.5, 1)),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      handleClose();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      onClose();
    });
  };

  if (!showModal) return null;

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={styles.dismissArea} onPress={handleClose} />
        </Animated.View>

        {/* Sheet */}
        <Animated.View 
          {...panResponder.panHandlers} 
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* Close button top right */}
          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
            onPress={handleClose}
          >
            <SymbolView name="xmark" size={12} tintColor={Colors.accent} />
          </Pressable>

          <View style={styles.scrollContent}>
            {/* Header with Custom Selection Style */}
            <View style={styles.headerContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>SELECCIONES</Text>
              </View>
              <Text style={styles.titleText}>Queridas para ti</Text>
              <Text style={styles.subtitleText}>Belleza y tecnología a tu alcance</Text>
            </View>

            {/* Curated list */}
            <View style={styles.itemsContainer}>
              {ITEMS.map((item, i) => (
                <View key={i} style={styles.itemRow}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  </View>
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Premium CTA Button */}
            <Pressable
              style={({ pressed }) => [
                styles.ctaBtn,
                pressed && { opacity: 0.94, transform: [{ scale: 0.985 }] },
              ]}
              onPress={handleClose}
            >
              <Text style={styles.ctaBtnText}>Explorar Colección</Text>
            </Pressable>
          </View>

          {/* Home indicator padding/safe area */}
          <View style={styles.safeAreaPadding} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 30, 0, 0.45)',
  },
  dismissArea: { flex: 1 },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 24,
    shadowColor: '#0F1E00',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  draggableArea: {
    width: '100%',
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 16,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(72, 110, 60, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    width: '100%',
  },
  badge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    transform: [{ rotate: '-4deg' }],
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F1E00',
    letterSpacing: -0.8,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(15, 30, 0, 0.6)',
    marginTop: 4,
  },
  itemsContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 32,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(72, 110, 60, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemEmoji: {
    fontSize: 22,
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 11, // Perfect mathematical center alignment with the 44px icon circle!
  },
  itemTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F1E00',
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 18,
  },
  ctaBtn: {
    backgroundColor: Colors.accent,
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  ctaBtnText: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#ffffff',
  },
  safeAreaPadding: {
    height: 34,
  },
});
