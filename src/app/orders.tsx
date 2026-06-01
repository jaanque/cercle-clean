import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrdersScreen() {
  const orders = [
    { id: 'ORD-8392', date: '30 de Mayo, 2026', total: '45,00 €', status: 'Entregado', icon: 'checkmark.circle.fill', color: '#4CAF50' },
    { id: 'ORD-7291', date: '14 de Mayo, 2026', total: '120,50 €', status: 'Entregado', icon: 'checkmark.circle.fill', color: '#4CAF50' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {orders.length > 0 ? (
          <View style={styles.listContainer}>
            {orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <View style={styles.statusRow}>
                    <SymbolView name={order.icon as any} size={14} tintColor={order.color} />
                    <Text style={[styles.statusText, { color: order.color }]}>{order.status}</Text>
                  </View>
                </View>

                <Text style={styles.orderDetail}>Fecha: {order.date}</Text>
                <Text style={styles.orderDetail}>Total: <Text style={styles.totalText}>{order.total}</Text></Text>

                <Pressable style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Ver detalles</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <SymbolView name={"bag.badge.minus" as any} size={60} tintColor="#CCCCCC" />
            <Text style={styles.emptyText}>Aún no tienes pedidos</Text>
            <Text style={styles.emptySubtext}>Los pedidos que realices aparecerán aquí.</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110, // Espacio para el menú inferior
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  listContainer: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 22, // Bordes estrictamente a 22px
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    gap: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    paddingBottom: 10,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  orderDetail: {
    fontSize: 14,
    color: '#707070',
    fontWeight: '500',
  },
  totalText: {
    fontWeight: '800',
    color: Colors.text,
  },
  detailsButton: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
