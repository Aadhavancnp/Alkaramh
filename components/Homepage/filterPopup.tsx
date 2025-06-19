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
    height: hp('60%'),
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    overflow: 'hidden',
  },
  title: {
    paddingTop: hp('2%'),
    paddingHorizontal: wp('5%'),
    fontSize: hp('2.3%'),
    fontWeight: '500',
  },
  clearAll: {
    position: 'absolute',
    right: wp('5%'),
    top: hp('2%'),
  },
  clearAllText: {
    color: '#607D8B',
    fontSize: hp('1.8%'),
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    marginTop: hp('2%'),
  },
  sidebar: {
    width: wp('25%'),
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: hp('3%'),
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
  },
  activeTab: {
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('25%'),
    height: hp('10%'),
    borderRightWidth: 2,
    borderColor: '#283593',
  },
  tabText: {
    fontSize: hp('1.5%'),
    color: '#888',
    textAlign: 'center',
    marginTop: hp('0.5%'),
  },
  activeTabText: {
    color: '#283593',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    padding: wp('4%'),
  },
  sortTitle: {
    fontSize: hp('2%'),
    fontWeight: '600',
    marginBottom: hp('1.5%'),
  },
  sortList: {
    backgroundColor: '#F6F7FB',
    borderRadius: wp('3%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
  },
  sortOption: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeSortOption: {
    backgroundColor: '#E0E7FF',
    borderRadius: wp('3%'),
  },
  sortText: {
    fontSize: hp('1.9%'),
    color: '#000',
  },
  radio: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    borderRadius: wp('2.25%'),
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerDot: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    backgroundColor: '#283593',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('8%'),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  closeText: {
    fontSize: hp('2%'),
    color: '#555',
  },
  disabledButton: {
    backgroundColor: '#283593',
    paddingHorizontal: wp('7%'),
    paddingVertical: hp('1.7%'),
    borderRadius: wp('2%'),
  },
  disabledButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: hp('1.9%'),
  },
});

export default FilterPopup;
