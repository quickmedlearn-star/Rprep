import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth } from '../config/firebase';
import { getUserProfile, getTestResults, getWeakAreas } from '../services/userService';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProgressScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    const user = auth.currentUser;
    if (user) {
      const [prof, testResults, weak] = await Promise.all([
        getUserProfile(user.uid), getTestResults(user.uid), getWeakAreas(user.uid)
      ]);
      setProfile(prof); setResults(testResults); setWeakAreas(weak);
    }
    setLoading(false);
  };

  const calculateAccuracy = () => {
    if (!profile || profile.totalQuestions === 0) return 0;
    return Math.round((profile.correctAnswers / profile.totalQuestions) * 100);
  };

  const subjectProgress = {};
  results.forEach(r => {
    if (!subjectProgress[r.subject]) subjectProgress[r.subject] = { total: 0, correct: 0 };
    subjectProgress[r.subject].total += r.total;
    subjectProgress[r.subject].correct += r.score;
  });
  const subjectList = Object.entries(subjectProgress).map(([name, data]) => ({
    name, progress: Math.round((data.correct / data.total) * 100),
  })).sort((a, b) => b.progress - a.progress);

  return (
    <View style={styles.container}>
      <Header title="RPREP" subtitle="My Progress" showBack onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      ) : (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderColor: COLORS.primary }]}><Text style={styles.statIcon}>📝</Text><Text style={styles.statValue}>{profile?.testsCompleted || 0}</Text><Text style={styles.statLabel}>Tests</Text></View>
            <View style={[styles.statCard, { borderColor: COLORS.success }]}><Text style={styles.statIcon}>✅</Text><Text style={styles.statValue}>{profile?.correctAnswers || 0}</Text><Text style={styles.statLabel}>Correct</Text></View>
            <View style={[styles.statCard, { borderColor: COLORS.warning }]}><Text style={styles.statIcon}>🎯</Text><Text style={styles.statValue}>{calculateAccuracy()}%</Text><Text style={styles.statLabel}>Accuracy</Text></View>
            <View style={[styles.statCard, { borderColor: COLORS.secondary }]}><Text style={styles.statIcon}>📊</Text><Text style={styles.statValue}>{profile?.xp || 0}</Text><Text style={styles.statLabel}>XP</Text></View>
          </View>
          {results.length > 0 && (
            <><Text style={styles.sectionTitle}>📊 Overall</Text>
            <View style={styles.overallCard}><View style={styles.overallHeader}><Text style={styles.overallTitle}>Accuracy</Text><Text style={styles.overallPercent}>{calculateAccuracy()}%</Text></View>
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${calculateAccuracy()}%` }]} /></View></View></>
          )}
          {subjectList.length > 0 && (
            <><Text style={styles.sectionTitle}>📚 Subjects</Text>
            {subjectList.map((s, i) => (
              <View key={i} style={styles.subjectRow}><View style={styles.subjectHeader}><Text style={styles.subjectName}>{s.name}</Text><Text style={[styles.subjectPercent, { color: s.progress >= 70 ? COLORS.success : s.progress >= 50 ? COLORS.warning : COLORS.accent }]}>{s.progress}%</Text></View>
              <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${s.progress}%`, backgroundColor: s.progress >= 70 ? COLORS.success : s.progress >= 50 ? COLORS.warning : COLORS.accent }]} /></View></View>
            ))}</>
          )}
          {weakAreas.length > 0 && (
            <><Text style={styles.sectionTitle}>🤖 Weak Areas</Text>
            <View style={styles.weakCard}>{weakAreas.slice(0,4).map((a,i) => (
              <View key={i} style={styles.weakItem}><Text style={styles.weakIcon}>📉</Text><View style={styles.weakInfo}><Text style={styles.weakName}>{a.subject}</Text><Text style={styles.weakDetail}>{a.accuracy}%</Text></View></View>
            ))}</View></>
          )}
          {results.length === 0 && (
            <View style={styles.emptyCard}><Text style={styles.emptyIcon}>📊</Text><Text style={styles.emptyTitle}>No Data</Text><Text style={styles.emptyText}>Take a test first!</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('MCQ')}><Text style={styles.emptyButtonText}>Start Test</Text></TouchableOpacity></View>
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
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  statCard: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 15, width: '48%', marginBottom: 12, borderWidth: 1, alignItems: 'center' },
  statIcon: { fontSize: 30, marginBottom: 8 },
  statValue: { color: COLORS.text, fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: COLORS.textSecondary, fontSize: 11, marginTop: 4 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  overallCard: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border },
  overallHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  overallTitle: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  overallPercent: { color: COLORS.primary, fontSize: 20, fontWeight: 'bold' },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  subjectRow: { marginBottom: 12 },
  subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  subjectName: { color: COLORS.text, fontSize: 13 },
  subjectPercent: { fontSize: 13, fontWeight: 'bold' },
  weakCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,45,149,0.2)' },
  weakItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  weakIcon: { fontSize: 18, marginRight: 10 },
  weakInfo: { flex: 1 },
  weakName: { color: COLORS.text, fontSize: 13, fontWeight: 'bold' },
  weakDetail: { color: COLORS.textSecondary, fontSize: 11 },
  emptyCard: { backgroundColor: COLORS.surface, padding: 30, borderRadius: 15, alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: COLORS.border },
  emptyIcon: { fontSize: 50, marginBottom: 15 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  emptyText: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 15 },
  emptyButton: { backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
  emptyButtonText: { color: COLORS.background, fontSize: 15, fontWeight: 'bold' },
});
