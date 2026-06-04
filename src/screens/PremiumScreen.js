import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    icon: '🆓',
    color: COLORS.textSecondary,
    features: ['10 MCQs/day', 'Basic Analytics', 'Limited Subjects'],
  },
  {
    name: 'Pro Monthly',
    price: '₹299',
    icon: '💎',
    color: COLORS.primary,
    popular: true,
    features: ['Unlimited MCQs', 'AI Tutor', 'All Subjects', 'Mock Tests', 'Performance Analytics', 'Ad-Free'],
  },
  {
    name: 'Pro Yearly',
    price: '₹999',
    icon: '👑',
    color: COLORS.warning,
    features: ['Everything in Pro', 'Save 72%', 'Priority Support', 'Early Access Features', 'Certificate'],
  },
];

export default function PremiumScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Go Premium" subtitle="Unlock full potential" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>💎</Text>
          <Text style={styles.heroTitle}>Upgrade to RPREP Pro</Text>
          <Text style={styles.heroText}>Unlock AI-powered learning, unlimited tests, and ace your nursing exam!</Text>
        </View>

        <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        
        {plans.map((plan, index) => (
          <TouchableOpacity key={index} style={[styles.planCard, plan.popular && styles.popularCard]}>
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>🔥 MOST POPULAR</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <Text style={styles.planIcon}>{plan.icon}</Text>
              <View style={styles.planInfo}>
                <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price}<Text style={styles.planPeriod}>/{plan.name.includes('Monthly') ? 'mo' : plan.name.includes('Yearly') ? 'yr' : 'forever'}</Text></Text>
              </View>
            </View>
            <View style={styles.featuresList}>
              {plan.features.map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✅</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={[styles.buyBtn, { backgroundColor: plan.color }]}>
              <Text style={styles.buyText}>{plan.name === 'Free' ? 'Current Plan' : 'Upgrade Now'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={styles.guaranteeCard}>
          <Text style={styles.guaranteeIcon}>🛡️</Text>
          <Text style={styles.guaranteeTitle}>100% Satisfaction Guarantee</Text>
          <Text style={styles.guaranteeText}>Not satisfied? Get full refund within 24 hours. No questions asked.</Text>
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
  heroCard: { backgroundColor: 'rgba(255,184,0,0.05)', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: 'rgba(255,184,0,0.2)' },
  heroIcon: { fontSize: 50, marginBottom: 10 },
  heroTitle: { color: COLORS.warning, fontSize: 20, fontWeight: 'bold' },
  heroText: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 8 },
  sectionTitle: { color: COLORS.text, fontSize: 17, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  planCard: { backgroundColor: COLORS.surface, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  popularCard: { borderColor: COLORS.warning, borderWidth: 2 },
  popularBadge: { backgroundColor: COLORS.warning, paddingVertical: 5, alignItems: 'center' },
  popularText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  planHeader: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  planIcon: { fontSize: 35, marginRight: 15 },
  planInfo: { flex: 1 },
  planName: { fontSize: 18, fontWeight: 'bold' },
  planPrice: { color: COLORS.text, fontSize: 24, fontWeight: 'bold', marginTop: 3 },
  planPeriod: { fontSize: 12, color: COLORS.textSecondary },
  featuresList: { paddingHorizontal: 18, paddingBottom: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureCheck: { fontSize: 14, marginRight: 8 },
  featureText: { color: COLORS.textSecondary, fontSize: 13 },
  buyBtn: { padding: 14, borderRadius: 10, alignItems: 'center', marginHorizontal: 18, marginBottom: 18 },
  buyText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  guaranteeCard: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 5, borderWidth: 1, borderColor: COLORS.border },
  guaranteeIcon: { fontSize: 30, marginBottom: 8 },
  guaranteeTitle: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  guaranteeText: { color: COLORS.textSecondary, fontSize: 11, textAlign: 'center', marginTop: 5 },
});
