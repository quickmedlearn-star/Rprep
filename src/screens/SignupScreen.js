import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUserProfile } from '../services/userService';
import { COLORS } from '../config/theme';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Please enter your full name'); return; }
    if (!email.trim()) { Alert.alert('Error', 'Please enter your email'); return; }
    if (!password) { Alert.alert('Error', 'Please enter password'); return; }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match!'); return; }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Firestore me user profile create karo
      await createUserProfile(userCredential.user, name);
      setLoading(false);
      Alert.alert('Success! 🎉', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      setLoading(false);
      let msg = 'Something went wrong';
      if (error.code === 'auth/email-already-in-use') msg = 'Email already registered';
      else if (error.code === 'auth/invalid-email') msg = 'Invalid email';
      else if (error.code === 'auth/weak-password') msg = 'Password too weak';
      Alert.alert('Error', msg);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Join RPREP</Text>
        <Text style={styles.subheading}>Your Nursing Success Partner</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={COLORS.textSecondary} value={name} onChangeText={setName} autoCapitalize="words" />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>📧</Text>
            <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={COLORS.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput style={styles.input} placeholder="Create Password" placeholderTextColor={COLORS.textSecondary} value={password} onChangeText={setPassword} secureTextEntry />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔐</Text>
            <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor={COLORS.textSecondary} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          </View>
        </View>

        <TouchableOpacity style={[styles.signupButton, loading && styles.disabled]} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupButtonText}>🚀 CREATE ACCOUNT</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLinkText}>Already registered? <Text style={styles.loginLinkHighlight}>Login</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25, paddingVertical: 40 },
  heading: { fontSize: 34, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', textShadowColor: COLORS.glow.primary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 15, marginBottom: 8 },
  subheading: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 30 },
  inputContainer: { gap: 15, marginBottom: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 15 },
  inputIcon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, color: COLORS.text, fontSize: 16, paddingVertical: 16 },
  signupButton: { backgroundColor: COLORS.secondary, padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  disabled: { opacity: 0.7 },
  signupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loginLink: { alignItems: 'center' },
  loginLinkText: { color: COLORS.textSecondary, fontSize: 14 },
  loginLinkHighlight: { color: COLORS.primary, fontWeight: 'bold' },
});
