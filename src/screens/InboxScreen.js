import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const messages = [
  { id: 1, from: 'RPREP Team', subject: 'Welcome to RPREP! 🎉', message: 'Thank you for joining RPREP. Start your nursing exam preparation today with our AI-powered platform.', time: '12 Jun', unread: false, icon: '🎓' },
  { id: 2, from: 'AI Tutor', subject: 'Your Weekly Study Report', message: 'Great progress this week! You completed 15 tests with 72% accuracy. Focus on Pharmacology to improve further.', time: '10 Jun', unread: true, icon: '🤖' },
  { id: 3, from: 'Support Team', subject: 'Re: Question about Premium', message: 'Yes, the Pro Yearly plan includes all features including AI Tutor, unlimited tests, and priority support.', time: '08 Jun', unread: true, icon: '💬' },
];

export default function InboxScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  const filtered = messages.filter(m => 
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title="Inbox" subtitle={`${messages.filter(m => m.unread).length} unread`} showBack onBack={() => navigation.goBack()} />
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      ) : (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          
          {/* Search */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search messages..." 
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {filtered.length > 0 ? (
            filtered.map(item => (
              <TouchableOpacity key={item.id} style={[styles.msgCard, item.unread && styles.unreadCard]}>
                <View style={styles.msgIcon}>
                  <Text style={styles.iconText}>{item.icon}</Text>
                </View>
                <View style={styles.msgInfo}>
                  <View style={styles.msgHeader}>
                    <Text style={[styles.msgFrom, item.unread && styles.unreadText]}>{item.from}</Text>
                    <Text style={styles.msgTime}>{item.time}</Text>
                  </View>
                  <Text style={[styles.msgSubject, item.unread && styles.unreadText]}>{item.subject}</Text>
                  <Text style={styles.msgPreview} numberOfLines={1}>{item.message}</Text>
                </View>
                {item.unread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📬</Text>
              <Text style={styles.emptyTitle}>No Messages</Text>
              <Text style={styles.emptyText}>Your inbox is empty</Text>
            </View>
          )}

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
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: 15, marginTop: 20, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, color: COLORS.text, paddingVertical: 12, fontSize: 14 },
  msgCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, marginBottom: 6, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  unreadCard: { borderColor: 'rgba(0,245,255,0.2)', backgroundColor: 'rgba(0,245,255,0.02)' },
  msgIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  iconText: { fontSize: 20 },
  msgInfo: { flex: 1 },
  msgHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  msgFrom: { color: COLORS.text, fontSize: 13, fontWeight: 'bold' },
  unreadText: { color: COLORS.primary },
  msgTime: { color: COLORS.textSecondary, fontSize: 10 },
  msgSubject: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 3 },
  msgPreview: { color: COLORS.textSecondary, fontSize: 11 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginLeft: 8 },
  emptyCard: { backgroundColor: COLORS.surface, padding: 30, borderRadius: 15, alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: COLORS.border },
  emptyIcon: { fontSize: 50, marginBottom: 15 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  emptyText: { color: COLORS.textSecondary, fontSize: 13 },
});
