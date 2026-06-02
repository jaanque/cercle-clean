import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHomeData } from '@/hooks/useHomeData';
import { useAuth } from '@/providers/AuthProvider';
import StampsSkeleton from '@/components/skeletons/stampsSkeleton';

export default function StampsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { userStamps, loading } = useHomeData();

  const totalStamps = 5;
  const completedCount = user ? Math.min(userStamps.length, totalStamps) : 0;
  const remainingCount = totalStamps - completedCount;

  const rewards = [
    {
      id: 'r1',
      title: 'Descuento de 10 €',
      description: 'Canjeable en tu próxima compra superior a 20 €.',
      icon: 'percent',
      unlocked: completedCount >= 5,
    },
    {
      id: 'r2',
      title: 'Envío gratis ilimitado',
      description: 'Durante 30 días en todos los comercios Cercle.',
      icon: 'shippingbox.fill',
      unlocked: completedCount >= 5,
    },
  ];
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Fijo */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <SymbolView name="chevron.left" size={20} tintColor="#1C1C1E" weight="bold" />
        </Pressable>
        <Text style={styles.headerTitle}>Fidelidad y Sellos</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <StampsSkeleton />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Tarjeta de Fidelidad Estilo Home (Wallet Card) */}
        <View style={styles.walletCard}>

          {/* Fila de Sellos Rosette (Fiel al Home) */}
          <View style={styles.stampsGrid}>
            {Array.from({ length: totalStamps }).map((_, index) => {
              const isCompleted = index < completedCount;
              return (
                <View key={index} style={styles.stampSlot}>
                  <View style={styles.stampWrapper}>
                    {/* Estilo Rosette de 8 puntas idéntico al Home */}
                    <View style={[
                      styles.rosetteBase,
                      isCompleted ? styles.rosetteCompleted : styles.rosetteIncomplete
                    ]} />
                    <View style={[
                      styles.rosetteBase,
                      styles.rosetteRotated,
                      isCompleted ? styles.rosetteCompleted : styles.rosetteIncomplete
                    ]} />
                    
                    {isCompleted ? (
                      <View style={styles.checkWrapper}>
                        <SymbolView
                          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                          size={15}
                          tintColor="#ffffff"
                          weight="bold"
                        />
                      </View>
                    ) : (
                      <Text style={styles.stampNumber}>{index + 1}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.progressText}>
              {completedCount === totalStamps
                ? '¡Tarjeta completa! Ya puedes canjear tus premios.'
                : `Te faltan ${remainingCount} sellos para tu recompensa.`}
            </Text>
            {/* Barra de progreso visual con color acento */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(completedCount / totalStamps) * 100}%` }]} />
            </View>
          </View>
        </View>

        {/* Sección: Recompensas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recompensas disponibles</Text>
          <View style={styles.rewardsList}>
            {rewards.map((reward) => (
              <View key={reward.id} style={[styles.rewardCard, !reward.unlocked && styles.lockedRewardCard]}>
                <View style={styles.rewardHeader}>
                  <View style={styles.rewardIconBg}>
                    <SymbolView name={reward.icon as any} size={18} tintColor={Colors.accent} weight="bold" />
                  </View>
                  <View style={styles.rewardHeaderTexts}>
                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    <Text style={styles.rewardDesc}>{reward.description}</Text>
                  </View>
                </View>
                <Pressable
                  style={[styles.claimButton, !reward.unlocked && styles.lockedClaimButton]}
                  onPress={() => {
                    if (reward.unlocked) {
                      Alert.alert('Recompensa Canjeada', `¡Has canjeado con éxito: ${reward.title}!`);
                    } else {
                      Alert.alert('Bloqueado', `Completa tu tarjeta de sellos (${completedCount}/5) para desbloquear este premio.`);
                    }
                  }}
                >
                  <Text style={[styles.claimButtonText, !reward.unlocked && styles.lockedClaimButtonText]}>
                    {reward.unlocked ? 'Canjear ahora' : 'Completa para desbloquear'}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Sección: Cómo Funciona */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>
          <View style={styles.instructionsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepIconBg}>
                <SymbolView name="iphone" size={15} tintColor={Colors.accent} weight="bold" />
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>1. Compra en la app</Text>
                <Text style={styles.stepDesc}>Haz tu pedido directamente desde Cercle.</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepIconBg}>
                <SymbolView name="qrcode.viewfinder" size={16} tintColor={Colors.accent} weight="bold" />
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>2. Enseña el QR</Text>
                <Text style={styles.stepDesc}>Muestra el código QR al recoger tu compra en tienda.</Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepIconBg}>
                <SymbolView name="checkmark.seal.fill" size={15} tintColor={Colors.accent} weight="bold" />
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>3. Suma tu sello</Text>
                <Text style={styles.stepDesc}>Se añadirá automáticamente al marcarse como entregado.</Text>
              </View>
            </View>
          </View>
        </View>
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
  header: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110, // Margen inferior amplio para el menú flotante
  },
  walletCard: {
    backgroundColor: Colors.background2,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 24,
  },
  stampsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
    width: '100%',
  },
  stampSlot: {
    flex: 1,
    alignItems: 'center',
  },
  stampWrapper: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rosetteBase: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
  },
  rosetteRotated: {
    transform: [{ rotate: '45deg' }],
  },
  rosetteCompleted: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  rosetteIncomplete: {
    backgroundColor: 'transparent',
    borderColor: '#E2D4D8',
  },
  checkWrapper: {
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stampNumber: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '700',
  },
  cardFooter: {
    marginTop: 18,
    gap: 8,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#EAEAEA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  instructionsList: {
    gap: 16,
    backgroundColor: '#F7F7F9',
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  stepItem: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  stepIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(91, 35, 51, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepTextContainer: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  stepDesc: {
    fontSize: 12,
    color: '#707070',
    lineHeight: 16,
    fontWeight: '500',
  },
  rewardsList: {
    gap: 14,
  },
  rewardCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 22,
    padding: 16,
    gap: 16,
  },
  lockedRewardCard: {
    backgroundColor: '#FAFAFC',
  },
  rewardHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  rewardIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(91, 35, 51, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardHeaderTexts: {
    flex: 1,
    gap: 2,
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  rewardDesc: {
    fontSize: 12,
    color: '#707070',
    lineHeight: 16,
    fontWeight: '500',
  },
  claimButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedClaimButton: {
    backgroundColor: '#EAEAEA',
  },
  claimButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  lockedClaimButtonText: {
    color: '#8E8E93',
  },
  historyList: {
    gap: 12,
    backgroundColor: '#F7F7F9',
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(91, 35, 51, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyStore: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  historyTime: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 1,
  },
  historyValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.accent,
  },
});
