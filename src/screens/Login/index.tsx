import React, {useState, useCallback} from 'react';
import {TextInput, Button, Title, Text, useTheme} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {useLoginScreenStyles} from './Login.styles.ts';
import ThemeButton from '../../components/ThemeButton.tsx';
import SafeView from '../../components/SafeArea.tsx';
import {getCurrentUserId} from '../../utils/firebaseService.ts';

const LoginScreen = () => {
  const theme = useTheme();
  const styles = useLoginScreenStyles(theme);
  const [isLogin, setIsLogin] = useState(true);
  const userId = getCurrentUserId();
  console.log('userId');
  console.log(userId);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    firebase?: string;
  }>({});

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'Enter a valid email';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors(prev => ({...prev, firebase: undefined}));

    try {
      if (isLogin) {
        await auth().signInWithEmailAndPassword(email, password);
      } else {
        await auth().createUserWithEmailAndPassword(email, password);
      }
    } catch (error: any) {
      let message = 'Something went wrong.';

      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email format.';
      } else if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/credential-already-in-use'
      ) {
        message = 'No account found with this email.';
      }
      setErrors(prev => ({...prev, firebase: message}));
    } finally {
      setLoading(false);
    }
  }, [validate, isLogin, email, password]);

  return (
    <SafeView style={styles.container}>
      <Title style={styles.title}>{isLogin ? 'Login' : 'Auth'}</Title>
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        error={!!errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={!!errors.password}
        style={styles.input}
      />
      {!!errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      {!!errors.firebase && (
        <Text style={styles.errorText}>{errors.firebase}</Text>
      )}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Login
      </Button>
      <Text
        style={{
          marginTop: 16,
          textAlign: 'center',
          color: theme.colors.primary,
          textDecorationLine: 'underline',
        }}
        onPress={() => {
          setErrors({});
          setIsLogin(prev => !prev);
        }}>
        {isLogin
          ? "Don't have an account? Sign up"
          : 'Already have an account? Login'}
      </Text>
      <ThemeButton />
    </SafeView>
  );
};

export default LoginScreen;
