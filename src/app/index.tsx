import { ScrollView } from 'react-native';

import CerclePlus from '@/components/cercle-plus/cercle-plus';
import Header from '@/components/header/header';
import Locales from '@/components/locales/locales';
import Ofertas from '@/components/ofertas/ofertas';
import Sellos from '@/components/sellos/sellos';

export default function HomeScreen() {
  return (
    <>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Sellos />
        <Ofertas />
        <CerclePlus />
        <Locales />
      </ScrollView>
    </>
  );
}