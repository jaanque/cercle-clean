import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '@/constants/theme';

export default function ProfileButton() {
  return (
    <Pressable style={styles.button}>
      <SymbolView
        name={{ ios: 'person', android: 'person', web: 'person' }}
        size={22}
        tintColor="#333333"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 22,
    backgroundColor: Colors.background2,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
