import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SubjectTestScreen({ navigation }) {
  const subjects = [
    { name: 'Anatomy', icon: '🦴', questions: 500 },
    { name: 'Physiology', icon: '🧬', questions: 450 },
    { name: 'Pharmacology', icon: '💊', questions: 600 },
    { name: 'Pathology', icon: '🔬', questions: 400 },
    { name: 'Microbiology', icon: '🧫', questions: 350 },
    { name: 'Nutrition', icon: '🍎', questions: 300 },
    { name: 'Nursing Fundamentals', icon: '🏥', questions: 800 },
    { name: 'Community Health', icon: '🏘️', questions: 250 },
  ];

  return (
    <View style={styles.container}>
      <Header title="Subject Test" subtitle="Choose your subject" showMenu onMenu={() => navigation.openDrawer?.()} />
      <ScrollView style={styles.scrollArea}>
        <Text style={styles.sectionTitle}>📚 All Subjects</Text>
        <View style={styles.subjectsGrid}>
          {subjects.map((subject, index) => (
            <TouchableOpacity key={index} style={styles.subjectCard}>
              <Text style={styles.subjectIcon}>{subject.icon}</Text>
              <Text style={styles.subjectName}>{subject.name}</Text>
              <Text style={styles.subjectQuestions}>{subject.questions} Qs</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Footer navigation={navigation} activeTab="SubjectTest" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 15 },
  subjectsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  subjectCard: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 15, width: '48%', marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  subjectIcon: { fontSize: 35, marginBottom: 10 },
  subjectName: { color: COLORS.text, fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  subjectQuestions: { color: COLORS.textSecondary, fontSize: 11, marginTop: 5 },
});
