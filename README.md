# 📱 Expense Manager App

A cross-platform mobile app built with **React Native**, using **Firebase** to help users manage their personal expenses across multiple accounts.

---

## 🚀 Features

- ✅ Firebase Authentication (Email/Password)
- ✅ Multiple accounts (e.g., USD, UAH, etc.)
- ✅ Add / Edit / Delete expenses with:
    - Title, Amount, Category, Date & Time
- ✅ Filter by category and sort by date
- ✅ Prevents adding future-dated expenses
- ✅ Account selection + persistence
- ✅ Monthly reports grouped by category
- ✅ Consistent date format across platforms

---

## 🛠 Tech Stack

- React Native + TypeScript
- Firebase (Auth + Firestore)
- React Native Paper UI
- AsyncStorage for local persistence
- React Navigation for routing
- DropDownPicker for multi-category filters
- DateTimePicker for date/time input

---

## ⚙️ Setup Instructions

### 1. Clone the project


### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the app

#### Metro bundler
```bash
npm start
```

#### Android
```bash
npm run android
```

#### iOS
```bash
cd ios
pod install
cd..
npm run ios
```

---

## 💡 Notes

- Selected account ID is persisted using `AsyncStorage`
- Account is required on first login unless user already has one
- Date validation blocks future timestamps

---

## 👨‍💻 Author

**Andrii Taran**  
taranandrej342@gmail.com
