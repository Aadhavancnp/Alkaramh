import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

interface FilterPopupProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
}

interface FilterState {
  sortBy: string;
  rating: number | null;
}

const sortOptionsList = [
  "Related",
  "Rating : High to Low",
  "Cost for one: Low to High",
  "Cost for one: High to Low",
];

const FilterPopup: React.FC<FilterPopupProps> = ({ visible, onClose, onApplyFilters }) => {
  const [selectedTab, setSelectedTab] = useState("Sort by");
  const [selectedSort, setSelectedSort] = useState("Related");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleClearAll = () => {
    setSelectedSort("Related");
    setSelectedRating(null);
  };

  const handleShowResults = () => {
    onApplyFilters?.({
      sortBy: selectedSort,
      rating: selectedRating,
    });
    onClose();
  };


  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Filters and sorting</Text>
              <TouchableOpacity style={styles.clearAll} onPress={handleClearAll}>
                <Text style={styles.clearAllText}>Clear all</Text>
              </TouchableOpacity>

              <View style={styles.body}>
                {/* Sidebar Tabs */}
                <View style={styles.sidebar}>
                  <TouchableOpacity
                    style={[styles.tab, selectedTab === "Sort by" && styles.activeTab]}
                    onPress={() => setSelectedTab("Sort by")}
                  >
                    <Image
                      style={{ marginTop: 4 }}
                      source={require('../../assets/Vector2.png')}
                    />
                    <Text style={[styles.tabText, selectedTab === "Sort by" && styles.activeTabText]}>
                      Sort by
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tab, selectedTab === "Rating" && styles.activeTab]}
                    onPress={() => setSelectedTab("Rating")}
                  >
                    <Ionicons
                      name="star-outline"
                      size={18}
                      color={selectedTab === "Rating" ? "#283593" : "#888"}
                    />
                    <Text style={[styles.tabText, selectedTab === "Rating" && styles.activeTabText]}>
                      Rating
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tab, selectedTab === "Trust" && styles.activeTab]}
                    onPress={() => setSelectedTab("Trust")}
                  >
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={18}
                      color={selectedTab === "Trust" ? "#283593" : "#888"}
                    />
                    <Text style={[styles.tabText, selectedTab === "Trust" && styles.activeTabText]}>
                      Trust{"\n"}makers
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Main Content Area */}
                <View style={styles.mainContent}>
                  {selectedTab === "Sort by" && (
                    <View style={styles.sortList}>
                      <Text style={styles.sortTitle}>Sort by</Text>
                      <View style={{ backgroundColor: "#FFFFFF" }}>
                        {sortOptionsList.map((option) => (
                          <TouchableOpacity
                            key={option}
                            style={[
                              styles.sortOption,
                              selectedSort === option && styles.activeSortOption,
                            ]}
                            onPress={() => setSelectedSort(option)}
                          >
                            <Text style={styles.sortText}>{option}</Text>
                            <View style={styles.radio}>
                              {selectedSort === option && <View style={styles.radioInnerDot} />}
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                 

                  {selectedTab === "Trust" && (
                    <View style={styles.sortList}>
                      <Text style={styles.sortText}>Trust Makers filter (coming soon)</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Footer Buttons */}
              <View style={styles.footer}>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.disabledButton} onPress={handleShowResults}>
                  <Text style={styles.disabledButtonText}>Show results</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: hp('55%'),
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  title: {
    paddingTop: hp('2%'),
    paddingHorizontal: wp('5%'),
    fontSize: 20,
    fontWeight: "500",
  },
  clearAll: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  clearAllText: {
    color: "#607D8B",
  },
  body: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
  },
  sidebar: {
    width: 100,
    borderRightWidth: 1,
    borderRightColor: "#eee",
  },
  tab: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 30,
    justifyContent: 'center',
    paddingVertical: 5,
  },
  activeTab: {
    backgroundColor: "#EEF0FF",
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 80,
    borderRightWidth: 2,
    borderColor: "#283593",
  },
  tabText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 4,
  },
  activeTabText: {
    color: "#283593",
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  sortList: {
    backgroundColor: "#F6F7FB",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  sortOption: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeSortOption: {
    backgroundColor: "#E0E7FF",
    borderRadius: 12,
  },
  sortText: {
    fontSize: 14,
    color: "#000",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#283593",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: hp('4%'),
    paddingHorizontal: wp('10%'),
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  closeText: {
    top: hp('1%'),
    fontSize: wp('5%'),
    color: "#555",
  },
  disabledButton: {
    backgroundColor: "#283593",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  disabledButtonText: {
   // color: "#999",
   color : "#FFFFFF",
    fontWeight: "600",
  },
});

export default FilterPopup;
