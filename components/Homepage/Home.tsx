import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import Footer from "../../Utils/Footer/Footer";
import ContentPage from "./Contentpage";
import DownProductPage from "./Downproduct";
import Header from "./Header";

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}>
        <Header />
        <ContentPage />
        <DownProductPage />
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default Home;
