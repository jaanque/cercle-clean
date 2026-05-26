import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

interface StampProps {
  completed: boolean;
}

export default function Stamp({ completed }: StampProps) {
  return (
    <View style={styles.stampWrapper}>
      {/* 8-pointed rosette shape using two overlapping squares rotated by 45 degrees */}
      <View style={[styles.rosetteBase, completed ? styles.rosetteCompleted : styles.rosetteIncomplete]} />
      <View style={[styles.rosetteBase, styles.rosetteRotated, completed ? styles.rosetteCompleted : styles.rosetteIncomplete]} />
      
      {completed && (
        <View style={styles.checkWrapper}>
          <SymbolView
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            size={10}
            tintColor="#ffffff"
            weight="bold"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stampWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rosetteBase: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
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
    borderColor: '#E2D4D8', // Beautiful lightened accent color for inactive stamp border
  },
  checkWrapper: {
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
