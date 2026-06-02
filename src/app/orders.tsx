import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, Alert, Share, LayoutAnimation } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrdersSkeleton from '@/components/skeletons/ordersSkeleton';

// Componente premium QR Code Vectorial (Altamente Comprimido)
const QRCode = () => {
  return (
    <View style={styles.qrContainer}>
      {/* Finder Pattern Top-Left */}
      <View style={[styles.finderPattern, { top: 8, left: 8 }]}>
        <View style={styles.finderInner}>
          <View style={styles.finderCenter} />
        </View>
      </View>

      {/* Finder Pattern Top-Right */}
      <View style={[styles.finderPattern, { top: 8, right: 8 }]}>
        <View style={styles.finderInner}>
          <View style={styles.finderCenter} />
        </View>
      </View>

      {/* Finder Pattern Bottom-Left */}
      <View style={[styles.finderPattern, { bottom: 8, left: 8 }]}>
        <View style={styles.finderInner}>
          <View style={styles.finderCenter} />
        </View>
      </View>

      {/* QR Noise blocks scaled to fit 120x120 */}
      <View style={styles.qrGrid}>
        <View style={[styles.qrBlock, { top: 36, left: 78, width: 18, height: 6 }]} />
        <View style={[styles.qrBlock, { top: 45, left: 50, width: 6, height: 18 }]} />
        <View style={[styles.qrBlock, { top: 58, left: 67, width: 22, height: 6 }]} />
        <View style={[styles.qrBlock, { top: 30, left: 36, width: 6, height: 12 }]} />
        <View style={[styles.qrBlock, { top: 72, left: 30, width: 12, height: 12 }]} />
        <View style={[styles.qrBlock, { top: 80, left: 86, width: 12, height: 22 }]} />
        <View style={[styles.qrBlock, { top: 90, left: 58, width: 18, height: 6 }]} />
        <View style={[styles.qrBlock, { top: 65, left: 102, width: 6, height: 18 }]} />
        <View style={[styles.qrBlock, { top: 98, left: 98, width: 12, height: 6 }]} />
        <View style={[styles.qrBlock, { top: 50, left: 86, width: 6, height: 12 }]} />
        <View style={[styles.qrBlock, { top: 73, left: 73, width: 12, height: 6 }]} />
        <View style={[styles.qrBlock, { top: 44, left: 102, width: 12, height: 12 }]} />
        <View style={[styles.qrBlock, { top: 102, left: 36, width: 22, height: 6 }]} />
      </View>
    </View>
  );
};

export default function OrdersScreen() {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState('7d');
  const [loading, setLoading] = useState(true);

  // Simular carga de datos para el skeleton loader premium
  useEffect(() => {
    const timer = setTimeout(() => {
      // Usar LayoutAnimation para que la aparición de la lista sea súper fluida
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // Animar la transición del selector cuando cambie el filtro activo
  useEffect(() => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.76, // rebote elástico sumamente pulido y satisfactorio
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        duration: 0,
      },
    });
  }, [activeFilter]);

  const orders = [
    { 
      id: 'ORD-8392', 
      date: '30 de Mayo, 2026', 
      total: '45,00 €', 
      status: 'Entregado', 
      icon: 'checkmark.circle.fill', 
      color: '#4CAF50',
      store: 'Deportes al aire libre',
      storeEmoji: '🏀',
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
      store: 'Cosmética ecológica',
      storeEmoji: '💄',
      items: [
        { name: 'Crema facial hidratante bio', quantity: 2, price: '45,25 €' },
        { name: 'Sérum regenerador ecológico', quantity: 1, price: '30,00 €' }
      ]
    },
  ];

  const handleShare = async (order: any) => {
    try {
      await Share.share({
        message: `Detalles del pedido ${order.id} en Cercle. Total: ${order.total} de ${order.store}.`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyId = (orderId: string) => {
    Alert.alert('Copiado', `El ID del pedido ${orderId} se ha copiado al portapapeles.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {loading ? (
        <OrdersSkeleton />
      ) : selectedOrder ? (
        <View style={{ flex: 1 }}>
          {/* Header Superior Premium (Fijo) */}
          <View style={styles.detailHeaderFixed}>
            <Pressable style={styles.backButton} onPress={() => setSelectedOrder(null)}>
              <SymbolView name="chevron.left" size={20} tintColor="#1C1C1E" weight="bold" />
            </Pressable>
            <Text style={styles.detailTitle}>Detalles del Pedido</Text>
            <Pressable style={styles.backButton} onPress={() => handleShare(selectedOrder)}>
              <SymbolView name="square.and.arrow.up" size={18} tintColor="#1C1C1E" weight="bold" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Ticket de Compra Estilo Wallet */}
          <View style={styles.ticketCard}>
            {/* Cabecera del Ticket */}
            <View style={styles.ticketHeader}>
              <View style={styles.ticketStoreBadge}>
                <Text style={styles.storeEmoji}>{selectedOrder.storeEmoji || '📦'}</Text>
                <View>
                  <Text style={styles.ticketStoreName}>{selectedOrder.store}</Text>
                  <Text style={styles.ticketDate}>{selectedOrder.date}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${selectedOrder.color}15` }]}>
                <View style={[styles.statusDot, { backgroundColor: selectedOrder.color }]} />
                <Text style={[styles.statusBadgeText, { color: selectedOrder.color }]}>
                  {selectedOrder.status}
                </Text>
              </View>
            </View>

            {/* Separador de corte físico */}
            <View style={styles.ticketDividerWrapper}>
              <View style={styles.ticketDividerBgTop} />
              <View style={styles.ticketDividerBgBottom} />
              <View style={styles.ticketCutoutLeft} />
              <View style={styles.ticketDashedLine} />
              <View style={styles.ticketCutoutRight} />
            </View>

            {/* QR de Validación y Código al lado */}
            <View style={styles.ticketBodyRow}>
              <View style={styles.qrWrapper}>
                <QRCode />
              </View>

              <View style={styles.codeColumn}>
                <Text style={styles.codeLabel}>Código de recogida</Text>
                {/* ID de Pedido Copiable */}
                <Pressable style={styles.orderIdBadge} onPress={() => handleCopyId(selectedOrder.id)}>
                  <Text style={styles.orderIdBadgeText}>{selectedOrder.id}</Text>
                  <SymbolView name="doc.on.doc" size={14} tintColor="#1C1C1E" />
                </Pressable>
              </View>
            </View>

            {/* Divisor de items estilo precorte */}
            <View style={styles.ticketThinDivider} />

            {/* Listado de Artículos dentro del mismo Ticket */}
            <View style={styles.ticketProductsSection}>
              <Text style={styles.productsTitle}>Artículos</Text>
              {selectedOrder.items.map((item: any, idx: number) => (
                <View key={idx} style={styles.productRow}>
                  <View style={styles.productInfoCol}>
                    <Text style={styles.productName} numberOfLines={2}>
                      <Text style={styles.productQtyInline}>{item.quantity}x</Text>
                      <Text style={styles.productDividerDot}>  •  </Text>
                      {item.name}
                    </Text>
                  </View>
                  <Text style={styles.productPrice}>{item.price}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{selectedOrder.total}</Text>
              </View>
            </View>
          </View>

          {/* Accesos Rápidos de UX Perfecta */}
          <View style={styles.actionShortcuts}>
            <Pressable 
              style={styles.shortcutButton}
              onPress={() => Alert.alert('Llamar', `Llamando al comercio ${selectedOrder.store}...`)}
            >
              <View style={styles.shortcutIconBg}>
                <SymbolView name="phone.fill" size={16} tintColor={Colors.accent} />
              </View>
              <Text style={styles.shortcutText}>Llamar</Text>
            </Pressable>

            <Pressable 
              style={styles.shortcutButton}
              onPress={() => Alert.alert('Direcciones', 'Abriendo ubicación en el mapa...')}
            >
              <View style={styles.shortcutIconBg}>
                <SymbolView name="map.fill" size={16} tintColor={Colors.accent} />
              </View>
              <Text style={styles.shortcutText}>Cómo llegar</Text>
            </Pressable>

            <Pressable 
              style={styles.shortcutButton}
              onPress={() => Alert.alert('Ayuda', 'Conectando con el soporte de Cercle...')}
            >
              <View style={styles.shortcutIconBg}>
                <SymbolView name="questionmark.circle.fill" size={16} tintColor={Colors.accent} />
              </View>
              <Text style={styles.shortcutText}>Ayuda</Text>
            </Pressable>
          </View>

          <Pressable style={styles.backSubmitButton} onPress={() => setSelectedOrder(null)}>
            <Text style={styles.backSubmitButtonText}>Volver a mis pedidos</Text>
          </Pressable>

        </ScrollView>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Control Segmentado Fijo (UX Impecable con Deslizamiento Físico) */}
          <View style={styles.segmentedContainer}>
            {/* Cápsula de Fondo Deslizante Absoluta */}
            <View style={[
              styles.segmentedActiveBg,
              activeFilter === '24h' && { left: '0.5%' },
              activeFilter === '7d' && { left: '25.5%' },
              activeFilter === '15d' && { left: '50.5%' },
              activeFilter === 'custom' && { left: '75.5%' },
            ]} />

            {[
              { label: '24h', value: '24h' },
              { label: '7d', value: '7d' },
              { label: '15d', value: '15d' },
              { label: 'Elegir 🗓️', value: 'custom' },
            ].map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <Pressable
                  key={filter.value}
                  style={styles.segmentedTab}
                  onPress={() => {
                    setActiveFilter(filter.value);
                    if (filter.value === 'custom') {
                      Alert.alert('Filtro Personalizado', 'En el futuro podrás seleccionar tu rango de fechas.');
                    }
                  }}
                >
                  <Text style={[styles.segmentedTabText, isActive && styles.activeSegmentedTabText]}>
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentList}>
            {orders.length > 0 ? (
              <View style={styles.listContainer}>
                {orders.map((order) => (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderId}>{order.id}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: `${order.color}15` }]}>
                        <View style={[styles.statusDot, { backgroundColor: order.color }]} />
                        <Text style={[styles.statusBadgeText, { color: order.color }]}>{order.status}</Text>
                      </View>
                    </View>

                    <Text style={styles.orderDetail}>Comercio: <Text style={styles.storeName}>{order.storeEmoji || '📦'} {order.store}</Text></Text>
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
        </View>
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
  scrollContentList: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 3,
    marginHorizontal: 20,
    marginVertical: 12,
    height: 42,
    alignItems: 'center',
  },
  segmentedTab: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
  },
  segmentedActiveBg: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    width: '24%',
    borderRadius: 11,
    backgroundColor: '#ffffff',
  },
  segmentedTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#707070',
  },
  activeSegmentedTabText: {
    color: Colors.accent,
    fontWeight: '800',
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
    backgroundColor: '#F7F7F9',
    borderRadius: 22,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
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
  detailHeaderFixed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    zIndex: 1000,
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

  // Estilo Ticket Premium (Wallet Style)
  ticketCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
    marginBottom: 16,
  },
  ticketHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF9FB',
  },
  ticketStoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storeEmoji: {
    fontSize: 24,
  },
  ticketStoreName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  ticketDate: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '500',
    marginTop: 2,
  },
  ticketDividerWrapper: {
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  ticketDividerBgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#FAF9FB',
  },
  ticketDividerBgBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: '#ffffff',
  },
  ticketCutoutLeft: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    position: 'absolute',
    left: -8,
  },
  ticketCutoutRight: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    position: 'absolute',
    right: -8,
  },
  ticketDashedLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginHorizontal: 8,
  },
  ticketBodyRow: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  codeColumn: {
    alignItems: 'center',
    gap: 6,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#707070',
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 12,
  },
  orderIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
  },
  orderIdBadgeText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1C1C1E',
    letterSpacing: 1.5,
  },
  ticketThinDivider: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginHorizontal: 20,
    marginVertical: 4,
  },
  ticketProductsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#ffffff',
  },
  productsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  productQtyInline: {
    color: '#8E8E93',
    fontWeight: '700',
    fontSize: 14,
  },
  productDividerDot: {
    color: '#C7C7CC',
    fontSize: 12,
    fontWeight: '700',
  },

  // Accesos rápidos (UX Perfecta)
  actionShortcuts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    gap: 10,
  },
  shortcutButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  shortcutIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(91, 35, 51, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1E',
  },

  infoCard: {
    backgroundColor: '#F7F7F9',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 16,
    marginBottom: 16,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 12,
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
    paddingVertical: 8,
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
  },
  backSubmitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Estilos del QR Vectorial
  qrContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  finderPattern: {
    width: 24,
    height: 24,
    borderWidth: 4,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  finderInner: {
    width: 10,
    height: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finderCenter: {
    width: 6,
    height: 6,
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


