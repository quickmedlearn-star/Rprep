import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth } from '../config/firebase';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const notifications = [
  { id: 1, icon: '📝', title: 'New Test Available', message: 'AIIMS NORCET Mock Test 15 is now available. Start practicing!', time: '5 min ago', unread: true, type: 'test' },
  { id: 2, icon: '🏆', title: 'Rank Update', message: 'Congratulations! You moved up to #42 on the leaderboard.', time: '2 hours ago', unread: true, type: 'rank' },
  { id: 3, icon: '🔥', title: 'Streak Alert', message: '12 day streak! Complete today\'s quiz to maintain it.', time: '5 hours ago', unread: false, type: 'streak' },
  { id: 4, icon: '💎', title: 'Premium Offer', message: 'Get 50% off on Pro Yearly plan. Limited time offer!', time: '1 day ago', unread: false, type: 'offer' },
  { id: 5, icon: '📊', title: 'Weekly Report', message: 'Your weekly performance report is ready. Accuracy: 72%', time: '2 days ago', unread: false, type: 'report' },
  { id: 6, icon: '🎯', title: 'Weak Area Alert', message: 'AI detected Pharmacology needs attention. Practice now!', time: '3 days ago', unread: false, type: 'ai' },
];

export default function NotificationsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  const filtered = activeTab === 'unread' ? notifications.filter(n => n.unread) : notifications;

  return (
    <View style={styles.container}>
      <Header title="Notifications" subtitle={`${notifications.filter(n => n.unread).length} unread`} showBack onBack={() => navigation.goBack()} />
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      ) : (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          
          {/* Tabs */}
          <View style={styles.tabRow}>
            {['all', 'unread'].map(tab => (
              <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab === 'all' ? 'All' : 'Unread'}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.markRead}>
              <Text style={styles.markReadText}>Mark all read</Text>
            </TouchableOpacity>
          </View>

          {filtered.map(item => (
            <TouchableOpacity key={item.id} style={[styles.notifCard, item.unread && styles.unreadCard]}>
              <View style={styles.notifIcon}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>
              <View style={styles.notifInfo}>
                <View style={styles.notifHeader}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  {item.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMessage}>{item.message}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
      
      <Footer navigation={navigation} activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  tabRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: 'bold' },
  activeTabText: { color: COLORS.background },
  markRead: { marginLeft: 'auto' },
  markReadText: { color: COLORS.primary, fontSize: 11 },
  notifCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'flex-start' },
  unreadCard: { borderColor: 'rgba(0,245,255,0.3)', backgroundColor: 'rgba(0,245,255,0.02)' },
  notifIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconText: { fontSize: 18 },
  notifInfo: { flex: 1 },
  notifHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  notifTitle: { color: COLORS.text, fontSize: 14, fontWeight: 'bold', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  notifMessage: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
  notifTime: { color: COLORS.textSecondary, fontSize: 10, marginTop: 6 },
});
