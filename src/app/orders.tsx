import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componente premium QR Code Vectorial
const QRCode = () => {
  return (
    <View style={styles.qrContainer}>
      {/* Finder Pattern Top-Left */}
      <View style={[styles.finderPattern, { top: 14, left: 14 }]}>
        <View style={styles.finderInner}>
          <View style={styles.finderCenter} />
        </View>
      </View>

      {/* Finder Pattern Top-Right */}
      <View style={[styles.finderPattern, { top: 14, right: 14 }]}>
        <View style={styles.finderInner}>
          <View style={styles.finderCenter} />
        </View>
      </View>

      {/* Finder Pattern Bottom-Left */}
      <View style={[styles.finderPattern, { bottom: 14, left: 14 }]}>
        <View style={styles.finderInner}>
          <View style={styles.finderCenter} />
        </View>
      </View>

      {/* QR Noise blocks to look completely authentic */}
      <View style={styles.qrGrid}>
        <View style={[styles.qrBlock, { top: 52, left: 110, width: 24, height: 8 }]} />
        <View style={[styles.qrBlock, { top: 64, left: 70, width: 8, height: 24 }]} />
        <View style={[styles.qrBlock, { top: 82, left: 95, width: 32, height: 8 }]} />
        <View style={[styles.qrBlock, { top: 42, left: 52, width: 8, height: 16 }]} />
        <View style={[styles.qrBlock, { top: 102, left: 42, width: 16, height: 16 }]} />
        <View style={[styles.qrBlock, { top: 114, left: 122, width: 16, height: 32 }]} />
        <View style={[styles.qrBlock, { top: 126, left: 82, width: 24, height: 8 }]} />
        <View style={[styles.qrBlock, { top: 92, left: 144, width: 8, height: 24 }]} />
        <View style={[styles.qrBlock, { top: 138, left: 138, width: 16, height: 8 }]} />
        <View style={[styles.qrBlock, { top: 72, left: 122, width: 8, height: 16 }]} />
        <View style={[styles.qrBlock, { top: 104, left: 104, width: 16, height: 8 }]} />
        <View style={[styles.qrBlock, { top: 62, left: 144, width: 16, height: 16 }]} />
        <View style={[styles.qrBlock, { top: 144, left: 52, width: 32, height: 8 }]} />
      </View>
    </View>
  );
};

export default function OrdersScreen() {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const orders = [
    { 
      id: 'ORD-8392', 
      date: '30 de Mayo, 2026', 
      total: '45,00 €', 
      status: 'Entregado', 
      icon: 'checkmark.circle.fill', 
      color: '#4CAF50',
      store: '🏀 Deportes al aire libre',
      items: [
        { name: 'Cuerda para saltar premium', quantity: 1, price: '15,00 €' },
        { name: 'Esterilla de yoga ecológica', quantity: 1, price: '30,00 €' }
      ]
    },
    { 
      id: 'ORD-7291', 
      date: '14 de Mayo, 2026', 
      total: '120,50 €', 
      status: 'Entregado', 
      icon: 'checkmark.circle.fill', 
      color: '#4CAF50',
      store: '💄 Cosmética ecológica',
      items: [
        { name: 'Crema facial hidratante bio', quantity: 2, price: '45,25 €' },
        { name: 'Sérum regenerador ecológico', quantity: 1, price: '30,00 €' }
      ]
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {selectedOrder ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.detailHeader}>
            <Pressable style={styles.backButton} onPress={() => setSelectedOrder(null)}>
              <SymbolView name="chevron.left" size={24} tintColor="#1C1C1E" />
            </Pressable>
            <Text style={styles.detailTitle}>Detalles del Pedido</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.qrCard}>
            <Text style={styles.qrCardTitle}>Código de Validación</Text>
            <Text style={styles.qrCardSub}>Muestra este código QR al comerciante en caja para verificar tu pedido y proceder con la entrega.</Text>
            
            <View style={styles.qrWrapper}>
              <QRCode />
            </View>

            <View style={styles.orderIdBadge}>
              <Text style={styles.orderIdBadgeText}>{selectedOrder.id}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Resumen del pedido</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Comercio</Text>
              <Text style={styles.infoValue}>{selectedOrder.store}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha de compra</Text>
              <Text style={styles.infoValue}>{selectedOrder.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estado</Text>
              <View style={styles.statusRow}>
                <SymbolView name={selectedOrder.icon} size={13} tintColor={selectedOrder.color} />
                <Text style={[styles.statusText, { color: selectedOrder.color, fontSize: 13 }]}>{selectedOrder.status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.productsCard}>
            <Text style={styles.infoCardTitle}>Artículos incluidos</Text>
            {selectedOrder.items.map((item: any, idx: number) => (
              <View key={idx} style={styles.productRow}>
                <View style={styles.productInfoCol}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productQty}>Cantidad: {item.quantity}</Text>
                </View>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total cobrado</Text>
              <Text style={styles.totalValue}>{selectedOrder.total}</Text>
            </View>
          </View>

          <Pressable style={styles.backSubmitButton} onPress={() => setSelectedOrder(null)}>
            <Text style={styles.backSubmitButtonText}>Volver a mis pedidos</Text>
          </Pressable>

        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.screenMainTitle}>Mis Pedidos</Text>
          
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

                  <Text style={styles.orderDetail}>Comercio: <Text style={styles.storeName}>{order.store}</Text></Text>
                  <Text style={styles.orderDetail}>Fecha: {order.date}</Text>
                  <Text style={styles.orderDetail}>Total: <Text style={styles.totalText}>{order.total}</Text></Text>

                  <Pressable style={styles.detailsButton} onPress={() => setSelectedOrder(order)}>
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
      )}
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
  screenMainTitle: {
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
  storeName: {
    fontWeight: '700',
    color: '#1C1C1E',
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
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

  // Estilos de la Vista Detallada de Pedidos
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
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
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.4,
  },
  qrCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  qrCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  qrCardSub: {
    fontSize: 12,
    color: '#707070',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#F5F5F7',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 16,
  },
  orderIdBadge: {
    backgroundColor: '#EAEAEA',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  orderIdBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#707070',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  productsCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 16,
    marginBottom: 20,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  productInfoCol: {
    flex: 1,
    paddingRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  productQty: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.accent,
  },
  backSubmitButton: {
    backgroundColor: Colors.accent,
    borderRadius: 22,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backSubmitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Estilos del QR Vectorial
  qrContainer: {
    width: 170,
    height: 170,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  finderPattern: {
    width: 32,
    height: 32,
    borderWidth: 5,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  finderInner: {
    width: 14,
    height: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finderCenter: {
    width: 8,
    height: 8,
    backgroundColor: '#000000',
  },
  qrGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  qrBlock: {
    position: 'absolute',
    backgroundColor: '#000000',
  },
});

