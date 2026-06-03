import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../config/firebase';
import { getUserProfile } from '../services/userService';
import { COLORS } from '../config/theme';

export default function MenuProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const data = await getUserProfile(user.uid);
      if (data) setProfile(data);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>{profile?.avatar || '👤'}</Text>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{profile?.name || 'Nursing Aspirant'}</Text>
          <Text style={styles.userEmail}>{auth.currentUser?.email || 'student@rprep.com'}</Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankBadgeIcon}>🏅</Text>
            <Text style={styles.rankBadgeText}>{profile?.membership || 'Free'} Member</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile?.xp || 0}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile?.streak || 0}</Text>
          <Text style={styles.statLabel}>Streak 🔥</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile?.progress || 0}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>
      
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${profile?.progress || 0}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingTop: 10 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,245,255,0.1)', borderWidth: 2, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  avatarIcon: { fontSize: 26 },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success, borderWidth: 2, borderColor: '#0A0A1A' },
  profileInfo: { marginLeft: 12, flex: 1 },
  userName: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  userEmail: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  rankBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,184,0,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 5, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,184,0,0.3)' },
  rankBadgeIcon: { fontSize: 10, marginRight: 4 },
  rankBadgeText: { color: COLORS.warning, fontSize: 9, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statItem: { alignItems: 'center' },
  statValue: { color: COLORS.primary, fontSize: 15, fontWeight: 'bold' },
  statLabel: { color: COLORS.textSecondary, fontSize: 9, marginTop: 2 },
  statDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  progressBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
});
