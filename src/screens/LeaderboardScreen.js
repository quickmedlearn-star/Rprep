import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LeaderboardScreen({ navigation }) {
  const topRankers = [
    { name: 'Priya Sharma', xp: 12500, rank: 1, avatar: '🥇' },
    { name: 'Rahul Kumar', xp: 11200, rank: 2, avatar: '🥈' },
    { name: 'Ananya Gupta', xp: 10800, rank: 3, avatar: '🥉' },
    { name: 'Vikram Singh', xp: 9500, rank: 4, avatar: '👤' },
    { name: 'Neha Patel', xp: 8900, rank: 5, avatar: '👤' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Leaderboard" subtitle="Top performers" showMenu onMenu={() => navigation.openDrawer?.()} />
      <ScrollView style={styles.scrollArea}>
        <View style={styles.topThree}>
          {topRankers.slice(0, 3).map((user, index) => (
            <View key={index} style={[styles.topCard, index === 0 && styles.firstPlace]}>
              <Text style={styles.topAvatar}>{user.avatar}</Text>
              <Text style={styles.topName}>{user.name.split(' ')[0]}</Text>
              <Text style={styles.topXP}>{user.xp} XP</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>🏆 All Rankings</Text>
        {topRankers.map((user, index) => (
          <TouchableOpacity key={index} style={styles.rankCard}>
            <Text style={styles.rankNumber}>#{user.rank}</Text>
            <Text style={styles.rankAvatar}>{user.avatar}</Text>
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>{user.name}</Text>
              <Text style={styles.rankXP}>📊 {user.xp} XP</Text>
            </View>
            <Text style={styles.rankArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.currentUserCard}>
          <Text style={styles.currentLabel}>Your Position</Text>
          <View style={styles.currentRow}>
            <Text style={styles.currentRank}>#42</Text>
            <Text style={styles.currentName}>You</Text>
            <Text style={styles.currentXP}>850 XP</Text>
          </View>
        </View>
      </ScrollView>
      <Footer navigation={navigation} activeTab="Leaderboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  topThree: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 10 },
  topCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 15, alignItems: 'center', width: '30%', borderWidth: 1, borderColor: COLORS.border },
  firstPlace: { borderColor: COLORS.warning, borderWidth: 2, backgroundColor: 'rgba(255,184,0,0.05)' },
  topAvatar: { fontSize: 30, marginBottom: 5 },
  topName: { color: COLORS.text, fontSize: 12, fontWeight: 'bold' },
  topXP: { color: COLORS.primary, fontSize: 10, marginTop: 3 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginTop: 25, marginBottom: 15 },
  rankCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  rankNumber: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold', width: 35 },
  rankAvatar: { fontSize: 22, marginRight: 10 },
  rankInfo: { flex: 1 },
  rankName: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  rankXP: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  rankArrow: { color: COLORS.textSecondary, fontSize: 20 },
  currentUserCard: { backgroundColor: 'rgba(0,245,255,0.05)', padding: 15, borderRadius: 12, marginTop: 15, marginBottom: 20, borderWidth: 1, borderColor: COLORS.primary },
  currentLabel: { color: COLORS.textSecondary, fontSize: 11, marginBottom: 5 },
  currentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  currentRank: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold' },
  currentName: { color: COLORS.text, fontSize: 14 },
  currentXP: { color: COLORS.success, fontSize: 14, fontWeight: 'bold' },
});
