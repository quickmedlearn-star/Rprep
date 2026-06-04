import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { auth } from '../config/firebase';
import { getBookmarks, toggleBookmark } from '../services/userService';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function BookmarkedScreen({ navigation }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBookmarks(); }, []);

  const loadBookmarks = async () => {
    const user = auth.currentUser;
    if (user) {
      const data = await getBookmarks(user.uid);
      setBookmarks(data);
    }
    setLoading(false);
  };

  const handleRemove = async (id) => {
    const user = auth.currentUser;
    if (user) {
      await toggleBookmark(user.uid, id, bookmarks.find(b => b.id === id));
      setBookmarks(bookmarks.filter(b => b.id !== id));
    }
  };

  const handleRemoveAll = () => {
    Alert.alert('Clear All', 'Remove all bookmarked questions?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Clear All', 
        style: 'destructive', 
        onPress: async () => {
          const user = auth.currentUser;
          if (user) {
            for (let b of bookmarks) {
              await toggleBookmark(user.uid, b.id, b);
            }
            setBookmarks([]);
          }
        }
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Bookmarked Qs" subtitle={`${bookmarks.length} saved`} showBack onBack={() => navigation.goBack()} />
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 100 }} />
      ) : (
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          
          {bookmarks.length > 0 ? (
            <>
              <View style={styles.headerRow}>
                <Text style={styles.countText}>📑 {bookmarks.length} Questions Saved</Text>
                <TouchableOpacity onPress={handleRemoveAll}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              {bookmarks.map((item, index) => (
                <View key={item.id || index} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.subjectBadge}>
                      <Text style={styles.subjectText}>{item.subject || 'General'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeBtn}>
                      <Text style={styles.removeIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.question} numberOfLines={3}>
                    {item.question}
                  </Text>
                  
                  {item.options && (
                    <View style={styles.optionsGrid}>
                      {item.options.slice(0, 2).map((opt, i) => (
                        <Text key={i} style={styles.option} numberOfLines={1}>
                          {String.fromCharCode(65 + i)}) {opt}
                        </Text>
                      ))}
                    </View>
                  )}
                  
                  {item.correct !== undefined && (
                    <View style={styles.answerRow}>
                      <Text style={styles.answerLabel}>Correct:</Text>
                      <Text style={styles.answerValue}>
                        {String.fromCharCode(65 + item.correct)}) {item.options?.[item.correct]}
                      </Text>
                    </View>
                  )}
                  
                  <Text style={styles.dateText}>
                    Saved: {new Date(item.bookmarkedAt).toLocaleDateString('en-IN')}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📑</Text>
              <Text style={styles.emptyTitle}>No Bookmarks</Text>
              <Text style={styles.emptyText}>Save questions while practicing to review them later!</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('MCQ')}>
                <Text style={styles.emptyButtonText}>Start Practice</Text>
              </TouchableOpacity>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  countText: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  clearText: { color: COLORS.accent, fontSize: 13 },
  card: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  subjectBadge: { backgroundColor: 'rgba(0,245,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  subjectText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold' },
  removeBtn: { padding: 5 },
  removeIcon: { fontSize: 16 },
  question: { color: COLORS.text, fontSize: 14, fontWeight: '500', lineHeight: 20, marginBottom: 10 },
  optionsGrid: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  option: { color: COLORS.textSecondary, fontSize: 11, flex: 1 },
  answerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, backgroundColor: 'rgba(0,255,136,0.05)', padding: 8, borderRadius: 8 },
  answerLabel: { color: COLORS.success, fontSize: 11, fontWeight: 'bold', marginRight: 5 },
  answerValue: { color: COLORS.success, fontSize: 11, flex: 1 },
  dateText: { color: COLORS.textSecondary, fontSize: 9 },
  emptyCard: { backgroundColor: COLORS.surface, padding: 30, borderRadius: 15, alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: COLORS.border },
  emptyIcon: { fontSize: 50, marginBottom: 15 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  emptyText: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', marginBottom: 15 },
  emptyButton: { backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
  emptyButtonText: { color: COLORS.background, fontSize: 15, fontWeight: 'bold' },
});
