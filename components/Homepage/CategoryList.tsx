import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { homeStyles as styles } from "./Homestyles";
import { useNavigation } from "@react-navigation/native";

type CategoryProps = {
  onSeeAllPress?: () => void;
};
const CategoryList: React.FC<CategoryProps> = ({ onSeeAllPress }) => {
  

  const navigation = useNavigation();

    const categories = [
  { id: 1, name: 'All', active: true, image: require('../../assets/all.png') },
  { id: 2, name: 'Feed', active: false, image: require('../../assets/feed.png') },
  { id: 3, name: 'Protein', active: false, image: require('../../assets/protein.jpg') },
  { id: 4, name: 'Salts', active: false, image: require('../../assets/salts.jpg') },
  { id: 5, name: 'Millet', active: false, image: require('../../assets/millet.png') },
  { id: 6, name: 'Alfalfa', active: false, image: require('../../assets/alfalfa.jpg') },
  { id: 7, name: 'Tibin', active: false, image: require('../../assets/tibin.png') },
  { id: 8, name: 'Rodhes', active: false, image: require('../../assets/feed.png') },
];
    return(
    <View style={styles.categoriesContainer}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore category</Text>
              <TouchableOpacity onPress={onSeeAllPress}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryItem, category.active && styles.categoryItemActive]}
                >
                  <View style={styles.categoryIcon}>
                    <Image style={styles.categoryIconText} source={category.image} />
                  </View>
                  <Text
                    style={[styles.categoryName, category.active && styles.categoryNameActive]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>


)};








export default CategoryList;
