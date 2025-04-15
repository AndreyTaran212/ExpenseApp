import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import {CategoryTotals, Expense} from '../../types';
import {useAccount} from '../../hooks/useAccount.tsx';
import {getCurrentUserId} from '../../utils/firebaseService.ts';
import {useIsFocused} from '@react-navigation/native';
import SafeArea from '../../components/SafeArea.tsx';
import {useHomeScreen} from '../../hooks/useHomeScreenConfig.ts';

const categories = ['Food', 'Transport', 'Bills', 'Entertainment'];

const MonthlyReportScreen: React.FC = () => {
  const {selectedAccountId} = useAccount();
  const {selectedAccountData} = useHomeScreen();
  const userId = getCurrentUserId();
  const [categorySums, setCategorySums] = useState<CategoryTotals>({});
  const [totalSum, setTotalSum] = useState(0);
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    if (userId && selectedAccountId) fetchExpenses();
  }, [userId, selectedAccountId, startDate, endDate]);

  const fetchExpenses = async () => {
    const snapshot = await firestore()
      .collection(`users/${userId}/accounts/${selectedAccountId}/expenses`)
      .where('date', '>=', firestore.Timestamp.fromDate(startDate))
      .where('date', '<=', firestore.Timestamp.fromDate(endDate))
      .orderBy('date', 'desc')
      .get();

    const categoryTotals: CategoryTotals = {};
    let total = 0;

    categories.forEach(category => {
      categoryTotals[category] = 0;
    });

    snapshot.docs.forEach(doc => {
      const data = doc.data() as Expense;
      const category = data.category;
      const amount = data.amount || 0;
      if (category in categoryTotals) {
        categoryTotals[category] += amount;
      }
      total += amount;
    });

    setCategorySums(categoryTotals);
    setTotalSum(total);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && userId && selectedAccountId) {
      fetchExpenses();
    }
  }, [isFocused, userId, selectedAccountId, startDate, endDate]);

  return (
    <SafeArea style={styles.container}>
      <Text variant="headlineSmall">{selectedAccountData?.name} Report</Text>

      <View style={styles.dateRow}>
        <Button mode="outlined" onPress={() => setShowStartPicker(true)}>
          From:{' '}
          {startDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </Button>
        <Button mode="outlined" onPress={() => setShowEndPicker(true)}>
          To:{' '}
          {endDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </Button>
      </View>
      <View style={styles.dateRow}>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            style={styles.datePicker}
            onChange={(e, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            style={styles.datePicker}
            display="default"
            onChange={(e, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.total}>Total: ${totalSum.toFixed(2)}</Text>
        {categories.map(category => (
          <View key={category} style={styles.summaryRow}>
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.amount}>
              ${(categorySums[category] || 0).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </SafeArea>
  );
};

export default MonthlyReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 20,
    backgroundColor: '#fff',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  summaryBox: {
    marginTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  category: {
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  datePicker: {position: 'absolute', left: 0, top: -10},
});
