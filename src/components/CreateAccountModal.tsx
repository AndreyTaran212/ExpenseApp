import React from 'react';
import {View, Modal, StyleSheet, TextInput, Text} from 'react-native';
import {Button} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import {NewAccountForm} from '../types';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  form: NewAccountForm;
  setForm: (form: NewAccountForm) => void;
  allowCancel?: boolean;
}

export const CreateAccountModal: React.FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  form,
  setForm,
  allowCancel = true,
}) => {
  const [currencyOpen, setCurrencyOpen] = React.useState(false);
  const [currencyItems, setCurrencyItems] = React.useState([
    {label: 'USD', value: 'USD'},
    {label: 'EUR', value: 'EUR'},
    {label: 'UAH', value: 'UAH'},
    {label: 'GBP', value: 'GBP'},
  ]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create New Account</Text>

          <TextInput
            placeholder="Account Name"
            value={form.name}
            onChangeText={text => setForm({...form, name: text})}
            style={styles.input}
          />

          <Text style={styles.label}>Currency</Text>
          <DropDownPicker
            open={currencyOpen}
            value={form.currency}
            items={currencyItems}
            setOpen={setCurrencyOpen}
            setValue={val => setForm({...form, currency: val()})}
            setItems={setCurrencyItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          <View style={styles.buttons}>
            {allowCancel && (
              <Button mode="outlined" onPress={onCancel} style={styles.button}>
                Cancel
              </Button>
            )}
            <Button mode="contained" onPress={onSubmit} style={styles.button}>
              Create
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  dropdown: {
    marginBottom: 10,
    borderColor: '#ccc',
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
