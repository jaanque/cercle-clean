import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

interface CartFooterProps {
  onPay?: () => void;
  onSelectPaymentMethod?: () => void;
  paymentMethodText?: string;
  isPaying?: boolean;
}

export default function CartFooter({ onPay, onSelectPaymentMethod, paymentMethodText = 'Pago con Tarjeta •••• 4242', isPaying = false }: CartFooterProps) {
  const isApplePay = paymentMethodText.includes('Apple');
  const isCash = paymentMethodText.includes('Efectivo');

  return (
    <View style={styles.footerContainer}>
      {/* Banner fino e interactivo de método de pago */}
      <Pressable 
        style={({ pressed }) => [styles.paymentMethodBanner, pressed && { opacity: 0.85 }]}
        onPress={onSelectPaymentMethod}
        disabled={isPaying}
      >
        <View style={styles.paymentMethodLeft}>
          <SymbolView 
            name={
              isApplePay 
                ? { ios: 'apple.logo', android: 'payment', web: 'credit_card' }
                : isCash 
                ? { ios: 'banknote.fill', android: 'payments', web: 'credit_card' }
                : { ios: 'creditcard.fill', android: 'credit_card', web: 'credit_card' }
            } 
            size={14} 
            tintColor={Colors.accent} 
          />
          <Text style={styles.paymentMethodText}>{paymentMethodText}</Text>
        </View>
        <SymbolView 
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} 
          size={11} 
          tintColor="#999999" 
        />
      </Pressable>

      <Pressable 
        style={({ pressed }) => [
          styles.payButton, 
          (pressed || isPaying) && { opacity: 0.9 }
        ]}
        onPress={onPay}
        disabled={isPaying}
      >
        {isPaying ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.payButtonText}>Continuar al pago</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background1,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  paymentMethodBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background2, // Gris oficial de la app #F7F7F7
    borderRadius: 22, // Redondeado corporativo unificado a 22px
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentMethodText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
  },
  payButton: {
    height: 54,
    backgroundColor: Colors.accent, // Color corporativo oficial burdeos #5B2333
    borderRadius: 22, // Redondeado corporativo a 22px
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
