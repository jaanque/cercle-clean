import { SafeAreaView, View } from 'react-native';

import ProfileActions from '@/components/profileScreen/profile-actions';
import ProfileContent from '@/components/profileScreen/profile-content';
import ProfileHeader from '@/components/profileScreen/profile-header';
import { Colors } from '@/constants/theme';

/**
 * ProfileScreen - Pantalla principal de Perfil de usuario.
 * Solo contiene los imports modulares y la secuenciación de los componentes estéticos.
 */
export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background1 }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <ProfileHeader />
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 40 }}>
          <ProfileContent />
          <ProfileActions />
        </View>
      </View>
    </SafeAreaView>
  );
}