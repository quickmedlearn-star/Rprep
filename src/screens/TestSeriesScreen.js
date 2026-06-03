import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TestSeriesScreen({ navigation }) {
  const series = [
    { name: 'AIIMS NORCET Prep', tests: 25, price: 'Free', icon: '🏥', color: COLORS.primary },
    { name: 'PGIMER Nursing', tests: 20, price: '₹299', icon: '🏛️', color: COLORS.secondary },
    { name: 'ESIC Nursing Officer', tests: 15, price: 'Free', icon: '🏭', color: COLORS.success },
    { name: 'Railway Nurse', tests: 18, price: '₹199', icon: '🚂', color: COLORS.warning },
    { name: 'State PSC Nursing', tests: 30, price: '₹399', icon: '📋', color: COLORS.accent },
  ];

  return (
    <View style={styles.container}>
      <Header title="Test Series" subtitle="Exam-wise mock tests" showMenu onMenu={() => navigation.openDrawer?.()} />
      <ScrollView style={styles.scrollArea}>
        <Text style={styles.sectionTitle}>📋 Available Test Series</Text>
        {series.map((item, index) => (
          <TouchableOpacity key={index} style={styles.seriesCard}>
            <View style={[styles.seriesIconBox, { backgroundColor: `${item.color}15` }]}>
              <Text style={styles.seriesIcon}>{item.icon}</Text>
            </View>
            <View style={styles.seriesInfo}>
              <Text style={styles.seriesName}>{item.name}</Text>
              <Text style={styles.seriesTests}>📝 {item.tests} Mock Tests</Text>
            </View>
            <View style={[styles.priceBadge, { backgroundColor: item.price === 'Free' ? 'rgba(0,255,136,0.1)' : 'rgba(255,184,0,0.1)' }]}>
              <Text style={[styles.priceText, { color: item.price === 'Free' ? COLORS.success : COLORS.warning }]}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Footer navigation={navigation} activeTab="TestSeries" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 15 },
  seriesCard: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  seriesIconBox: { width: 55, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  seriesIcon: { fontSize: 28 },
  seriesInfo: { flex: 1 },
  seriesName: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  seriesTests: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  priceBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  priceText: { fontSize: 13, fontWeight: 'bold' },
});
