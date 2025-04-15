import React from 'react';
import {FlatList, Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Expense} from '../types';
import {Icon} from 'react-native-paper';

interface ExpenseListProps {
  data: Expense[];
  onItemPress?: (item: any) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  data,
  onItemPress,
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => onItemPress?.(item)}
          style={styles.expenseItem}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.expenseText}>
                {item.title} — ${item.amount.toFixed(2)}
              </Text>
              <Text style={styles.expenseSub}>
                {item.category} |{' '}
                {new Date(item.date.toDate()).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <Icon source="dots-vertical" size={24} color="#888" />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  expenseItem: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#eee',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  expenseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  expenseSub: {
    fontSize: 14,
    color: '#555',
  },
});
