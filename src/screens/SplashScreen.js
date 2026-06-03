import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const particleAnim1 = useRef(new Animated.Value(0)).current;
  const particleAnim2 = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(particleAnim1, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particleAnim1, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(particleAnim2, {
              toValue: 1,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(particleAnim2, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]),
      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const particle1Style = {
    transform: [
      { translateY: particleAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, -100] }) },
      { translateX: particleAnim1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 30, 0] }) },
    ],
    opacity: particleAnim1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 1, 0.3] }),
  };

  const particle2Style = {
    transform: [
      { translateY: particleAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, 100] }) },
      { translateX: particleAnim2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -30, 0] }) },
    ],
    opacity: particleAnim2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 1, 0.3] }),
  };

  const progressBarWidth = progressWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.particle, styles.particle1, particle1Style]}>
        <Text style={styles.particleIcon}>⚛️</Text>
      </Animated.View>
      <Animated.View style={[styles.particle, styles.particle2, particle2Style]}>
        <Text style={styles.particleIcon}>💡</Text>
      </Animated.View>
      <Animated.View style={[styles.particle, styles.particle3, {
        transform: [{ translateY: particleAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, -60] }) }],
        opacity: particleAnim2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1, 0.5] }),
      }]}>
        <Text style={styles.particleIcon}>🧬</Text>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🎓</Text>
          </View>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>AI</Text>
          </View>
        </Animated.View>

        <Animated.Text style={[styles.appName, { opacity: logoOpacity }]}>RPREP</Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>Your Nursing Success Partner</Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: taglineOpacity }]}>Your Nursing Success Partner</Animated.Text>

        <Animated.View style={[styles.featuresRow, { opacity: taglineOpacity }]}>
          <View style={styles.featureItem}><Text style={styles.featureIcon}>📚</Text><Text style={styles.featureText}>MCQ</Text></View>
          <View style={styles.featureItem}><Text style={styles.featureIcon}>🤖</Text><Text style={styles.featureText}>AI</Text></View>
          <View style={styles.featureItem}><Text style={styles.featureIcon}>🏆</Text><Text style={styles.featureText}>Rank</Text></View>
        </Animated.View>

        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingBar, { width: progressBarWidth }]} />
        </View>
        <Animated.Text style={[styles.loadingText, { opacity: taglineOpacity }]}>Loading amazing features...</Animated.Text>
      </View>

      <View style={styles.bottomGlow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  particle: { position: 'absolute', width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  particle1: { top: '20%', left: '15%' },
  particle2: { bottom: '25%', right: '15%' },
  particle3: { top: '40%', right: '20%' },
  particleIcon: { fontSize: 30 },
  content: { alignItems: 'center', zIndex: 1 },
  logoContainer: { marginBottom: 20, position: 'relative' },
  logoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(74, 144, 217, 0.15)', borderWidth: 2, borderColor: 'rgba(74, 144, 217, 0.4)', justifyContent: 'center', alignItems: 'center', shadowColor: '#4A90D9', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 10 },
  logoIcon: { fontSize: 55 },
  logoBadge: { position: 'absolute', bottom: 0, right: -5, backgroundColor: '#FF6B6B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 2, borderColor: '#0a0a1a' },
  logoBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  appName: { fontSize: 42, fontWeight: 'bold', color: '#4A90D9', marginBottom: 8, letterSpacing: 2, textShadowColor: 'rgba(74, 144, 217, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 15 },
  tagline: { fontSize: 18, color: '#fff', marginBottom: 5, fontWeight: '500' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 30, letterSpacing: 3, textTransform: 'uppercase' },
  featuresRow: { flexDirection: 'row', marginBottom: 40, gap: 25 },
  featureItem: { alignItems: 'center' },
  featureIcon: { fontSize: 28, marginBottom: 5 },
  featureText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold' },
  loadingContainer: { width: 200, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginBottom: 10 },
  loadingBar: { height: '100%', backgroundColor: '#4A90D9', borderRadius: 2, shadowColor: '#4A90D9', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10 },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  bottomGlow: { position: 'absolute', bottom: -50, width: width, height: 150, backgroundColor: 'rgba(74, 144, 217, 0.05)', borderRadius: width / 2 },
});
