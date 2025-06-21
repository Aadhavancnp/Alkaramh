import { AntDesign, Feather } from '@expo/vector-icons';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useRoute, useNavigation } from '@react-navigation/native';

import Products from '../Products/Products';
import Footer from '../../Utils/Footer/Footer';
import CategoryList from './CategoryList';
import Header from './Header';
import ProductCarousel from './ProductCarousel';
import SpotlightCard from './spotlighcard';
import { homeStyles as styles } from "./Homestyles";
import FilterBar from './Filterbar';
import { StatusBar } from 'react-native';

const Home: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const showClearedScreen = route?.params?.showCleared || false;

  const handleClear = () => {
    navigation.navigate('Home', { showCleared: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F8" />
      {showClearedScreen ? (
        <Products />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header />
          <CategoryList onSeeAllPress={handleClear} />
          <FilterBar  />
          <ProductCarousel onSeeAllPress={handleClear} />
          <SpotlightCard imageSource={require('../../assets/wheat.png')} OnSellAll={handleClear} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export { Home };
