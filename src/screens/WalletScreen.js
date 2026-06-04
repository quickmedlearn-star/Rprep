import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function WalletScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Wallet & Coins" subtitle="Your balance & transactions" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>🪙 850 Coins</Text>
          <Text style={styles.balanceValue}>≈ ₹85 Value</Text>
          <TouchableOpacity style={styles.redeemBtn}>
            <Text style={styles.redeemText}>Redeem Now</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>💰 Earn More Coins</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('MCQ')}>
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionTitle}>Take Tests</Text>
            <Text style={styles.actionSub}>10 coins/test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Refer')}>
            <Text style={styles.actionIcon}>🎁</Text>
            <Text style={styles.actionTitle}>Refer Friends</Text>
            <Text style={styles.actionSub}>50 coins/friend</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🔥</Text>
            <Text style={styles.actionTitle}>Daily Streak</Text>
            <Text style={styles.actionSub}>5 coins/day</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🏆</Text>
            <Text style={styles.actionTitle}>Top Rank</Text>
            <Text style={styles.actionSub}>100 coins</Text>
          </TouchableOpacity>
        </View>

        {/* Buy Coins */}
        <Text style={styles.sectionTitle}>🛒 Buy Coins</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.buyScroll}>
          {[
            { coins: 100, price: '₹10', bonus: '' },
            { coins: 500, price: '₹49', bonus: '+50 Bonus' },
            { coins: 1000, price: '₹99', bonus: '+150 Bonus' },
            { coins: 5000, price: '₹399', bonus: '+1000 Bonus' },
          ].map((pack, i) => (
            <TouchableOpacity key={i} style={styles.buyCard}>
              <Text style={styles.coinIcon}>🪙</Text>
              <Text style={styles.coinAmount}>{pack.coins}</Text>
              <Text style={styles.coinLabel}>coins</Text>
              <Text style={styles.coinPrice}>{pack.price}</Text>
              {pack.bonus && <Text style={styles.bonusText}>{pack.bonus}</Text>}
              <TouchableOpacity style={styles.buyPackBtn}>
                <Text style={styles.buyPackText}>Buy</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transaction History */}
        <Text style={styles.sectionTitle}>📋 Recent Transactions</Text>
        <View style={styles.txnList}>
          {[
            { icon: '📝', text: 'Daily Test Bonus', amount: '+10', time: 'Today, 10:30 AM', positive: true },
            { icon: '🔥', text: 'Streak Reward', amount: '+5', time: 'Yesterday, 9:15 PM', positive: true },
            { icon: '🎁', text: 'Referral Bonus - Priya', amount: '+50', time: '15 Jun, 2:00 PM', positive: true },
            { icon: '💎', text: 'Premium Discount', amount: '-200', time: '10 Jun, 11:00 AM', positive: false },
          ].map((txn, i) => (
            <View key={i} style={styles.txnRow}>
              <Text style={styles.txnIcon}>{txn.icon}</Text>
              <View style={styles.txnInfo}>
                <Text style={styles.txnText}>{txn.text}</Text>
                <Text style={styles.txnTime}>{txn.time}</Text>
              </View>
              <Text style={[styles.txnAmount, { color: txn.positive ? COLORS.success : COLORS.accent }]}>
                {txn.amount}
              </Text>
            </View>
          ))}
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
  balanceCard: { backgroundColor: 'rgba(255,184,0,0.08)', padding: 25, borderRadius: 20, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(255,184,0,0.2)' },
  balanceLabel: { color: COLORS.textSecondary, fontSize: 12 },
  balanceAmount: { color: COLORS.warning, fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  balanceValue: { color: COLORS.textSecondary, fontSize: 12, marginTop: 3 },
  redeemBtn: { backgroundColor: COLORS.warning, paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20, marginTop: 12 },
  redeemText: { color: '#000', fontSize: 14, fontWeight: 'bold' },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, width: '48%', marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  actionIcon: { fontSize: 28, marginBottom: 5 },
  actionTitle: { color: COLORS.text, fontSize: 13, fontWeight: 'bold' },
  actionSub: { color: COLORS.textSecondary, fontSize: 10, marginTop: 3 },
  buyScroll: { marginBottom: 10 },
  buyCard: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 15, marginRight: 12, alignItems: 'center', width: 140, borderWidth: 1, borderColor: COLORS.border },
  coinIcon: { fontSize: 30, marginBottom: 5 },
  coinAmount: { color: COLORS.text, fontSize: 22, fontWeight: 'bold' },
  coinLabel: { color: COLORS.textSecondary, fontSize: 10 },
  coinPrice: { color: COLORS.warning, fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  bonusText: { color: COLORS.success, fontSize: 10, marginTop: 3 },
  buyPackBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingVertical: 8, borderRadius: 15, marginTop: 8 },
  buyPackText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  txnList: { backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  txnRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  txnIcon: { fontSize: 20, marginRight: 12 },
  txnInfo: { flex: 1 },
  txnText: { color: COLORS.text, fontSize: 13 },
  txnTime: { color: COLORS.textSecondary, fontSize: 10, marginTop: 2 },
  txnAmount: { fontSize: 15, fontWeight: 'bold' },
});
