import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DailyChallengeScreen({ navigation }) {
  const challenges = [
    { icon: '📝', title: 'Answer 20 MCQs', reward: '10 Coins', progress: 0, total: 20, type: 'mcq' },
    { icon: '🎯', title: 'Score 80%+ in a test', reward: '25 Coins', progress: 0, total: 1, type: 'score' },
    { icon: '🔥', title: 'Maintain 7-day streak', reward: '50 Coins', progress: 0, total: 7, type: 'streak' },
    { icon: '📚', title: 'Study 3 subjects today', reward: '15 Coins', progress: 0, total: 3, type: 'study' },
    { icon: '🏆', title: 'Beat your best score', reward: '30 Coins', progress: 0, total: 1, type: 'beat' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Daily Challenge" subtitle="Complete & earn rewards" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🎯</Text>
          <Text style={styles.heroTitle}>Daily Challenges</Text>
          <Text style={styles.heroText}>Complete challenges to earn coins and rewards!</Text>
          <View style={styles.timerRow}>
            <Text style={styles.timerIcon}>⏰</Text>
            <Text style={styles.timerText}>Resets in 14h 30m</Text>
          </View>
        </View>

        <View style={styles.rewardBanner}>
          <Text style={styles.rewardIcon}>🎁</Text>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>Complete All 5 Challenges</Text>
            <Text style={styles.rewardSub}>Bonus: 100 Coins + 50 XP</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>📋 Today's Challenges</Text>
        
        {challenges.map((ch, i) => (
          <TouchableOpacity key={i} style={styles.challengeCard}>
            <View style={styles.chIconBox}>
              <Text style={styles.chIcon}>{ch.icon}</Text>
            </View>
            <View style={styles.chInfo}>
              <Text style={styles.chTitle}>{ch.title}</Text>
              <View style={styles.chMeta}>
                <Text style={styles.chProgress}>{ch.progress}/{ch.total}</Text>
                <View style={styles.chBar}>
                  <View style={[styles.chFill, { width: `${(ch.progress/ch.total)*100}%` }]} />
                </View>
              </View>
            </View>
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardText}>🪙 {ch.reward}</Text>
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
  heroCard: { backgroundColor: 'rgba(255,184,0,0.05)', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(255,184,0,0.2)' },
  heroIcon: { fontSize: 45, marginBottom: 8 },
  heroTitle: { color: COLORS.warning, fontSize: 20, fontWeight: 'bold' },
  heroText: { color: COLORS.textSecondary, fontSize: 12, marginTop: 5 },
  timerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  timerIcon: { fontSize: 14, marginRight: 5 },
  timerText: { color: COLORS.textSecondary, fontSize: 11 },
  rewardBanner: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginTop: 15, borderWidth: 1, borderColor: COLORS.warning },
  rewardIcon: { fontSize: 30, marginRight: 12 },
  rewardInfo: { flex: 1 },
  rewardTitle: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  rewardSub: { color: COLORS.warning, fontSize: 12, marginTop: 3 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  challengeCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  chIconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  chIcon: { fontSize: 20 },
  chInfo: { flex: 1 },
  chTitle: { color: COLORS.text, fontSize: 13, fontWeight: 'bold' },
  chMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  chProgress: { color: COLORS.textSecondary, fontSize: 10, marginRight: 8 },
  chBar: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' },
  chFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  rewardBadge: { backgroundColor: 'rgba(255,184,0,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  rewardText: { color: COLORS.warning, fontSize: 10, fontWeight: 'bold' },
});
