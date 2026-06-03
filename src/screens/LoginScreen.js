import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { COLORS } from '../config/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      let errorMessage = 'Invalid email or password';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      }
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.topGlow} />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Text style={styles.logoIcon}>🎓</Text>
            </View>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>AI</Text>
            </View>
          </View>
        </View>

        <Text style={styles.appName}>RPREP</Text>
        <Text style={styles.subtitle}>YOUR NURSING SUCCESS PARTNER</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>📧</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.loginButtonText}>⚡ ENTER PLATFORM</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>NEW TO EDUTECH?</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity 
          style={styles.signupButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.signupButtonText}>🚀 Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Your Nursing Success Partner
        </Text>
      </View>
      
      <View style={styles.bottomGlow} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topGlow: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 245, 255, 0.03)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 245, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(0, 245, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  logoInner: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 35,
  },
  logoBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  logoBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: COLORS.glow.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 5,
    marginBottom: 40,
  },
  inputContainer: {
    gap: 15,
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 16,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textSecondary,
    marginHorizontal: 15,
    fontSize: 11,
    letterSpacing: 2,
  },
  signupButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  signupButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 30,
    fontSize: 11,
    letterSpacing: 1,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(123, 47, 255, 0.03)',
  },
});
