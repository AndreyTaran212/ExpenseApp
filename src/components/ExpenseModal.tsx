import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import {ExpenseForm, ValidationErrors} from '../types';

interface Props {
  form: ExpenseForm;
  setForm: (form: ExpenseForm) => void;
  onCancel: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  validationErrors: ValidationErrors;
  categoryItems: {label: string; value: string}[];
}

export const ExpenseModal: React.FC<Props> = ({
  form,
  setForm,
  onCancel,
  onSubmit,
  onDelete,
  validationErrors,
  categoryItems,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState(categoryItems);

  return (
    <View style={styles.modal}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Add Expense</Text>
        {onDelete && (
          <IconButton
            icon="trash-can"
            size={24}
            onPress={onDelete}
            iconColor="#000"
          />
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={form.title}
        onChangeText={text => setForm({...form, title: text})}
      />
      {validationErrors.title && (
        <Text style={styles.errorText}>{validationErrors.title}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="decimal-pad"
        value={form.amount}
        onChangeText={text =>
          setForm({...form, amount: text.replace(/[^0-9.]/g, '')})
        }
      />
      {validationErrors.amount && (
        <Text style={styles.errorText}>{validationErrors.amount}</Text>
      )}

      <Text style={styles.label}>Category</Text>
      <DropDownPicker
        open={categoryOpen}
        value={form.category}
        items={categoryOptions}
        setOpen={setCategoryOpen}
        setValue={val => setForm({...form, category: val()})}
        setItems={setCategoryOptions}
        style={styles.dropdown}
        dropDownContainerStyle={{borderColor: '#ccc'}}
        zIndex={10000}
      />

      <Text style={styles.label}>Date & Time</Text>

      {Platform.OS === 'ios' ? (
        <DateTimePicker
          value={form.date}
          mode="datetime"
          display="default"
          onChange={(event, date) => {
            if (date) setForm({...form, date});
          }}
          style={{backgroundColor: '#fff'}}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}>
            <Text>{form.date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowTimePicker(true)}>
            <Text>
              {form.date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={form.date}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (!date) return;
                const updated = new Date(form.date);
                updated.setFullYear(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                );
                setForm({...form, date: updated});
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={form.date}
              mode="time"
              display="default"
              onChange={(event, time) => {
                setShowTimePicker(false);
                if (!time) return;
                const updated = new Date(form.date);
                updated.setHours(time.getHours(), time.getMinutes());
                setForm({...form, date: updated});
              }}
            />
          )}
        </>
      )}

      {validationErrors.date && (
        <Text style={styles.errorText}>{validationErrors.date}</Text>
      )}

      <View style={styles.buttonRow}>
        <Button mode="contained" onPress={onCancel} buttonColor="red">
          Cancel
        </Button>
        <Button mode="contained" onPress={onSubmit}>
          {onDelete ? 'Update' : 'Add'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  dropdown: {
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    zIndex: 10000,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 6,
    marginTop: -6,
  },
  label: {
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 4,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
