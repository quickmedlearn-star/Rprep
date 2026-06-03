import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SubjectTestScreen({ navigation }) {
  const subjects = [
    { name: 'Nursing Fundamentals', icon: '🏥', questions: 800, color: COLORS.primary, topics: 25 },
    { name: 'Anatomy & Physiology', icon: '🦴', questions: 650, color: '#FF6B6B', topics: 20 },
    { name: 'Pharmacology', icon: '💊', questions: 700, color: '#4ECDC4', topics: 22 },
    { name: 'Pathology', icon: '🔬', questions: 500, color: '#FFE66D', topics: 18 },
    { name: 'Microbiology', icon: '🧫', questions: 450, color: '#FF8C42', topics: 15 },
    { name: 'Biochemistry', icon: '🧪', questions: 350, color: '#A8E6CF', topics: 12 },
    { name: 'Nutrition & Dietetics', icon: '🍎', questions: 300, color: '#FFB347', topics: 10 },
    { name: 'Community Health', icon: '🏘️', questions: 400, color: '#87CEEB', topics: 14 },
    { name: 'Child Health Nursing', icon: '👶', questions: 450, color: '#FF69B4', topics: 16 },
    { name: 'Mental Health Nursing', icon: '🧠', questions: 350, color: '#DDA0DD', topics: 12 },
    { name: 'Obstetrics & Gynecology', icon: '🤰', questions: 500, color: '#FFB6C1', topics: 18 },
    { name: 'Medical Surgical', icon: '💉', questions: 750, color: '#20B2AA', topics: 24 },
    { name: 'Nursing Research', icon: '📊', questions: 250, color: '#B8860B', topics: 8 },
    { name: 'Nursing Management', icon: '📋', questions: 300, color: '#708090', topics: 10 },
    { name: 'First Aid & Emergency', icon: '🚑', questions: 350, color: '#DC143C', topics: 12 },
    { name: 'Infection Control', icon: '🛡️', questions: 200, color: '#228B22', topics: 8 },
  ];

  return (
    <View style={styles.container}>
      <Header title="Subject Test" subtitle="Topic-wise practice" showBack onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scrollArea}>
        
        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>16</Text>
            <Text style={styles.statLabel}>Subjects</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>7500+</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>244</Text>
            <Text style={styles.statLabel}>Topics</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>📚 All Subjects</Text>
        
        {subjects.map((item, index) => (
          <TouchableOpacity key={index} style={styles.subjectCard}>
            <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
              <Text style={styles.subjectIcon}>{item.icon}</Text>
            </View>
            <View style={styles.subjectInfo}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>{item.name}</Text>
              </View>
              <View style={styles.subjectMeta}>
                <Text style={styles.metaText}>📝 {item.questions} Questions</Text>
                <Text style={styles.metaText}>📋 {item.topics} Topics</Text>
              </View>
              {/* Progress Bar */}
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.floor(Math.random() * 60) + 10}%`, backgroundColor: item.color }]} />
              </View>
              <Text style={styles.progressText}>Tap to start practice</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
      <Footer navigation={navigation} activeTab="SubjectTest" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  statsBanner: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.surface, borderRadius: 15, padding: 18, marginTop: 20, marginBottom: 5, borderWidth: 1, borderColor: COLORS.border },
  statItem: { alignItems: 'center' },
  statValue: { color: COLORS.primary, fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, marginTop: 3 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.1)' },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginTop: 25, marginBottom: 15 },
  subjectCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 55, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  subjectIcon: { fontSize: 28 },
  subjectInfo: { flex: 1 },
  subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  subjectName: { color: COLORS.text, fontSize: 15, fontWeight: 'bold' },
  subjectMeta: { flexDirection: 'row', gap: 15, marginBottom: 8 },
  metaText: { color: COLORS.textSecondary, fontSize: 11 },
  progressBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', marginBottom: 3 },
  progressFill: { height: '100%', borderRadius: 2 },
  progressText: { color: COLORS.textSecondary, fontSize: 9 },
  arrowIcon: { color: COLORS.textSecondary, fontSize: 24, fontWeight: 'bold', marginLeft: 10 },
});
