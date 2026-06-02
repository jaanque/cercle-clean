import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';

interface StoreHeaderProps {
  onBack: () => void;
  onMore?: () => void;
  topInset: number;
}

export default function StoreHeader({ onBack, onMore, topInset }: StoreHeaderProps) {
  return (
    <View style={[styles.header, { paddingTop: Math.max(topInset, 12) }]}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <SymbolView name="chevron.left" size={20} tintColor="#1C1C1E" weight="bold" />
      </Pressable>
      <Pressable style={({ pressed }) => [styles.ellipsisBtn, pressed && { opacity: 0.7 }]} onPress={onMore}>
        <SymbolView name="ellipsis" size={20} tintColor="#1C1C1E" weight="bold" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 1000,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 22, // rounded strictly to 22px
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipsisBtn: {
    width: 40,
    height: 40,
    borderRadius: 22, // rounded strictly to 22px
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
