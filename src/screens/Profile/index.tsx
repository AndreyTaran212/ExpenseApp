import React, {useEffect, useState} from 'react';
import {View, Alert, FlatList} from 'react-native';
import {Text, Button, RadioButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useAccount} from '../../hooks/useAccount.tsx';
import {useHomeScreen} from '../../hooks/useHomeScreenConfig.ts';
import {CreateAccountModal} from '../../components/CreateAccountModal.tsx';
import {Account} from '../../types';
import SafeArea from '../../components/SafeArea.tsx';
import {styles} from './Profile.styles.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen: React.FC = () => {
  const userId = auth().currentUser?.uid;
  const [accounts, setAccounts] = useState<Account[]>([]);

  const {selectedAccountId, setSelectedAccountId, setSelectedAccountData} =
    useAccount();

  const {
    createAccountModalVisible,
    setCreateAccountModalVisible,
    newAccountForm,
    setNewAccountForm,
    handleCreateAccount,
  } = useHomeScreen();

  useEffect(() => {
    if (userId) fetchAccounts();
  }, [userId, createAccountModalVisible]);

  const fetchAccounts = async () => {
    const snapshot = await firestore()
      .collection(`users/${userId}/accounts`)
      .get();

    const data: Account[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Account, 'id'>),
    }));
    setAccounts(data);

    if (data.length > 0 && !selectedAccountId) {
      setSelectedAccountId(data[0].id);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        onPress: async () => {
          setSelectedAccountId(null);
          setSelectedAccountData(null);
          await AsyncStorage.removeItem('selectedAccountId');
          await auth().signOut();
        },
      },
    ]);
  };

  return (
    <SafeArea style={styles.container}>
      <Text variant="headlineSmall">Profile</Text>

      <Text style={styles.sectionTitle}>Select Account</Text>
      <RadioButton.Group
        onValueChange={setSelectedAccountId}
        value={selectedAccountId || ''}>
        <FlatList
          data={accounts}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <RadioButton.Item
              label={`${item.name} (${item.currency})`}
              value={item.id}
            />
          )}
        />
      </RadioButton.Group>

      <View style={styles.buttonContainer}>
        {accounts.length < 5 && (
          <Button
            mode="outlined"
            onPress={() => setCreateAccountModalVisible(true)}
            style={styles.button}>
            Add Account
          </Button>
        )}
        <Button
          icon="logout"
          mode="contained"
          onPress={handleLogout}
          style={styles.button}>
          Logout
        </Button>
      </View>

      <CreateAccountModal
        visible={createAccountModalVisible}
        onCancel={() => setCreateAccountModalVisible(false)}
        onSubmit={handleCreateAccount}
        form={newAccountForm}
        setForm={setNewAccountForm}
        allowCancel
      />
    </SafeArea>
  );
};

export default ProfileScreen;
