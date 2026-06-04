import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const testSeries = [
  { name: 'AIIMS NORCET Complete', tests: 30, price: '₹499', originalPrice: '₹999', discount: '50%', icon: '🏥', color: COLORS.primary },
  { name: 'PGIMER Nursing Pro', tests: 25, price: '₹399', originalPrice: '₹799', discount: '50%', icon: '🏛️', color: COLORS.secondary },
  { name: 'ESIC Nursing Bundle', tests: 20, price: '₹299', originalPrice: '₹599', discount: '50%', icon: '🏭', color: COLORS.success },
  { name: 'Railway Nurse Pack', tests: 18, price: '₹249', originalPrice: '₹499', discount: '50%', icon: '🚂', color: COLORS.warning },
  { name: 'State PSC All States', tests: 35, price: '₹599', originalPrice: '₹1199', discount: '50%', icon: '📋', color: COLORS.accent },
  { name: 'Pharmacology Mastery', tests: 15, price: '₹199', originalPrice: '₹399', discount: '50%', icon: '💊', color: '#4ECDC4' },
];

export default function StoreScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Test Series Store" subtitle="Premium test packs" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        <View style={styles.bannerCard}>
          <Text style={styles.bannerIcon}>🎉</Text>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>Launch Offer!</Text>
            <Text style={styles.bannerText}>50% OFF on all test series</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>🛒 Available Test Packs</Text>
        
        {testSeries.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.tests}>📝 {item.tests} Mock Tests</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.originalPrice}>{item.originalPrice}</Text>
                <View style={[styles.discountBadge, { backgroundColor: `${COLORS.success}20` }]}>
                  <Text style={[styles.discountText, { color: COLORS.success }]}>{item.discount} OFF</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={[styles.buyBtn, { backgroundColor: item.color }]}>
              <Text style={styles.buyText}>Buy</Text>
            </TouchableOpacity>
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
  bannerCard: { backgroundColor: 'rgba(255,184,0,0.08)', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(255,184,0,0.2)' },
  bannerIcon: { fontSize: 35, marginRight: 12 },
  bannerInfo: { flex: 1 },
  bannerTitle: { color: COLORS.warning, fontSize: 16, fontWeight: 'bold' },
  bannerText: { color: COLORS.textSecondary, fontSize: 12, marginTop: 3 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  card: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  icon: { fontSize: 25 },
  info: { flex: 1 },
  name: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  tests: { color: COLORS.textSecondary, fontSize: 11, marginTop: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  price: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  originalPrice: { color: COLORS.textSecondary, fontSize: 12, textDecorationLine: 'line-through' },
  discountBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  discountText: { fontSize: 10, fontWeight: 'bold' },
  buyBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  buyText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
});
