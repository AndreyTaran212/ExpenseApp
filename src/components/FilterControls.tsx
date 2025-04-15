import React, {Dispatch, SetStateAction} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface FilterControlsProps {
  categoryFilter: string[];
  setCategoryFilter: Dispatch<SetStateAction<any>>;
  categoryItems: {label: string; value: string}[];
  categoryOpen: boolean;
  setCategoryOpen: Dispatch<SetStateAction<boolean>>;
  sortAsc: boolean;
  setSortAsc: Dispatch<SetStateAction<boolean>>;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  categoryFilter,
  setCategoryFilter,
  categoryItems,
  categoryOpen,
  setCategoryOpen,
  sortAsc,
  setSortAsc,
}) => {
  return (
    <View style={styles.container}>
      <DropDownPicker
        multiple={true}
        open={categoryOpen}
        value={categoryFilter}
        items={categoryItems}
        setOpen={setCategoryOpen}
        setValue={setCategoryFilter}
        setItems={() => {}}
        placeholder="Filter by category"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        mode="BADGE"
      />

      {categoryFilter.length > 0 && (
        <TouchableOpacity
          onPress={() => setCategoryFilter([])}
          style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setSortAsc(prev => !prev)}>
        <Text style={styles.sortButtonText}>
          Sort: {sortAsc ? 'Oldest' : 'Newest'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#333',
  },
  sortButton: {
    marginTop: 8,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
