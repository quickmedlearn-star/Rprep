import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth } from '../config/firebase';
import { getTestResults } from '../services/userService';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TestHistoryScreen({ navigation }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadResults(); }, []);

  const loadResults = async () => {
    const user = auth.currentUser;
    if (user) {
      const data = await getTestResults(user.uid);
      setResults(data);
    }
    setLoading(false);
  };

  const getScoreColor = (accuracy) => {
    if (accuracy >= 70) return COLORS.success;
    if (accuracy >= 50) return COLORS.warning;
    return COLORS.accent;
  };

  const totalTests = results.length;
  const avgAccuracy = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length) : 0;
  const bestScore = results.length > 0 ? Math.max(...results.map(r => r.accuracy)) : 0;

  return (
    <View style={styles.container}>
      <Header title="Test History" subtitle="All your past tests" showBack onBack={() => navigation.goBack()} />
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      ) : (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          
          {results.length > 0 ? (
            <>
              {/* Summary Cards */}
              <View style={styles.summaryRow}>
                <View style={[styles.summaryCard, { borderColor: COLORS.primary }]}>
                  <Text style={styles.summaryValue}>{totalTests}</Text>
                  <Text style={styles.summaryLabel}>Total Tests</Text>
                </View>
                <View style={[styles.summaryCard, { borderColor: COLORS.success }]}>
                  <Text style={styles.summaryValue}>{avgAccuracy}%</Text>
                  <Text style={styles.summaryLabel}>Avg Accuracy</Text>
                </View>
                <View style={[styles.summaryCard, { borderColor: COLORS.warning }]}>
                  <Text style={styles.summaryValue}>{bestScore}%</Text>
                  <Text style={styles.summaryLabel}>Best Score</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>⏱️ All Tests ({totalTests})</Text>
              
              {results.map((test, index) => (
                <TouchableOpacity key={test.id || index} style={styles.testCard}>
                  <View style={styles.testHeader}>
                    <View style={styles.testIcon}>
                      <Text style={styles.testIconText}>
                        {test.accuracy >= 70 ? '✅' : test.accuracy >= 50 ? '⚠️' : '❌'}
                      </Text>
                    </View>
                    <View style={styles.testInfo}>
                      <Text style={styles.testSubject}>{test.subject || 'General Test'}</Text>
                      <Text style={styles.testDate}>
                        {new Date(test.timestamp).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'short', year: 'numeric', 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </Text>
                    </View>
                    <View style={styles.testScore}>
                      <Text style={[styles.scoreValue, { color: getScoreColor(test.accuracy) }]}>
                        {test.accuracy}%
                      </Text>
                      <Text style={styles.scoreFraction}>{test.score}/{test.total}</Text>
                    </View>
                  </View>
                  
                  {/* Mini progress bar */}
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { 
                      width: `${test.accuracy}%`, 
                      backgroundColor: getScoreColor(test.accuracy) 
                    }]} />
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No Tests Yet</Text>
              <Text style={styles.emptyText}>Take your first test to see history here!</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('MCQ')}>
                <Text style={styles.emptyButtonText}>Start Test</Text>
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
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 5 },
  summaryCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, alignItems: 'center', width: '31%', borderWidth: 1 },
  summaryValue: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  summaryLabel: { color: COLORS.textSecondary, fontSize: 9, marginTop: 4, textAlign: 'center' },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  testCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  testHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  testIcon: { width: 35, height: 35, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  testIconText: { fontSize: 16 },
  testInfo: { flex: 1 },
  testSubject: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  testDate: { color: COLORS.textSecondary, fontSize: 10, marginTop: 2 },
  testScore: { alignItems: 'flex-end' },
  scoreValue: { fontSize: 18, fontWeight: 'bold' },
  scoreFraction: { color: COLORS.textSecondary, fontSize: 10 },
  progressBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  emptyCard: { backgroundColor: COLORS.surface, padding: 30, borderRadius: 15, alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: COLORS.border },
  emptyIcon: { fontSize: 50, marginBottom: 15 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  emptyText: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 15 },
  emptyButton: { backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
  emptyButtonText: { color: COLORS.background, fontSize: 15, fontWeight: 'bold' },
});
