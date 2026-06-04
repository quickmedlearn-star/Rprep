import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth } from '../config/firebase';
import { getWeakAreas, getTestResults } from '../services/userService';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function WeakAreasScreen({ navigation }) {
  const [weakAreas, setWeakAreas] = useState([]);
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const user = auth.currentUser;
    if (user) {
      const [areas, tests] = await Promise.all([getWeakAreas(user.uid), getTestResults(user.uid)]);
      setWeakAreas(areas); setRecentTests(tests.slice(0, 10));
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header title="RPREP" subtitle="Weak Areas" showBack onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      ) : (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <View style={styles.aiSummary}>
            <Text style={styles.aiIcon}>🤖</Text>
            <View style={styles.aiInfo}><Text style={styles.aiTitle}>AI Analysis</Text>
            <Text style={styles.aiText}>{weakAreas.length > 0 ? `Found ${weakAreas.length} weak subjects` : 'No weak areas detected! Take more tests.'}</Text></View>
          </View>
          {weakAreas.length > 0 && (
            <><Text style={styles.sectionTitle}>📉 Areas to Improve</Text>
            {weakAreas.map((area, i) => (
              <View key={i} style={styles.areaCard}>
                <View style={styles.areaHeader}><Text style={styles.areaSubject}>{area.subject}</Text><Text style={[styles.areaAccuracy, { color: area.accuracy < 40 ? COLORS.accent : area.accuracy < 60 ? COLORS.warning : COLORS.success }]}>{area.accuracy}%</Text></View>
                <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${area.accuracy}%`, backgroundColor: area.accuracy < 40 ? COLORS.accent : area.accuracy < 60 ? COLORS.warning : COLORS.success }]} /></View>
                <View style={styles.tipsCard}><Text style={styles.tipsTitle}>💡 Tips</Text>
                <Text style={styles.tipText}>• Practice 20 MCQs daily</Text>
                <Text style={styles.tipText}>• Review textbooks</Text>
                <TouchableOpacity style={styles.practiceButton} onPress={() => navigation.navigate('MCQ')}><Text style={styles.practiceText}>Start Practice →</Text></TouchableOpacity></View>
              </View>
            ))}</>
          )}
          {weakAreas.length === 0 && (
            <View style={styles.emptyCard}><Text style={styles.emptyIcon}>🎉</Text><Text style={styles.emptyTitle}>All Good!</Text><Text style={styles.emptyText}>No weak areas detected. Keep it up!</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('MCQ')}><Text style={styles.emptyButtonText}>Take Test</Text></TouchableOpacity></View>
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
  aiSummary: { backgroundColor: 'rgba(0,245,255,0.05)', padding: 18, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(0,245,255,0.15)' },
  aiIcon: { fontSize: 35, marginRight: 15 },
  aiInfo: { flex: 1 },
  aiTitle: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' },
  aiText: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  areaCard: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border },
  areaHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  areaSubject: { color: COLORS.text, fontSize: 15, fontWeight: 'bold' },
  areaAccuracy: { fontSize: 18, fontWeight: 'bold' },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', borderRadius: 3 },
  tipsCard: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 12 },
  tipsTitle: { color: COLORS.text, fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  tipText: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 5 },
  practiceButton: { backgroundColor: COLORS.primary, padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  practiceText: { color: COLORS.background, fontSize: 13, fontWeight: 'bold' },
  emptyCard: { backgroundColor: COLORS.surface, padding: 30, borderRadius: 15, alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: COLORS.border },
  emptyIcon: { fontSize: 50, marginBottom: 15 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  emptyText: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 15 },
  emptyButton: { backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
  emptyButtonText: { color: COLORS.background, fontSize: 15, fontWeight: 'bold' },
});
