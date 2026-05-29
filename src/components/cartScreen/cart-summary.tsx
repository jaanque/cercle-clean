import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface CartSummaryProps {
  subtotal: number;
}

/**
 * CartSummary - Desglose de precios del carrito (Subtotal, Gastos de envío, Total).
 * - Utiliza estrictamente el redondeado de 22px y colores oficiales de la app.
 */
export default function CartSummary({ subtotal }: CartSummaryProps) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total del pedido</Text>
        <Text style={styles.totalVal}>{subtotal.toFixed(2)} €</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: Colors.background1,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 22, // Redondeado corporativo a 22px
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryVal: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  summaryValGreen: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: '600',
  },
  totalDivider: {
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
});
