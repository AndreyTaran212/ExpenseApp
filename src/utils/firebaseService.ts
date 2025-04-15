import firestore, {Filter} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const getCurrentUserId = (): string | null => {
  return auth().currentUser?.uid ?? null;
};

export const fetchExpensesFromAccount = async (
  userId: string,
  accountId: string,
  categoryFilter: string[],
  categoryItems: {label: string; value: string}[],
  sortAsc: boolean,
): Promise<any[]> => {
  const baseRef = firestore().collection(
    `users/${userId}/accounts/${accountId}/expenses`,
  );
  const filtering =
    categoryFilter.length > 0 && categoryFilter.length < categoryItems.length;
  let query;

  if (filtering) {
    query = baseRef
      .where(Filter('category', 'in', categoryFilter))
      .orderBy('date', sortAsc ? 'asc' : 'desc');
  } else {
    query = baseRef.orderBy('date', sortAsc ? 'asc' : 'desc');
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
};
