import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ReferScreen({ navigation }) {
  const referralCode = 'RPREP' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎓 Join RPREP - India's #1 Nursing Exam Prep App!\n\nUse my referral code: ${referralCode}\nGet 50 coins FREE!\n\nDownload now: https://rprep.in\n\n#RPREP #NursingExam #NursingOfficer`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share');
    }
  };

  const handleCopy = () => {
    Alert.alert('✅', 'Referral code copied!\n\nShare with friends and earn rewards.');
  };

  return (
    <View style={styles.container}>
      <Header title="Refer & Earn" subtitle="Invite friends, get rewards" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🎁</Text>
          <Text style={styles.heroTitle}>Refer & Earn Rewards</Text>
          <Text style={styles.heroText}>Invite your nursing friends and earn coins for every signup!</Text>
        </View>

        <View style={styles.rewardGrid}>
          <View style={[styles.rewardCard, { borderColor: COLORS.primary }]}>
            <Text style={styles.rewardIcon}>👤</Text>
            <Text style={styles.rewardValue}>50</Text>
            <Text style={styles.rewardLabel}>Coins per friend</Text>
          </View>
          <View style={[styles.rewardCard, { borderColor: COLORS.success }]}>
            <Text style={styles.rewardIcon}>👥</Text>
            <Text style={styles.rewardValue}>500</Text>
            <Text style={styles.rewardLabel}>Coins for 10 friends</Text>
          </View>
          <View style={[styles.rewardCard, { borderColor: COLORS.warning }]}>
            <Text style={styles.rewardIcon}>👑</Text>
            <Text style={styles.rewardValue}>Pro</Text>
            <Text style={styles.rewardLabel}>Free month for 25</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>🔗 Your Referral Code</Text>
        <View style={styles.codeCard}>
          <Text style={styles.codeText}>{referralCode}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareText}>📤 Share with Friends</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>📊 Your Referral Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Friends Joined</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Coins Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹0</Text>
            <Text style={styles.statLabel}>Value</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>❓ How It Works</Text>
        <View style={styles.howCard}>
          <Text style={styles.howItem}>1️⃣ Share your referral code with friends</Text>
          <Text style={styles.howItem}>2️⃣ Friend signs up using your code</Text>
          <Text style={styles.howItem}>3️⃣ Both get 50 coins instantly!</Text>
          <Text style={styles.howItem}>4️⃣ Redeem coins for premium access</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
      
      <Footer navigation={navigation} activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  heroCard: { backgroundColor: 'rgba(255,184,0,0.05)', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(255,184,0,0.15)' },
  heroIcon: { fontSize: 50, marginBottom: 10 },
  heroTitle: { color: COLORS.warning, fontSize: 20, fontWeight: 'bold' },
  heroText: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 8 },
  rewardGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  rewardCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, alignItems: 'center', width: '31%', borderWidth: 1 },
  rewardIcon: { fontSize: 25, marginBottom: 5 },
  rewardValue: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  rewardLabel: { color: COLORS.textSecondary, fontSize: 9, textAlign: 'center', marginTop: 3 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  codeCard: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.primary },
  codeText: { color: COLORS.primary, fontSize: 20, fontWeight: 'bold', letterSpacing: 2 },
  copyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  copyText: { color: COLORS.background, fontSize: 13, fontWeight: 'bold' },
  shareBtn: { backgroundColor: COLORS.success, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  shareText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, alignItems: 'center', width: '31%', borderWidth: 1, borderColor: COLORS.border },
  statValue: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: COLORS.textSecondary, fontSize: 9, textAlign: 'center', marginTop: 3 },
  howCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  howItem: { color: COLORS.text, fontSize: 13, marginBottom: 10, lineHeight: 20 },
});
