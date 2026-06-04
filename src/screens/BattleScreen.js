import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const sampleQuestions = [
  { q: 'Normal adult BP?', options: ['120/80', '140/90', '160/100', '100/60'], correct: 0 },
  { q: 'Insulin produced by?', options: ['Liver', 'Pancreas', 'Kidney', 'Spleen'], correct: 1 },
  { q: 'Vitamin D helps absorb?', options: ['Iron', 'Calcium', 'Zinc', 'Magnesium'], correct: 1 },
];

export default function BattleScreen({ navigation }) {
  const [screen, setScreen] = useState('lobby');
  const [opponent, setOpponent] = useState(null);

  const opponents = [
    { name: 'Priya S.', xp: 12500, rank: 1, avatar: '🥇' },
    { name: 'Rahul K.', xp: 11200, rank: 2, avatar: '🥈' },
    { name: 'Ananya G.', xp: 10800, rank: 3, avatar: '🥉' },
    { name: 'Vikram S.', xp: 9500, rank: 4, avatar: '👤' },
  ];

  if (screen === 'lobby') {
    return (
      <View style={styles.container}>
        <Header title="1v1 Battle" subtitle="Challenge & compete" showBack onBack={() => navigation.goBack()} />
        <ScrollView style={styles.scrollArea}>
          <View style={styles.heroCard}>
            <Text style={styles.heroIcon}>⚔️</Text>
            <Text style={styles.heroTitle}>Quiz Battle Arena</Text>
            <Text style={styles.heroText}>Challenge other nursing aspirants in real-time MCQ battles!</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}><Text style={styles.statValue}>15</Text><Text style={styles.statLabel}>Battles Won</Text></View>
            <View style={styles.statCard}><Text style={styles.statValue}>#42</Text><Text style={styles.statLabel}>Battle Rank</Text></View>
            <View style={styles.statCard}><Text style={styles.statValue}>8</Text><Text style={styles.statLabel}>Win Streak</Text></View>
          </View>

          <TouchableOpacity style={styles.quickBattle}>
            <Text style={styles.quickBattleIcon}>⚡</Text>
            <View style={styles.quickInfo}>
              <Text style={styles.quickTitle}>Quick Match</Text>
              <Text style={styles.quickSub}>Find random opponent</Text>
            </View>
            <Text style={styles.quickArrow}>→</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>👥 Online Players</Text>
          {opponents.map((opp, i) => (
            <TouchableOpacity key={i} style={styles.opponentCard}>
              <Text style={styles.oppAvatar}>{opp.avatar}</Text>
              <View style={styles.oppInfo}>
                <Text style={styles.oppName}>{opp.name}</Text>
                <Text style={styles.oppXP}>{opp.xp} XP • Rank #{opp.rank}</Text>
              </View>
              <TouchableOpacity style={styles.challengeBtn}>
                <Text style={styles.challengeText}>Challenge</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <View style={{ height: 20 }} />
        </ScrollView>
        <Footer navigation={navigation} activeTab="Home" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  heroCard: { backgroundColor: 'rgba(255,45,149,0.05)', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(255,45,149,0.2)' },
  heroIcon: { fontSize: 50, marginBottom: 10 },
  heroTitle: { color: COLORS.accent, fontSize: 20, fontWeight: 'bold' },
  heroText: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  statCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, alignItems: 'center', width: '31%', borderWidth: 1, borderColor: COLORS.border },
  statValue: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: COLORS.textSecondary, fontSize: 9, textAlign: 'center', marginTop: 3 },
  quickBattle: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: COLORS.accent },
  quickBattleIcon: { fontSize: 35, marginRight: 15 },
  quickInfo: { flex: 1 },
  quickTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  quickSub: { color: COLORS.textSecondary, fontSize: 11, marginTop: 3 },
  quickArrow: { color: COLORS.accent, fontSize: 24, fontWeight: 'bold' },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  opponentCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  oppAvatar: { fontSize: 30, marginRight: 12 },
  oppInfo: { flex: 1 },
  oppName: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  oppXP: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  challengeBtn: { backgroundColor: COLORS.accent, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  challengeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
