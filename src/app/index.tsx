import { ScrollView } from 'react-native';

import Header from '@/components/header/header';
import Sellos from '@/components/sellos/sellos';
import CerclePlus from '@/components/cercle-plus/cercle-plus';
import Ofertas from '@/components/ofertas/ofertas';
import Locales from '@/components/locales/locales';

export default function HomeScreen() {
  return (
    <>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Sellos />
        <CerclePlus />
        <Ofertas />
        <Locales />
      </ScrollView>
    </>
  );
}