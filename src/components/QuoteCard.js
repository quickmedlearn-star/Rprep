import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../config/theme';

const quotes = [
  { text: "Nursing is not just a profession, it's a calling to serve humanity with compassion.", author: "Florence Nightingale" },
  { text: "Every nurse was drawn to nursing because of a desire to care, to serve, and to help.", author: "Christina Feist-Heilmeier" },
  { text: "Save one life, you're a hero. Save 100 lives, you're a nurse.", author: "Unknown" },
  { text: "Nursing is an art: and if it is to be made an art, it requires as exclusive a devotion, as hard a preparation.", author: "Florence Nightingale" },
  { text: "The character of a nurse is just as important as the knowledge she possesses.", author: "Carolyn Jarvis" },
];

export default function QuoteCard() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.quoteIcon}>
        <Text style={styles.quoteMark}>❝</Text>
      </View>
      <Text style={styles.quoteText}>{quote.text}</Text>
      <View style={styles.authorRow}>
        <View style={styles.line} />
        <Text style={styles.author}>— {quote.author}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.1)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  quoteIcon: {
    marginBottom: 10,
  },
  quoteMark: {
    fontSize: 40,
    color: COLORS.primary,
    opacity: 0.5,
  },
  quoteText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 15,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    width: 30,
    height: 1,
    backgroundColor: COLORS.primary,
    marginRight: 10,
    opacity: 0.5,
  },
  author: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
