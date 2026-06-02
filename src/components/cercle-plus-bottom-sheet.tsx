import { SymbolView } from 'expo-symbols';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CerclePlusBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const BENEFITS = [
  {
    emoji: '🚕',
    title: '0 € en tasas de gestión',
    desc: 'Sin tarifas añadidas en tus reservas. Ahorro inmediato en cada compra.',
  },
  {
    emoji: '🛍️',
    title: '5% de reembolso en reservas',
    desc: 'Acumula saldo en tu billetera Cercle al recoger tus artículos.',
  },
  {
    emoji: '💎',
    title: 'Ofertas y acceso exclusivo',
    desc: 'Acceso anticipado a liquidaciones flash y promociones especiales.',
  },
  {
    emoji: '🏷️',
    title: 'Menores comisiones de servicio',
    desc: 'Descuentos garantizados y ventajas exclusivas en tiendas asociadas.',
  },
];

export function CerclePlusBottomSheet({ visible, onClose }: CerclePlusBottomSheetProps) {
  const [showModal, setShowModal] = useState(visible);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Gesture responder for dragging sheet down to close
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Active when user drags down by more than 8 pixels
        return gestureState.dy > 8;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          // Bounce back to fully open state
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

  const handleTrial = () => {
    handleClose();
    setTimeout(() => {
      Alert.alert(
        '¡Bienvenido a Cercle+! 🎉',
        'Tu prueba gratuita de 30 días ha comenzado. Ya disfrutas de todos los beneficios Plus.',
        [{ text: 'Empezar a ahorrar', style: 'default' }]
      );
    }, 350);
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
            <SymbolView name="xmark" size={12} tintColor="#6B7280" />
          </Pressable>

          <View style={styles.scrollContent}>
            {/* Header / Logo section */}
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>CERCLE</Text>
              <View style={styles.plusBadge}>
                <Text style={styles.plusText}>+</Text>
              </View>
            </View>
            
            <Text style={styles.subtitle}>¡Pruébalo gratis 30 días!</Text>

            {/* Vertical benefits list */}
            <View style={styles.benefitsContainer}>
              {BENEFITS.map((benefit, i) => (
                <View key={i} style={styles.benefitRow}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.benefitEmoji}>{benefit.emoji}</Text>
                  </View>
                  <View style={styles.benefitTextContainer}>
                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                    <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Sub terms legal text */}
            <Text style={styles.termsText}>
              Las ventajas se aplican a pedidos elegibles de tiendas participantes. Al registrarte en la prueba de "30 días gratis", aceptas que si no cancelas antes de que termine el periodo de prueba, Cercle te cobrará la tarifa mensual vigente (actualmente 9,99 €/mes) más impuestos aplicables cada mes hasta que canceles. Cancela en cualquier momento. Ver{' '}
              <Text style={styles.termsLink}>Condiciones de suscripción</Text>.
            </Text>

            {/* Pricing Section */}
            <View style={styles.pricingRow}>
              <Text style={styles.priceCrossed}>9,99 €/mes</Text>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>¡30 días gratis!</Text>
              </View>
            </View>

            {/* Main CTA Button with dynamic scale on press */}
            <Pressable
              style={({ pressed }) => [
                styles.ctaBtn,
                pressed && { opacity: 0.94, transform: [{ scale: 0.985 }] },
              ]}
              onPress={handleTrial}
            >
              <Text style={styles.ctaBtnText}>Probar 30 días gratis</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  dismissArea: { flex: 1 },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 24,
    shadowColor: '#0F172A',
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
    marginBottom: 0,
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
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 6,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -1.2,
  },
  plusBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 12,
    transform: [{ rotate: '-12deg' }],
  },
  plusText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 28,
    letterSpacing: -0.3,
  },
  benefitsContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 28,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(91, 35, 51, 0.08)', // Beautiful theme-colored tinted background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitEmoji: {
    fontSize: 22,
  },
  benefitTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 11, // Perfect mathematical center alignment with the 44px icon circle!
  },
  benefitTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 18,
  },
  termsText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#94A3B8',
    lineHeight: 16.5,
    textAlign: 'center',
    paddingHorizontal: 6,
    marginBottom: 28,
  },
  termsLink: {
    color: '#64748B',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 22,
  },
  priceCrossed: {
    fontSize: 17,
    fontWeight: '600',
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  freeBadge: {
    backgroundColor: 'rgba(91, 35, 51, 0.08)', // Harmonized matching theme badge background
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 30, 0, 0.15)',
  },
  freeBadgeText: {
    color: Colors.accent, // Matching brand color
    fontWeight: '700',
    fontSize: 14,
  },
  ctaBtn: {
    backgroundColor: Colors.accent, // Premium wine brand color
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  ctaBtnText: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#ffffff',
  },
  safeAreaPadding: {
    height: 34,
  },
});

