import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

interface StoreActionsProps {
  onCall: () => void;
  onDirections: () => void;
  onWeb: () => void;
}

export default function StoreActions({ onCall, onDirections, onWeb }: StoreActionsProps) {
  return (
    <View style={styles.storeContactActionsRow}>
      <Pressable 
        style={({ pressed }) => [styles.contactActionBtn, pressed && { opacity: 0.75 }]}
        onPress={onCall}
      >
        <SymbolView name="phone.fill" size={12} tintColor="#64748B" />
        <Text style={styles.contactActionBtnText}>Llamar</Text>
      </Pressable>

      <Pressable 
        style={({ pressed }) => [styles.contactActionBtn, pressed && { opacity: 0.75 }]}
        onPress={onDirections}
      >
        <SymbolView name="arrow.triangle.turn.up.right.diamond.fill" size={12} tintColor="#64748B" />
        <Text style={styles.contactActionBtnText}>Cómo llegar</Text>
      </Pressable>

      <Pressable 
        style={({ pressed }) => [styles.contactActionBtn, pressed && { opacity: 0.75 }]}
        onPress={onWeb}
      >
        <SymbolView name="globe" size={12} tintColor="#64748B" />
        <Text style={styles.contactActionBtnText}>Web</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  storeContactActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  contactActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC', // Very subtle light slate gray background
    borderRadius: 22, // rounded strictly to 22px
    paddingVertical: 8,
    gap: 6,
    height: 36,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactActionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B', // Slate gray text
  },
});
