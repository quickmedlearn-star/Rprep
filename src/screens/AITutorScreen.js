import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { getAIResponse } from '../services/aiService';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const quickPrompts = [
  { icon: '📚', label: 'Study Plan', query: 'Create a 7-day study plan for nursing officer exam covering anatomy, pharmacology and fundamentals' },
  { icon: '💊', label: 'Drug Classifications', query: 'Explain major drug classifications for nursing exams with examples' },
  { icon: '📝', label: 'MCQ Practice', query: 'Give me 5 important nursing MCQs with answers and explanations' },
  { icon: '🎯', label: 'Exam Strategy', query: 'Tips to score high in nursing officer CBT exam' },
];

export default function AITutorScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const handleSend = async (text) => {
    const msgText = text || input.trim();
    if (!msgText) return;
    
    const userMsg = { type: 'user', text: msgText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await getAIResponse(msgText);
    setMessages(prev => [...prev, { type: 'ai', text: response.text }]);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header title="AI Tutor" subtitle="Gemini AI Powered" showBack onBack={() => navigation.goBack()} />
      
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView 
          style={styles.chatArea} 
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeIcon}>🤖</Text>
              <Text style={styles.welcomeTitle}>AI Nursing Tutor</Text>
              <Text style={styles.welcomeText}>Powered by Google Gemini AI</Text>
              <Text style={styles.welcomeSubtext}>Ask me anything about nursing exam preparation!</Text>
              
              <Text style={styles.promptTitle}>Try asking:</Text>
              {quickPrompts.map((p, i) => (
                <TouchableOpacity key={i} style={styles.promptBtn} onPress={() => handleSend(p.query)}>
                  <Text style={styles.promptIcon}>{p.icon}</Text>
                  <Text style={styles.promptLabel}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {messages.map((msg, index) => (
            <View key={index} style={[styles.msgRow, msg.type === 'user' ? styles.userRow : styles.aiRow]}>
              {msg.type === 'ai' && (
                <View style={styles.aiAvatar}>
                  <Text style={styles.aiAvatarIcon}>🤖</Text>
                </View>
              )}
              <View style={[styles.msgBubble, msg.type === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.msgText, msg.type === 'user' ? styles.userText : styles.aiText]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {loading && (
            <View style={styles.loadingRow}>
              <View style={styles.loadingBubble}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.loadingText}>AI is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type your question..."
            placeholderTextColor={COLORS.textSecondary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSend()}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} onPress={() => handleSend()} disabled={!input.trim() || loading}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      <Footer navigation={navigation} activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  chatArea: { flex: 1, paddingHorizontal: 15 },
  welcomeCard: { paddingVertical: 20, alignItems: 'center' },
  welcomeIcon: { fontSize: 60, marginBottom: 10 },
  welcomeTitle: { color: COLORS.primary, fontSize: 24, fontWeight: 'bold', textShadowColor: COLORS.glow.primary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  welcomeText: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  welcomeSubtext: { color: COLORS.textSecondary, fontSize: 13, marginTop: 15, textAlign: 'center' },
  promptTitle: { color: COLORS.text, fontSize: 14, fontWeight: 'bold', marginTop: 20, marginBottom: 10, alignSelf: 'flex-start' },
  promptBtn: { backgroundColor: COLORS.surface, padding: 14, borderRadius: 12, width: '100%', marginBottom: 8, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  promptIcon: { fontSize: 20, marginRight: 12 },
  promptLabel: { color: COLORS.text, fontSize: 13, fontWeight: '500' },
  msgRow: { marginBottom: 16, flexDirection: 'row', alignItems: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,245,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 8, marginTop: 4 },
  aiAvatarIcon: { fontSize: 16 },
  msgBubble: { padding: 14, borderRadius: 18, maxWidth: '80%' },
  userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderBottomLeftRadius: 4 },
  msgText: { fontSize: 14, lineHeight: 22 },
  userText: { color: COLORS.background },
  aiText: { color: COLORS.text },
  loadingRow: { flexDirection: 'row', marginBottom: 16 },
  loadingBubble: { backgroundColor: COLORS.surface, padding: 12, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: COLORS.border },
  loadingText: { color: COLORS.textSecondary, fontSize: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
  input: { flex: 1, backgroundColor: COLORS.background, color: COLORS.text, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, fontSize: 14, maxHeight: 100, borderWidth: 1, borderColor: COLORS.border },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 8, marginBottom: 2 },
  sendBtnDisabled: { opacity: 0.5 },
  sendIcon: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
