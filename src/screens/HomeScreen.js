import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Dimensions, Animated } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuoteCard from '../components/QuoteCard';
import MenuProfile from '../components/MenuProfile';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, { toValue: -width, duration: 300, useNativeDriver: true }).start(() => setMenuVisible(false));
  };

  const handleLogout = async () => { closeMenu(); await signOut(auth); };

  const MenuItem = ({ icon, label, onPress, badge, badgeType }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress || closeMenu}>
      <View style={styles.menuLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      {badge ? (
        <View style={[styles.badge, badgeType === 'new' && styles.badgeNew, badgeType === 'ai' && styles.badgeAI, badgeType === 'pro' && styles.badgePro, badgeType === 'notif' && styles.badgeNotif, badgeType === 'count' && styles.badgeCount, badgeType === 'hot' && styles.badgeHot]}>
          <Text style={[styles.badgeText, badgeType === 'count' && styles.badgeCountText]}>{badge}</Text>
        </View>
      ) : <Text style={styles.menuArrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="RPREP" subtitle="Your Nursing Success Partner" showMenu onMenu={openMenu} />
      
      <Modal visible={menuVisible} transparent animationType="none">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeMenu}>
          <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
            <TouchableOpacity activeOpacity={1} style={styles.menuContent}>
              
              <View style={styles.menuHeader}>
                <MenuProfile />
              </View>

              <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.menuSection}>📌 MAIN NAVIGATION</Text>
                <MenuItem icon="🏠" label="Dashboard" />
                <MenuItem icon="📝" label="CBT Exam Mode" onPress={() => { closeMenu(); navigation.navigate('MCQ'); }} badge="NEW" badgeType="new" />
                <MenuItem icon="📋" label="Test Series" onPress={() => { closeMenu(); navigation.navigate('TestSeries'); }} />
                <MenuItem icon="📅" label="Daily Quiz" onPress={() => { closeMenu(); navigation.navigate('DailyQuiz'); }} />
                <MenuItem icon="📚" label="Subjects" onPress={() => { closeMenu(); navigation.navigate('SubjectTest'); }} />
                <MenuItem icon="📖" label="Study Material" />

                <Text style={styles.menuSection}>📊 PRACTICE & ANALYSIS</Text>
                <MenuItem icon="📊" label="My Progress" />
                <MenuItem icon="📈" label="Weak Areas" badge="AI" badgeType="ai" />
                <MenuItem icon="🏆" label="Leaderboard" onPress={() => { closeMenu(); navigation.navigate('Leaderboard'); }} />
                <MenuItem icon="⏱️" label="Test History" />
                <MenuItem icon="📑" label="Bookmarked Qs" badge="23" badgeType="count" />

                <Text style={styles.menuSection}>⚡ INTERACTIVE</Text>
                <MenuItem icon="⚔️" label="1v1 Battle" badge="LIVE" badgeType="hot" />
                <MenuItem icon="🎯" label="Daily Challenge" />
                <MenuItem icon="👥" label="Study Groups" />
                <MenuItem icon="💬" label="Discussion Forum" />

                <Text style={styles.menuSection}>🤖 AI POWERED</Text>
                <MenuItem icon="🤖" label="AI Tutor" badge="PRO" badgeType="pro" />
                <MenuItem icon="🧠" label="Smart Study Plan" badge="AI" badgeType="ai" />
                <MenuItem icon="📊" label="Exam Predictor" badge="AI" badgeType="ai" />
                <MenuItem icon="🎯" label="Weak Area Detector" badge="AI" badgeType="ai" />

                <Text style={styles.menuSection}>💎 PREMIUM</Text>
                <MenuItem icon="💎" label="Go Premium" badge="🔥" badgeType="hot" />
                <MenuItem icon="🛒" label="Test Series Store" />
                <MenuItem icon="🎁" label="Refer & Earn" />
                <MenuItem icon="💰" label="Wallet / Coins" />

                <Text style={styles.menuSection}>🔔 UPDATES</Text>
                <MenuItem icon="🔔" label="Notifications" badge="5" badgeType="notif" />
                <MenuItem icon="📢" label="Announcements" />
                <MenuItem icon="📬" label="Inbox" />

                <Text style={styles.menuSection}>⚙️ SETTINGS & SUPPORT</Text>
                <MenuItem icon="⚙️" label="Settings" onPress={() => { closeMenu(); navigation.navigate("Settings"); }} />
                <View style={{ height: 30 }} />
              </ScrollView>

              <View style={styles.menuFooter}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.logoutIcon}>🚪</Text>
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
                <Text style={styles.versionText}>RPREP v1.0.0 | Pro Edition</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
      
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <QuoteCard />
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: COLORS.primary }]}>
            <Text style={styles.statNumber}>850</Text>
            <Text style={styles.statLabel}>XP Points</Text>
          </View>
          <View style={[styles.statCard, { borderColor: COLORS.secondary }]}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Streak 🔥</Text>
          </View>
          <View style={[styles.statCard, { borderColor: COLORS.accent }]}>
            <Text style={styles.statNumber}>#42</Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>📅 Upcoming Tests</Text>
        <View style={styles.examCard}>
          <View style={styles.examLeft}>
            <View style={styles.examDate}><Text style={styles.examDateDay}>15</Text><Text style={styles.examDateMonth}>JUN</Text></View>
            <View style={styles.examInfo}><Text style={styles.examName}>Nursing Officer CBT - Full Mock</Text><Text style={styles.examMeta}>⏱ 120 mins • 📝 200 Qs • 🏥 AIIMS</Text></View>
          </View>
          <TouchableOpacity style={styles.enrollButton} onPress={() => navigation.navigate('MCQ')}><Text style={styles.enrollText}>Start</Text></TouchableOpacity>
        </View>
        <View style={styles.examCard}>
          <View style={styles.examLeft}>
            <View style={[styles.examDate, { backgroundColor: 'rgba(123,47,255,0.1)', borderColor: COLORS.secondary }]}><Text style={[styles.examDateDay, { color: COLORS.secondary }]}>20</Text><Text style={styles.examDateMonth}>JUN</Text></View>
            <View style={styles.examInfo}><Text style={styles.examName}>Pharmacology Subject Test</Text><Text style={styles.examMeta}>⏱ 60 mins • 📝 100 Qs • 💊 Specialized</Text></View>
          </View>
          <TouchableOpacity style={[styles.enrollButton, { backgroundColor: COLORS.secondary }]} onPress={() => navigation.navigate('SubjectTest')}><Text style={styles.enrollText}>Start</Text></TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('MCQ')}><View style={[styles.iconBox, { backgroundColor: 'rgba(0,245,255,0.1)' }]}><Text style={styles.actionIcon}>📝</Text></View><Text style={styles.actionTitle}>CBT Exam</Text><Text style={styles.actionSubtext}>Full Mock Tests</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('SubjectTest')}><View style={[styles.iconBox, { backgroundColor: 'rgba(123,47,255,0.1)' }]}><Text style={styles.actionIcon}>📚</Text></View><Text style={styles.actionTitle}>Subject Test</Text><Text style={styles.actionSubtext}>Topic-wise</Text></TouchableOpacity>
        </View>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('DailyQuiz')}><View style={[styles.iconBox, { backgroundColor: 'rgba(0,255,136,0.1)' }]}><Text style={styles.actionIcon}>📅</Text></View><Text style={styles.actionTitle}>Daily Quiz</Text><Text style={styles.actionSubtext}>10 Qs Daily</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Leaderboard')}><View style={[styles.iconBox, { backgroundColor: 'rgba(255,184,0,0.1)' }]}><Text style={styles.actionIcon}>🏆</Text></View><Text style={styles.actionTitle}>Leaderboard</Text><Text style={styles.actionSubtext}>View Rankings</Text></TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>🤖 AI Powered</Text>
        <TouchableOpacity style={styles.featureCard}><View style={styles.featureContent}><View style={[styles.iconBox, { backgroundColor: 'rgba(0,255,136,0.1)' }]}><Text style={styles.actionIcon}>🧠</Text></View><View style={styles.featureText}><Text style={styles.featureTitle}>AI Study Plan</Text><Text style={styles.featureSubtext}>Personalized for you</Text></View></View><Text style={styles.arrowIcon}>→</Text></TouchableOpacity>
        <TouchableOpacity style={styles.featureCard}><View style={styles.featureContent}><View style={[styles.iconBox, { backgroundColor: 'rgba(255,45,149,0.1)' }]}><Text style={styles.actionIcon}>📊</Text></View><View style={styles.featureText}><Text style={styles.featureTitle}>Weak Area Detector</Text><Text style={styles.featureSubtext}>Improve faster</Text></View></View><Text style={styles.arrowIcon}>→</Text></TouchableOpacity>
        <View style={{ height: 20 }} />
      </ScrollView>

      <Footer navigation={navigation} activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  menuContainer: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 310 },
  menuContent: { flex: 1, backgroundColor: '#0A0A1A' },
  menuHeader: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,245,255,0.02)' },
  menuScroll: { flex: 1, paddingHorizontal: 8 },
  menuSection: { color: 'rgba(0,245,255,0.4)', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginTop: 18, marginBottom: 6, paddingHorizontal: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, paddingHorizontal: 12, borderRadius: 10, marginBottom: 1 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIcon: { fontSize: 16, marginRight: 10, width: 22 },
  menuLabel: { color: COLORS.text, fontSize: 13, fontWeight: '500' },
  menuArrow: { color: COLORS.textSecondary, fontSize: 18 },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  badgeNew: { backgroundColor: COLORS.accent },
  badgeAI: { backgroundColor: 'rgba(0,245,255,0.15)', borderWidth: 1, borderColor: COLORS.primary },
  badgePro: { backgroundColor: COLORS.secondary },
  badgeNotif: { backgroundColor: COLORS.accent },
  badgeCount: { backgroundColor: 'rgba(0,245,255,0.15)' },
  badgeHot: { backgroundColor: 'rgba(255,184,0,0.2)' },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  badgeCountText: { color: COLORS.primary },
  menuFooter: { padding: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,45,149,0.1)', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,45,149,0.3)' },
  logoutIcon: { fontSize: 14, marginRight: 8 },
  logoutText: { color: COLORS.accent, fontSize: 13, fontWeight: 'bold' },
  versionText: { color: COLORS.textSecondary, fontSize: 9, textAlign: 'center', marginTop: 8 },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 15 },
  statCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 15, alignItems: 'center', width: '30%', borderWidth: 1 },
  statNumber: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, marginTop: 4 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 12 },
  examCard: { backgroundColor: COLORS.surface, padding: 14, borderRadius: 15, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  examLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  examDate: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(0,245,255,0.1)', borderWidth: 1, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  examDateDay: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' },
  examDateMonth: { color: COLORS.textSecondary, fontSize: 9 },
  examInfo: { flex: 1 },
  examName: { color: COLORS.text, fontSize: 13, fontWeight: 'bold' },
  examMeta: { color: COLORS.textSecondary, fontSize: 10, marginTop: 3 },
  enrollButton: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10 },
  enrollText: { color: COLORS.background, fontSize: 13, fontWeight: 'bold' },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  actionCard: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 15, width: '48%', borderWidth: 1, borderColor: COLORS.border },
  iconBox: { width: 45, height: 45, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionIcon: { fontSize: 22 },
  actionTitle: { color: COLORS.text, fontSize: 15, fontWeight: 'bold' },
  actionSubtext: { color: COLORS.textSecondary, fontSize: 11, marginTop: 3 },
  featureCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  featureContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  featureText: { marginLeft: 12, flex: 1 },
  featureTitle: { color: COLORS.text, fontSize: 15, fontWeight: 'bold' },
  featureSubtext: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  arrowIcon: { color: COLORS.primary, fontSize: 20, fontWeight: 'bold' },
});
