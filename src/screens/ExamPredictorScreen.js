import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth } from '../config/firebase';
import { getTestResults, getUserProfile } from '../services/userService';
import { getAIResponse } from '../services/aiService';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ExamPredictorScreen({ navigation }) {
  const [results, setResults] = useState([]);
  const [profile, setProfile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const user = auth.currentUser;
    if (user) {
      const [testResults, userProfile] = await Promise.all([
        getTestResults(user.uid),
        getUserProfile(user.uid)
      ]);
      setResults(testResults);
      setProfile(userProfile);
    }
    setLoading(false);
  };

  const avgAccuracy = results.length > 0 
    ? Math.round(results.reduce((s, r) => s + r.accuracy, 0) / results.length) 
    : 0;
  const totalTests = results.length;
  const trend = results.length >= 2 
    ? results[0].accuracy - results[results.length - 1].accuracy 
    : 0;

  const generatePrediction = async () => {
    setPredicting(true);
    const prompt = `Based on my nursing exam preparation: ${totalTests} tests taken, average accuracy ${avgAccuracy}%, recent trend ${trend > 0 ? 'improving' : 'declining'}. Predict my potential score in upcoming nursing officer exam (out of 200 marks, 200 questions). Give me a realistic score range, percentile prediction, and 3 specific tips to improve. Keep it motivating.`;
    
    const response = await getAIResponse(prompt);
    setPrediction(response.text);
    setPredicting(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Exam Predictor" subtitle="AI Score Prediction" showBack onBack={() => navigation.goBack()} />
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      ) : (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          
          <View style={styles.heroCard}>
            <Text style={styles.heroIcon}>🔮</Text>
            <Text style={styles.heroTitle}>AI Exam Predictor</Text>
            <Text style={styles.heroText}>Predict your nursing officer exam score based on your practice performance</Text>
          </View>

          {results.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>📊 Your Stats</Text>
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, { borderColor: COLORS.primary }]}>
                  <Text style={styles.statValue}>{totalTests}</Text>
                  <Text style={styles.statLabel}>Tests Taken</Text>
                </View>
                <View style={[styles.statCard, { borderColor: COLORS.success }]}>
                  <Text style={styles.statValue}>{avgAccuracy}%</Text>
                  <Text style={styles.statLabel}>Avg Accuracy</Text>
                </View>
                <View style={[styles.statCard, { borderColor: trend > 0 ? COLORS.success : COLORS.accent }]}>
                  <Text style={styles.statValue}>{trend > 0 ? '📈' : '📉'}</Text>
                  <Text style={styles.statLabel}>Trend</Text>
                </View>
              </View>

              {!prediction && (
                <TouchableOpacity style={styles.predictBtn} onPress={generatePrediction} disabled={predicting}>
                  {predicting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.predictText}>🔮 Predict My Score</Text>
                  )}
                </TouchableOpacity>
              )}

              {prediction && (
                <View style={styles.predictionCard}>
                  <Text style={styles.predictionTitle}>📋 Your Prediction</Text>
                  <Text style={styles.predictionText}>{prediction}</Text>
                  <TouchableOpacity style={styles.retryBtn} onPress={generatePrediction} disabled={predicting}>
                    <Text style={styles.retryText}>🔄 Refresh Prediction</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>Not Enough Data</Text>
              <Text style={styles.emptyText}>Take at least 3 tests to get AI score prediction</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('MCQ')}>
                <Text style={styles.emptyBtnText}>Take a Test</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
      
      <Footer navigation={navigation} activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  heroCard: { backgroundColor: 'rgba(123,47,255,0.05)', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)' },
  heroIcon: { fontSize: 50, marginBottom: 10 },
  heroTitle: { color: COLORS.secondary, fontSize: 20, fontWeight: 'bold' },
  heroText: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 18 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 12, alignItems: 'center', width: '31%', borderWidth: 1 },
  statValue: { color: COLORS.text, fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, marginTop: 4 },
  predictBtn: { backgroundColor: COLORS.secondary, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 25 },
  predictText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  predictionCard: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 15, marginTop: 20, borderWidth: 1, borderColor: COLORS.secondary },
  predictionTitle: { color: COLORS.secondary, fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  predictionText: { color: COLORS.text, fontSize: 14, lineHeight: 24 },
  retryBtn: { backgroundColor: COLORS.surfaceLight, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  retryText: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  emptyCard: { backgroundColor: COLORS.surface, padding: 30, borderRadius: 15, alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: COLORS.border },
  emptyIcon: { fontSize: 50, marginBottom: 15 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  emptyText: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', marginBottom: 15 },
  emptyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
  emptyBtnText: { color: COLORS.background, fontSize: 15, fontWeight: 'bold' },
});
