import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { homeStyles as styles } from "./Homestyles";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../api.json"; // Make sure your api.json has your base URL

type CategoryProps = {
  onSeeAllPress?: () => void;
};

type Category = {
  _id: string;
  name: {
    en: string;
    ar?: string;
  };
  image: string; // assuming image is a URL
};

const CategoryList: React.FC<CategoryProps> = ({ onSeeAllPress }) => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const json = await res.json();
      const apiCategories = json.data || [];

      // Add "All" category manually
      const defaultAll = {
        _id: "all",
        name: { en: "All" },
        image: require("../../assets/all.png"),
        active: true,
        isLocal: true,
      };

      const updated = apiCategories.map((cat: Category) => ({
        ...cat,
        active: false,
        isLocal: false,
      }));

      setCategories([defaultAll, ...updated]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryPress = (selectedId: string) => {
    const updated = categories.map((cat) => ({
      ...cat,
      active: cat._id === selectedId,
    }));
    setCategories(updated);
    
  };

  return (
    <View style={styles.categoriesContainer}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore category</Text>
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category._id}
              style={[
                styles.categoryItem,
                category.active && styles.categoryItemActive,
              ]}
              onPress={() => handleCategoryPress(category._id)}
            >
              <View style={styles.categoryIcon}>
                <Image
                  style={styles.categoryIconText}
                  source={
                    category.isLocal
                      ? category.image
                      : { uri: category.image }
                  }
                />
              </View>
              <Text
                style={[
                  styles.categoryName,
                  category.active && styles.categoryNameActive,
                ]}
              >
                {category.name?.en}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default CategoryList;
