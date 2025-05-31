import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Header from './Header';
import ContentPage from './Contentpage';
import DownProductPage from './Downproduct';
import Footer from '../../Utils/Footer/Footer';
const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* ScrollView should wrap everything */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Header />
        <ContentPage />
        <DownProductPage />
      </ScrollView>
      <Footer/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Home;
