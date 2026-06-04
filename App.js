import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import MCQScreen from './src/screens/MCQScreen';
import SubjectTestScreen from './src/screens/SubjectTestScreen';
import TestSeriesScreen from './src/screens/TestSeriesScreen';
import SettingsScreen from "./src/screens/SettingsScreen";
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import DailyQuizScreen from './src/screens/DailyQuizScreen';
import ProgressScreen from "./src/screens/ProgressScreen";
import WeakAreasScreen from "./src/screens/WeakAreasScreen";
import TestHistoryScreen from "./src/screens/TestHistoryScreen";
import BookmarkedScreen from "./src/screens/BookmarkedScreen";
import AITutorScreen from "./src/screens/AITutorScreen";
import StudyPlanScreen from "./src/screens/StudyPlanScreen";
import ExamPredictorScreen from "./src/screens/ExamPredictorScreen";
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MCQ" component={MCQScreen} />
      <Stack.Screen name="SubjectTest" component={SubjectTestScreen} />
      <Stack.Screen name="TestSeries" component={TestSeriesScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="DailyQuiz" component={DailyQuizScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
      <Stack.Screen name="WeakAreas" component={WeakAreasScreen} />
      <Stack.Screen name="TestHistory" component={TestHistoryScreen} />
      <Stack.Screen name="Bookmarked" component={BookmarkedScreen} />
      <Stack.Screen name="AITutor" component={AITutorScreen} />
      <Stack.Screen name="StudyPlan" component={StudyPlanScreen} />
      <Stack.Screen name="ExamPredictor" component={ExamPredictorScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A1A' }}>
        <ActivityIndicator size="large" color="#00F5FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
