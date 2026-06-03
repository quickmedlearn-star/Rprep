import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TestSeriesScreen({ navigation }) {
  const series = [
    { name: 'AIIMS NORCET', fullForm: 'Nursing Officer Recruitment', tests: 30, price: 'Free', icon: '🏥', color: COLORS.primary },
    { name: 'PGIMER Nursing', fullForm: 'Post Graduate Institute', tests: 25, price: '₹299', icon: '🏛️', color: COLORS.secondary },
    { name: 'ESIC Nursing Officer', fullForm: 'Employees State Insurance', tests: 20, price: 'Free', icon: '🏭', color: COLORS.success },
    { name: 'Railway Nurse', fullForm: 'Railway Recruitment Board', tests: 18, price: '₹199', icon: '🚂', color: COLORS.warning },
    { name: 'State PSC Nursing', fullForm: 'Public Service Commission', tests: 35, price: '₹399', icon: '📋', color: COLORS.accent },
    { name: 'DSSSB Nursing', fullForm: 'Delhi Subordinate Services', tests: 22, price: '₹249', icon: '🏫', color: '#FF6B6B' },
    { name: 'NHM Nursing Officer', fullForm: 'National Health Mission', tests: 28, price: 'Free', icon: '🏘️', color: COLORS.success },
    { name: 'CRPF Nursing', fullForm: 'Central Reserve Police Force', tests: 15, price: '₹149', icon: '🛡️', color: '#4ECDC4' },
    { name: 'BHU Nursing Officer', fullForm: 'Banaras Hindu University', tests: 20, price: '₹199', icon: '🎓', color: '#FFE66D' },
    { name: 'KGMU Nursing', fullForm: 'King George Medical Univ.', tests: 18, price: '₹179', icon: '🏨', color: '#FF8C42' },
  ];

  const categories = [
    { name: 'Free Tests', icon: '🆓', count: 3 },
    { name: 'Premium Tests', icon: '💎', count: 7 },
    { name: 'Full Length', icon: '📝', count: 5 },
    { name: 'Subject Wise', icon: '📚', count: 10 },
  ];

  return (
    <View style={styles.container}>
      <Header title="Test Series" subtitle="Exam-wise mock tests" showBack onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scrollArea}>
        
        {/* Categories */}
        <View style={styles.categoryRow}>
          {categories.map((cat, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>📋 All Test Series</Text>
        
        {series.map((item, index) => (
          <TouchableOpacity key={index} style={styles.seriesCard}>
            <View style={[styles.seriesIconBox, { backgroundColor: `${item.color}15` }]}>
              <Text style={styles.seriesIcon}>{item.icon}</Text>
            </View>
            <View style={styles.seriesInfo}>
              <View style={styles.seriesHeader}>
                <Text style={styles.seriesName}>{item.name}</Text>
                <View style={[styles.priceBadge, { backgroundColor: item.price === 'Free' ? 'rgba(0,255,136,0.1)' : 'rgba(255,184,0,0.1)' }]}>
                  <Text style={[styles.priceText, { color: item.price === 'Free' ? COLORS.success : COLORS.warning }]}>{item.price}</Text>
                </View>
              </View>
              <Text style={styles.seriesFullForm}>{item.fullForm}</Text>
              <View style={styles.seriesMeta}>
                <Text style={styles.metaText}>📝 {item.tests} Mock Tests</Text>
                <Text style={styles.metaText}>⏱ 120 mins</Text>
                <Text style={styles.metaText}>📊 200 Qs</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Upcoming Banner */}
        <View style={styles.upcomingBanner}>
          <Text style={styles.upcomingIcon}>🔜</Text>
          <View style={styles.upcomingInfo}>
            <Text style={styles.upcomingTitle}>JIPMER Nursing Series</Text>
            <Text style={styles.upcomingSubtext}>Coming Soon - 25+ Mock Tests</Text>
          </View>
          <TouchableOpacity style={styles.notifyButton}>
            <Text style={styles.notifyText}>Notify</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
      <Footer navigation={navigation} activeTab="TestSeries" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 5 },
  categoryCard: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 15, alignItems: 'center', width: '23%', borderWidth: 1, borderColor: COLORS.border },
  categoryIcon: { fontSize: 22, marginBottom: 5 },
  categoryName: { color: COLORS.text, fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  categoryCount: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold', marginTop: 3 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginTop: 25, marginBottom: 15 },
  seriesCard: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'flex-start' },
  seriesIconBox: { width: 55, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  seriesIcon: { fontSize: 28 },
  seriesInfo: { flex: 1 },
  seriesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  seriesName: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  priceBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priceText: { fontSize: 12, fontWeight: 'bold' },
  seriesFullForm: { color: COLORS.textSecondary, fontSize: 11, marginBottom: 6 },
  seriesMeta: { flexDirection: 'row', gap: 12 },
  metaText: { color: COLORS.textSecondary, fontSize: 10 },
  upcomingBanner: { backgroundColor: 'rgba(123,47,255,0.05)', padding: 16, borderRadius: 15, marginTop: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)' },
  upcomingIcon: { fontSize: 30, marginRight: 12 },
  upcomingInfo: { flex: 1 },
  upcomingTitle: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  upcomingSubtext: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  notifyButton: { backgroundColor: COLORS.secondary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  notifyText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
