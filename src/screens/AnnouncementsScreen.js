import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const announcements = [
  { id: 1, icon: '📢', title: 'AIIMS NORCET 2026 Notification Out!', message: 'AIIMS has released the official notification for Nursing Officer Recruitment 2026. Application starts from 15th July. 5000+ vacancies expected.', date: '12 Jun 2026', important: true },
  { id: 2, icon: '🎉', title: 'New Feature: AI Tutor Launched', message: 'We are excited to announce our AI-powered tutor feature. Ask any nursing question and get instant answers. Try it now from the menu!', date: '10 Jun 2026', important: true },
  { id: 3, icon: '📝', title: '5000+ New MCQs Added', message: 'We have added 5000+ new MCQs covering all nursing subjects. Pharmacology and Anatomy sections updated with latest pattern questions.', date: '08 Jun 2026', important: false },
  { id: 4, icon: '🏆', title: 'June Month Topper: Priya Sharma', message: 'Congratulations to Priya Sharma for scoring 98% in the monthly challenge. She wins a free 1-year Pro subscription!', date: '05 Jun 2026', important: false },
  { id: 5, icon: '💎', title: 'Premium Plan Price Update', message: 'New introductory pricing for Pro plans. Monthly plan now at ₹299 and Yearly at ₹999. Offer valid till 30th June.', date: '01 Jun 2026', important: false },
];

export default function AnnouncementsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  return (
    <View style={styles.container}>
      <Header title="Announcements" subtitle="Latest updates & news" showBack onBack={() => navigation.goBack()} />
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      ) : (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          
          {announcements.map(item => (
            <TouchableOpacity key={item.id} style={[styles.card, item.important && styles.importantCard]}>
              {item.important && (
                <View style={styles.importantBadge}>
                  <Text style={styles.importantText}>📌 IMPORTANT</Text>
                </View>
              )}
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: item.important ? 'rgba(255,45,149,0.1)' : 'rgba(0,245,255,0.1)' }]}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDate}>📅 {item.date}</Text>
                </View>
              </View>
              <Text style={styles.cardMessage}>{item.message}</Text>
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
  card: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  importantCard: { borderColor: 'rgba(255,45,149,0.3)', backgroundColor: 'rgba(255,45,149,0.02)' },
  importantBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,45,149,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  importantText: { color: COLORS.accent, fontSize: 10, fontWeight: 'bold' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 45, height: 45, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  icon: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardTitle: { color: COLORS.text, fontSize: 15, fontWeight: 'bold' },
  cardDate: { color: COLORS.textSecondary, fontSize: 10, marginTop: 3 },
  cardMessage: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
});
