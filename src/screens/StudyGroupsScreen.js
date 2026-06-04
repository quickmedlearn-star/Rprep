import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const groups = [
  { name: 'AIIMS NORCET Prep', members: 1250, active: 89, icon: '🏥', topic: 'AIIMS exam discussion & tips' },
  { name: 'Pharmacology Masters', members: 850, active: 45, icon: '💊', topic: 'Drug classifications & MCQs' },
  { name: 'Nursing Officer 2026', members: 3200, active: 156, icon: '👩‍⚕️', topic: 'All nursing officer exams' },
  { name: 'Anatomy Study Circle', members: 620, active: 32, icon: '🦴', topic: 'Diagrams, mnemonics & tests' },
];

export default function StudyGroupsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Study Groups" subtitle="Learn together" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>👥</Text>
          <Text style={styles.heroTitle}>Study Groups</Text>
          <Text style={styles.heroText}>Join communities of nursing aspirants. Discuss, share notes, and prepare together!</Text>
        </View>

        <TouchableOpacity style={styles.createBtn}>
          <Text style={styles.createText}>➕ Create New Group</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>🔥 Popular Groups</Text>
        
        {groups.map((group, i) => (
          <TouchableOpacity key={i} style={styles.groupCard}>
            <View style={styles.groupIcon}>
              <Text style={styles.groupEmoji}>{group.icon}</Text>
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupTopic}>{group.topic}</Text>
              <View style={styles.groupMeta}>
                <Text style={styles.metaText}>👥 {group.members} members</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaActive}>🟢 {group.active} online</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.joinBtn}>
              <Text style={styles.joinText}>Join</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
      
      <Footer navigation={navigation} activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  heroCard: { backgroundColor: 'rgba(123,47,255,0.05)', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)' },
  heroIcon: { fontSize: 45, marginBottom: 8 },
  heroTitle: { color: COLORS.secondary, fontSize: 20, fontWeight: 'bold' },
  heroText: { color: COLORS.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 8 },
  createBtn: { backgroundColor: COLORS.secondary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  createText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  groupCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  groupIcon: { width: 50, height: 50, borderRadius: 15, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  groupEmoji: { fontSize: 25 },
  groupInfo: { flex: 1 },
  groupName: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  groupTopic: { color: COLORS.textSecondary, fontSize: 11, marginTop: 3 },
  groupMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  metaText: { color: COLORS.textSecondary, fontSize: 10 },
  metaDot: { color: COLORS.textSecondary, fontSize: 10, marginHorizontal: 5 },
  metaActive: { color: COLORS.success, fontSize: 10 },
  joinBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 10 },
  joinText: { color: COLORS.background, fontSize: 12, fontWeight: 'bold' },
});
