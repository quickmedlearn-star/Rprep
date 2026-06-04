import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { auth } from '../config/firebase';
import { getLeaderboard } from '../services/userService';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LeaderboardScreen({ navigation }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLeaderboard(); }, []);

  const loadLeaderboard = async () => {
    const data = await getLeaderboard(50);
    setLeaderboard(data);
    const user = auth.currentUser;
    if (user) {
      const currentUser = data.find(u => u.id === user.uid);
      setUserRank(currentUser || { rank: '-', name: 'You', xp: 0 });
    }
    setLoading(false);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const top3 = leaderboard.slice(0, 3);

  return (
    <View style={styles.container}>
      <Header title="RPREP" subtitle="Leaderboard" showBack onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      ) : (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {top3.length > 0 && (
            <View style={styles.podium}>
              {top3[1] && (
                <View style={styles.podiumItem}>
                  <Text style={styles.podiumAvatar}>🥈</Text>
                  <View style={[styles.podiumBar, { height: 70, backgroundColor: 'rgba(192,192,192,0.3)' }]}>
                    <Text style={styles.podiumName}>{top3[1]?.name?.split(' ')[0]}</Text>
                    <Text style={styles.podiumXP}>{top3[1]?.xp} XP</Text>
                  </View>
                </View>
              )}
              {top3[0] && (
                <View style={styles.podiumItem}>
                  <Text style={styles.podiumAvatar}>👑</Text>
                  <View style={[styles.podiumBar, { height: 90, backgroundColor: 'rgba(255,215,0,0.3)' }]}>
                    <Text style={styles.podiumName}>{top3[0]?.name?.split(' ')[0]}</Text>
                    <Text style={styles.podiumXP}>{top3[0]?.xp} XP</Text>
                  </View>
                </View>
              )}
              {top3[2] && (
                <View style={styles.podiumItem}>
                  <Text style={styles.podiumAvatar}>🥉</Text>
                  <View style={[styles.podiumBar, { height: 55, backgroundColor: 'rgba(205,127,50,0.3)' }]}>
                    <Text style={styles.podiumName}>{top3[2]?.name?.split(' ')[0]}</Text>
                    <Text style={styles.podiumXP}>{top3[2]?.xp} XP</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          <Text style={styles.sectionTitle}>🏆 All Rankings</Text>
          {leaderboard.map((user, index) => (
            <View key={user.id || index} style={[styles.rankCard, user.id === auth.currentUser?.uid && styles.myCard]}>
              <Text style={styles.rankIcon}>{getRankIcon(user.rank)}</Text>
              <View style={[styles.avatarSmall, user.id === auth.currentUser?.uid && styles.myAvatar]}>
                <Text style={styles.avatarIcon}>👤</Text>
              </View>
              <View style={styles.rankInfo}>
                <Text style={styles.rankName}>{user.name} {user.id === auth.currentUser?.uid ? '(You)' : ''}</Text>
                <Text style={styles.rankMeta}>📝 {user.testsCompleted} tests • 🎯 {user.accuracy}%</Text>
              </View>
              <Text style={styles.rankXP}>{user.xp} XP</Text>
            </View>
          ))}

          {userRank && (
            <View style={styles.myPositionCard}>
              <Text style={styles.myLabel}>Your Position: #{userRank.rank}</Text>
              <Text style={styles.myHint}>Keep practicing to climb higher!</Text>
            </View>
          )}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
      <Footer navigation={navigation} activeTab="Leaderboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginTop: 25, gap: 8, height: 150 },
  podiumItem: { alignItems: 'center', width: '30%' },
  podiumAvatar: { fontSize: 35, marginBottom: 8 },
  podiumBar: { width: '100%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 8 },
  podiumName: { color: COLORS.text, fontSize: 11, fontWeight: 'bold' },
  podiumXP: { color: COLORS.primary, fontSize: 10, marginTop: 3 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  rankCard: { backgroundColor: COLORS.surface, padding: 12, borderRadius: 12, marginBottom: 5, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  myCard: { borderColor: COLORS.primary, backgroundColor: 'rgba(0,245,255,0.03)' },
  rankIcon: { fontSize: 20, width: 35, textAlign: 'center' },
  avatarSmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,245,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  myAvatar: { borderWidth: 2, borderColor: COLORS.primary },
  avatarIcon: { fontSize: 14 },
  rankInfo: { flex: 1 },
  rankName: { color: COLORS.text, fontSize: 13, fontWeight: 'bold' },
  rankMeta: { color: COLORS.textSecondary, fontSize: 10, marginTop: 2 },
  rankXP: { color: COLORS.primary, fontSize: 13, fontWeight: 'bold' },
  myPositionCard: { backgroundColor: 'rgba(0,245,255,0.05)', padding: 12, borderRadius: 10, marginTop: 15, borderWidth: 1, borderColor: COLORS.primary, alignItems: 'center' },
  myLabel: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
  myHint: { color: COLORS.textSecondary, fontSize: 10, marginTop: 4 },
});
