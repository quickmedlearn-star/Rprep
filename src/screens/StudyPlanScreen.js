import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth } from '../config/firebase';
import { getWeakAreas, getUserProfile } from '../services/userService';
import { getAIResponse } from '../services/aiService';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function StudyPlanScreen({ navigation }) {
  const [weakAreas, setWeakAreas] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = auth.currentUser;
    if (user) {
      const [areas, profile] = await Promise.all([
        getWeakAreas(user.uid),
        getUserProfile(user.uid)
      ]);
      setWeakAreas(areas);
    }
    setLoading(false);
  };

  const generatePlan = async () => {
    setGenerating(true);
    const weakSubjects = weakAreas.map(a => `${a.subject} (${a.accuracy}%)`).join(', ');
    const prompt = `Create a 7-day study plan for nursing officer exam preparation. My weak areas: ${weakSubjects || 'general nursing subjects'}. Include daily schedule with time slots, topics to cover, and MCQ practice targets. Keep it practical and encouraging.`;
    
    const response = await getAIResponse(prompt);
    setPlan(response.text);
    setGenerating(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Smart Study Plan" subtitle="AI-Powered" showBack onBack={() => navigation.goBack()} />
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      ) : (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          
          <View style={styles.aiCard}>
            <Text style={styles.aiIcon}>🧠</Text>
            <Text style={styles.aiTitle}>AI Smart Study Plan</Text>
            <Text style={styles.aiText}>Based on your performance, weak areas and exam date, AI will create a personalized study plan for you.</Text>
          </View>

          {weakAreas.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>📊 Your Weak Areas</Text>
              <View style={styles.weakCard}>
                {weakAreas.map((area, i) => (
                  <View key={i} style={styles.weakRow}>
                    <Text style={styles.weakSubject}>{area.subject}</Text>
                    <View style={styles.weakBar}>
                      <View style={[styles.weakFill, { width: `${area.accuracy}%` }]} />
                    </View>
                    <Text style={styles.weakPercent}>{area.accuracy}%</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {!plan && (
            <TouchableOpacity style={styles.generateBtn} onPress={generatePlan} disabled={generating}>
              {generating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.generateText}>🚀 Generate My Study Plan</Text>
              )}
            </TouchableOpacity>
          )}

          {plan && (
            <View style={styles.planCard}>
              <Text style={styles.planTitle}>📋 Your Personalized Plan</Text>
              <Text style={styles.planText}>{plan}</Text>
              <TouchableOpacity style={styles.regenerateBtn} onPress={generatePlan} disabled={generating}>
                <Text style={styles.regenerateText}>🔄 Regenerate Plan</Text>
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
  aiCard: { backgroundColor: 'rgba(0,245,255,0.05)', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(0,245,255,0.15)' },
  aiIcon: { fontSize: 50, marginBottom: 10 },
  aiTitle: { color: COLORS.primary, fontSize: 20, fontWeight: 'bold' },
  aiText: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 18 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  weakCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  weakRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  weakSubject: { color: COLORS.text, fontSize: 12, width: 100 },
  weakBar: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden', marginHorizontal: 10 },
  weakFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 3 },
  weakPercent: { color: COLORS.accent, fontSize: 11, fontWeight: 'bold', width: 35 },
  generateBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 25 },
  generateText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' },
  planCard: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 15, marginTop: 20, borderWidth: 1, borderColor: COLORS.primary },
  planTitle: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  planText: { color: COLORS.text, fontSize: 14, lineHeight: 24 },
  regenerateBtn: { backgroundColor: COLORS.surfaceLight, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  regenerateText: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
});
