import { Slot } from 'expo-router';
import { View } from 'react-native';

import { Colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background1 }}>
      <Slot />
    </View>
  );
}