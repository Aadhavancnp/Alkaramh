import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import FilterPopup from "./filterPopup"; // Adjust the import path as necessary

import { homeStyles as styles } from "./Homestyles";

// props type
type FilterBarProps = {
  onSeeAllPress?: () => void;
};

const FilterBar: React.FC<FilterBarProps> = ({ onSeeAllPress }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    previouslyOrdered: false,
    ratings: false,
    offers: false,
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={styles.filterBar}>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(true)}>
          <Feather name="sliders" color="black" style={styles.filterIcon} />
          <Text style={styles.filterText}>Filters</Text>
          <Text style={styles.filterArrow}>▼</Text>
        </TouchableOpacity>

        {/* SEE ALL BUTTON */}
       
        <FilterPopup visible={showFilter} onClose={() => setShowFilter(false)} />

        {Object.entries(filters).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={value ? styles.filterOptionclicked : styles.filterOption}
            onPress={() => toggleFilter(key as keyof typeof filters)}
          >
            <Text style={styles.filterOptionText}>
              {key === 'previouslyOrdered'
                ? 'Previously Ordered'
                : key === 'ratings'
                ? 'Ratings 4.0+'
                : 'Great offers'}
            </Text>
            {value && <AntDesign name="close" style={styles.XArrow} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FilterBar;
