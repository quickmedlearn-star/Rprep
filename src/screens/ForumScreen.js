import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const discussions = [
  { id: 1, user: 'Priya S.', avatar: '👩‍⚕️', question: 'Best book for Pharmacology MCQs?', replies: 24, views: 356, time: '2h ago', tags: ['Pharmacology', 'Books'] },
  { id: 2, user: 'Rahul K.', avatar: '👨‍⚕️', question: 'How to manage time in CBT exam?', replies: 18, views: 289, time: '5h ago', tags: ['Exam Tips', 'CBT'] },
  { id: 3, user: 'Ananya G.', avatar: '👩‍🎓', question: 'PGIMER vs AIIMS nursing - which is better?', replies: 35, views: 520, time: '8h ago', tags: ['Career', 'Comparison'] },
  { id: 4, user: 'Vikram S.', avatar: '🧑‍🎓', question: 'Memorization techniques for drug names?', replies: 12, views: 180, time: '1d ago', tags: ['Pharmacology', 'Study Tips'] },
];

const categories = ['All', 'Pharmacology', 'Anatomy', 'Exam Tips', 'Career', 'Study Tips'];

export default function ForumScreen({ navigation }) {
  const [activeCat, setActiveCat] = useState('All');

  return (
    <View style={styles.container}>
      <Header title="Discussion Forum" subtitle="Community discussions" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>💬</Text>
          <Text style={styles.heroTitle}>Discussion Forum</Text>
          <Text style={styles.heroText}>Ask questions, share knowledge, and help fellow nursing aspirants!</Text>
        </View>

        <TouchableOpacity style={styles.askBtn}>
          <Text style={styles.askText}>✍️ Ask a Question</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {categories.map(cat => (
            <TouchableOpacity key={cat} style={[styles.catBtn, activeCat === cat && styles.activeCat]} onPress={() => setActiveCat(cat)}>
              <Text style={[styles.catText, activeCat === cat && styles.activeCatText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>🔥 Trending Discussions</Text>
        
        {discussions.map(disc => (
          <TouchableOpacity key={disc.id} style={styles.discCard}>
            <View style={styles.discHeader}>
              <Text style={styles.discAvatar}>{disc.avatar}</Text>
              <Text style={styles.discUser}>{disc.user}</Text>
              <Text style={styles.discTime}>{disc.time}</Text>
            </View>
            <Text style={styles.discQuestion}>{disc.question}</Text>
            <View style={styles.discTags}>
              {disc.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <View style={styles.discMeta}>
              <Text style={styles.metaText}>💬 {disc.replies} replies</Text>
              <Text style={styles.metaText}>👁️ {disc.views} views</Text>
            </View>
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
  heroCard: { backgroundColor: 'rgba(0,255,136,0.05)', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(0,255,136,0.15)' },
  heroIcon: { fontSize: 45, marginBottom: 8 },
  heroTitle: { color: COLORS.success, fontSize: 20, fontWeight: 'bold' },
  heroText: { color: COLORS.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 8 },
  askBtn: { backgroundColor: COLORS.success, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  askText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  catScroll: { marginTop: 15, marginBottom: 5 },
  catBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  activeCat: { backgroundColor: COLORS.primary },
  catText: { color: COLORS.textSecondary, fontSize: 11 },
  activeCatText: { color: COLORS.background, fontWeight: 'bold' },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
  discCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  discHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  discAvatar: { fontSize: 22, marginRight: 8 },
  discUser: { color: COLORS.text, fontSize: 13, fontWeight: 'bold', flex: 1 },
  discTime: { color: COLORS.textSecondary, fontSize: 10 },
  discQuestion: { color: COLORS.text, fontSize: 14, fontWeight: '500', marginBottom: 10 },
  discTags: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  tag: { backgroundColor: 'rgba(0,245,255,0.08)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { color: COLORS.primary, fontSize: 10 },
  discMeta: { flexDirection: 'row', gap: 15 },
  metaText: { color: COLORS.textSecondary, fontSize: 11 },
});
