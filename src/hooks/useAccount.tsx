import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccountData {
  name: string;
  currency: string;
}

interface AccountContextProps {
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
  selectedAccountData: AccountData | null;
  setSelectedAccountData: (data: AccountData | null) => void;
}

const AccountContext = createContext<AccountContextProps | undefined>(
  undefined,
);

export const useAccount = (): AccountContextProps => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

export const AccountProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [selectedAccountId, setSelectedAccountIdState] = useState<
    string | null
  >(null);
  const [selectedAccountData, setSelectedAccountData] =
    useState<AccountData | null>(null);

  useEffect(() => {
    const loadAccount = async () => {
      const storedId = await AsyncStorage.getItem('selectedAccountId');
      console.log('storedId');
      console.log(storedId);
      if (storedId) {
        setSelectedAccountIdState(storedId);
      }
    };
    loadAccount();
  }, []);

  const setSelectedAccountId = (id: string | null) => {
    setSelectedAccountIdState(id);
    if (id) {
      AsyncStorage.setItem('selectedAccountId', id);
    } else {
      AsyncStorage.removeItem('selectedAccountId');
    }
  };

  return (
    <AccountContext.Provider
      value={{
        selectedAccountId,
        setSelectedAccountId,
        selectedAccountData,
        setSelectedAccountData,
      }}>
      {children}
    </AccountContext.Provider>
  );
};
