import React from 'react';
import {TouchableOpacity, Modal, Text, View} from 'react-native';
import {styles} from './HomeScreen.styles.ts';
import SafeView from '../../components/SafeArea';
import {useHomeScreen} from '../../hooks/useHomeScreenConfig.ts';
import {FilterControls} from '../../components/FilterControls.tsx';
import {ExpenseList} from '../../components/ExpenseList.tsx';
import {ExpenseModal} from '../../components/ExpenseModal.tsx';
import {CreateAccountModal} from '../../components/CreateAccountModal.tsx';
import {ActivityIndicator} from 'react-native-paper';

const HomeScreen: React.FC = () => {
  const {
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
    selectedAccountData,
    isLoading,
  } = useHomeScreen();

  return (
    <SafeView style={styles.container}>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <Text style={styles.header}>
            {selectedAccountData?.name} Expenses
          </Text>
          <FilterControls
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categoryItems={categoryItems}
            categoryOpen={categoryOpen}
            setCategoryOpen={setCategoryOpen}
            sortAsc={sortAsc}
            setSortAsc={setSortAsc}
          />
          <ExpenseList data={expenses} onItemPress={handleEditPress} />
          <TouchableOpacity
            style={styles.fab}
            onPress={() => {
              setEditingExpense(null);
              setForm({
                title: '',
                amount: '',
                category: 'Food',
                date: new Date(),
              });
              setModalVisible(true);
            }}>
            <Text style={styles.fabText}>＋</Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}>
            <SafeView style={styles.modalContainer}>
              <ExpenseModal
                form={form}
                setForm={setForm}
                onCancel={() => setModalVisible(false)}
                onSubmit={handleAddExpense}
                onDelete={editingExpense ? handleDeleteExpense : undefined}
                validationErrors={validationErrors}
                categoryItems={categoryItems}
              />
            </SafeView>
          </Modal>
          <CreateAccountModal
            visible={createAccountModalVisible}
            onCancel={() => setCreateAccountModalVisible(false)}
            onSubmit={handleCreateAccount}
            form={newAccountForm}
            setForm={setNewAccountForm}
            allowCancel={!!expenses.length}
          />
        </>
      )}
    </SafeView>
  );
};

export default HomeScreen;
