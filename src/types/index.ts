import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface ExpenseForm {
  title: string;
  amount: string;
  category: string;
  date: Date;
}

export interface ValidationErrors {
  title?: string;
  amount?: string;
  date?: string;
}

export interface NewAccountForm {
  name: string;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  currency: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: FirebaseFirestoreTypes.Timestamp;
}

export interface CategoryTotals {
  [category: string]: number;
}
