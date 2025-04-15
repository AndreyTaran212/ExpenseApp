import {useState, useEffect} from 'react';
import {
  fetchExpensesFromAccount,
  getCurrentUserId,
} from '../utils/firebaseService.ts';
import {useAccount} from './useAccount.tsx';
import firestore from '@react-native-firebase/firestore';
import {ExpenseForm, ValidationErrors, NewAccountForm} from '../types';

export const useHomeScreen = () => {
  const userId = getCurrentUserId();
  const {
    selectedAccountId,
    setSelectedAccountId,
    selectedAccountData,
    setSelectedAccountData,
  } = useAccount();

  const [expenses, setExpenses] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [createAccountModalVisible, setCreateAccountModalVisible] =
    useState(false);
  const [newAccountForm, setNewAccountForm] = useState<NewAccountForm>({
    name: '',
    currency: 'USD',
  });
  const [form, setForm] = useState<ExpenseForm>({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date(),
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [categoryItems] = useState([
    {label: 'Food', value: 'Food'},
    {label: 'Transport', value: 'Transport'},
    {label: 'Bills', value: 'Bills'},
    {label: 'Entertainment', value: 'Entertainment'},
  ]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const init = async () => {
      try {
        if (!userId) return;
        setIsLoading(true);
        if (!selectedAccountId) {
          const snapshot = await firestore()
            .collection(`users/${userId}/accounts`)
            .get();
          if (snapshot.empty) {
            setCreateAccountModalVisible(true);
            setIsLoading(false);
            return;
          } else {
            const defaultDoc = snapshot.docs[0];
            setSelectedAccountId(defaultDoc.id);
            setSelectedAccountData(defaultDoc.data());
            fetchExpenses(defaultDoc.id);
          }
        } else {
          const doc = await firestore()
            .collection(`users/${userId}/accounts`)
            .doc(selectedAccountId)
            .get();
          if (doc.exists) {
            setSelectedAccountData(doc.data());
          }
          fetchExpenses(selectedAccountId);
        }
      } catch (e) {
        console.log('init error');
        console.log(e);
      }
    };

    init();
  }, [userId]);

  useEffect(() => {
    if (selectedAccountId) {
      fetchExpenses(selectedAccountId);
    }
  }, [sortAsc, categoryFilter, selectedAccountId]);

  const fetchExpenses = async (accountId: string) => {
    if (!userId) return;
    setIsLoading(true);
    const data = await fetchExpensesFromAccount(
      userId,
      accountId,
      categoryFilter,
      categoryItems,
      sortAsc,
    );
    setExpenses(data);
    setIsLoading(false);
  };

  const handleAddExpense = async () => {
    const errors: ValidationErrors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    const parsedAmount = parseFloat(form.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0)
      errors.amount = 'Enter a valid number';
    if (form.date.getTime() > Date.now()) {
      errors.date = 'Date cannot be in the future';
    }

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!userId || !selectedAccountId) return;

    const collectionRef = firestore().collection(
      `users/${userId}/accounts/${selectedAccountId}/expenses`,
    );

    if (editingExpense?.id) {
      await collectionRef.doc(editingExpense.id).update({
        title: form.title,
        amount: parsedAmount,
        category: form.category,
        date: form.date,
      });
    } else {
      await collectionRef.add({
        title: form.title,
        amount: parsedAmount,
        category: form.category,
        date: form.date,
      });
    }

    setModalVisible(false);
    setEditingExpense(null);
    setForm({title: '', amount: '', category: 'Food', date: new Date()});
    fetchExpenses(selectedAccountId);
  };

  const handleDeleteExpense = async () => {
    if (!userId || !selectedAccountId || !editingExpense?.id) return;

    await firestore()
      .collection(`users/${userId}/accounts/${selectedAccountId}/expenses`)
      .doc(editingExpense.id)
      .delete();

    setModalVisible(false);
    setEditingExpense(null);
    setForm({title: '', amount: '', category: 'Food', date: new Date()});
    fetchExpenses(selectedAccountId);
  };

  const handleEditPress = (expense: any) => {
    setEditingExpense(expense);
    setForm({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date.toDate(),
    });
    setModalVisible(true);
  };

  const handleCreateAccount = async () => {
    if (!userId || !newAccountForm.name.trim()) return;

    const newAccount = {
      name: newAccountForm.name.trim(),
      currency: newAccountForm.currency,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await firestore()
      .collection(`users/${userId}/accounts`)
      .add(newAccount);

    setSelectedAccountId(docRef.id);
    setSelectedAccountData(newAccount);
    setCreateAccountModalVisible(false);
    setNewAccountForm({name: '', currency: 'USD'});
    fetchExpenses(docRef.id);
  };

  return {
    expenses,
    modalVisible,
    setModalVisible,
    editingExpense,
    setEditingExpense,
    createAccountModalVisible,
    setCreateAccountModalVisible,
    newAccountForm,
    setNewAccountForm,
    handleCreateAccount,
    handleAddExpense,
    handleDeleteExpense,
    handleEditPress,
    form,
    setForm,
    validationErrors,
    categoryItems,
    categoryFilter,
    setCategoryFilter,
    categoryOpen,
    setCategoryOpen,
    sortAsc,
    setSortAsc,
    selectedAccountId,
    isLoading,
    selectedAccountData,
  };
};
