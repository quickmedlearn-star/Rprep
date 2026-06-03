import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const dailyQuestions = [
  { id: 1, question: 'Normal adult blood pressure is?', options: ['120/80 mmHg', '140/90 mmHg', '160/100 mmHg', '100/60 mmHg'], correct: 0, subject: 'Physiology' },
  { id: 2, question: 'Which vitamin helps in calcium absorption?', options: ['Vitamin A', 'Vitamin B12', 'Vitamin D', 'Vitamin C'], correct: 2, subject: 'Nutrition' },
  { id: 3, question: 'Insulin is produced by which organ?', options: ['Liver', 'Pancreas', 'Kidney', 'Spleen'], correct: 1, subject: 'Anatomy' },
  { id: 4, question: 'What does CPR stand for?', options: ['Cardio Pulmonary Resuscitation', 'Cardiac Pain Relief', 'Chronic Pain Relief', 'Critical Patient Recovery'], correct: 0, subject: 'Emergency' },
  { id: 5, question: 'Normal body temperature in Celsius?', options: ['35°C', '36°C', '37°C', '38°C'], correct: 2, subject: 'Fundamentals' },
  { id: 6, question: 'Which is a sign of inflammation?', options: ['Pallor', 'Cyanosis', 'Redness', 'Jaundice'], correct: 2, subject: 'Pathology' },
  { id: 7, question: 'Universal donor blood group?', options: ['A+', 'B+', 'AB+', 'O-'], correct: 3, subject: 'Hematology' },
  { id: 8, question: 'Antibiotic that affects bacterial cell wall?', options: ['Tetracycline', 'Penicillin', 'Erythromycin', 'Ciprofloxacin'], correct: 1, subject: 'Pharmacology' },
  { id: 9, question: 'Normal pulse rate in adults?', options: ['40-50/min', '60-100/min', '100-120/min', '120-140/min'], correct: 1, subject: 'Fundamentals' },
  { id: 10, question: 'Position for lumbar puncture?', options: ['Supine', 'Prone', 'Lateral recumbent', 'Fowler\'s'], correct: 2, subject: 'Procedures' },
];

export default function DailyQuizScreen({ navigation }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(20);
  const [answers, setAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quizStarted && timer > 0 && !showResult && selected === null) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && selected === null) {
      handleNext();
    }
  }, [timer, showResult, selected, quizStarted]);

  const handleAnswer = (index) => {
    setSelected(index);
    const correct = index === dailyQuestions[currentQ].correct;
    if (correct) setScore(score + 1);
    setAnswers([...answers, { q: currentQ, selected: index, correct }]);
  };

  const handleNext = () => {
    if (currentQ < dailyQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setTimer(20);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setTimer(20);
    setAnswers([]);
    setQuizStarted(true);
  };

  if (!quizStarted) {
    return (
      <View style={styles.container}>
        <Header title="Daily Quiz" subtitle="10 Questions • 20s each" showBack onBack={() => navigation.goBack()} />
        <View style={styles.startContainer}>
          <Text style={styles.startEmoji}>📅</Text>
          <Text style={styles.startTitle}>Daily Challenge</Text>
          <Text style={styles.startSubtitle}>Today's Nursing Quiz</Text>
          <View style={styles.rulesCard}>
            <Text style={styles.rulesTitle}>📋 Rules</Text>
            <Text style={styles.ruleText}>• 10 MCQs from various subjects</Text>
            <Text style={styles.ruleText}>• 20 seconds per question</Text>
            <Text style={styles.ruleText}>• Earn 10 XP per correct answer</Text>
            <Text style={styles.ruleText}>• Maintain your daily streak!</Text>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={() => setQuizStarted(true)}>
            <Text style={styles.startButtonText}>🚀 Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showResult) {
    return (
      <View style={styles.container}>
        <Header title="Quiz Result" showBack onBack={() => navigation.goBack()} />
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>{score >= 7 ? '🏆' : score >= 5 ? '👍' : '📚'}</Text>
          <Text style={styles.resultTitle}>Daily Quiz Complete!</Text>
          <Text style={styles.resultScore}>{score}/{dailyQuestions.length}</Text>
          <View style={styles.resultStats}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{dailyQuestions.length - score}</Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>+{score * 10}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>🔄 Retake Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.homeButtonText}>🏠 Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const q = dailyQuestions[currentQ];

  return (
    <View style={styles.container}>
      <Header title="Daily Quiz" showBack onBack={() => navigation.goBack()} />
      <View style={styles.quizHeader}>
        <View style={styles.timerBox}>
          <Text style={[styles.timerText, timer <= 5 && styles.timerWarning]}>⏱ {timer}s</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentQ + 1) / dailyQuestions.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{currentQ + 1}/{dailyQuestions.length}</Text>
        </View>
        <View style={styles.subjectBadge}>
          <Text style={styles.subjectText}>{q.subject}</Text>
        </View>
      </View>

      <ScrollView style={styles.questionContainer}>
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Q{currentQ + 1}.</Text>
          <Text style={styles.questionText}>{q.question}</Text>
        </View>

        {q.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selected === index && (index === q.correct ? styles.correctOption : styles.wrongOption),
              selected !== null && index === q.correct && styles.correctOption,
            ]}
            onPress={() => selected === null && handleAnswer(index)}
            disabled={selected !== null}
          >
            <View style={styles.optionLetter}>
              <Text style={styles.optionLetterText}>{String.fromCharCode(65 + index)}</Text>
            </View>
            <Text style={styles.optionText}>{option}</Text>
            {selected === index && index === q.correct && <Text style={styles.optionIcon}>✓</Text>}
            {selected === index && index !== q.correct && <Text style={styles.optionIcon}>✗</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selected !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentQ < dailyQuestions.length - 1 ? 'Next Question →' : 'View Results 🎯'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  startContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  startEmoji: { fontSize: 60, marginBottom: 15 },
  startTitle: { color: COLORS.primary, fontSize: 28, fontWeight: 'bold', textShadowColor: COLORS.glow.primary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  startSubtitle: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 25 },
  rulesCard: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 15, width: '100%', marginBottom: 25, borderWidth: 1, borderColor: COLORS.border },
  rulesTitle: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  ruleText: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 6, lineHeight: 20 },
  startButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, width: '100%', alignItems: 'center' },
  startButtonText: { color: COLORS.background, fontSize: 18, fontWeight: 'bold' },
  quizHeader: { paddingHorizontal: 20, paddingVertical: 10 },
  timerBox: { alignItems: 'center', marginBottom: 10 },
  timerText: { color: COLORS.primary, fontSize: 22, fontWeight: 'bold' },
  timerWarning: { color: COLORS.accent },
  progressContainer: { marginBottom: 10 },
  progressBar: { height: 6, backgroundColor: COLORS.surface, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressText: { color: COLORS.textSecondary, fontSize: 11, textAlign: 'right', marginTop: 3 },
  subjectBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(0,245,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  subjectText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold' },
  questionContainer: { flex: 1, paddingHorizontal: 20 },
  questionCard: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  questionNumber: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  questionText: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', lineHeight: 28 },
  optionButton: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  correctOption: { borderColor: COLORS.success, backgroundColor: 'rgba(0,255,136,0.1)' },
  wrongOption: { borderColor: COLORS.accent, backgroundColor: 'rgba(255,45,149,0.1)' },
  optionLetter: { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  optionLetterText: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  optionText: { color: COLORS.text, fontSize: 15, flex: 1 },
  optionIcon: { fontSize: 18, marginLeft: 8 },
  nextButton: { backgroundColor: COLORS.primary, margin: 20, padding: 16, borderRadius: 12, alignItems: 'center' },
  nextButtonText: { color: COLORS.background, fontSize: 16, fontWeight: 'bold' },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  resultEmoji: { fontSize: 70, marginBottom: 15 },
  resultTitle: { color: COLORS.primary, fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  resultScore: { color: COLORS.text, fontSize: 40, fontWeight: 'bold', marginBottom: 20 },
  resultStats: { flexDirection: 'row', gap: 12, marginBottom: 25 },
  statBox: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, minWidth: 80 },
  statValue: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, marginTop: 4 },
  restartButton: { backgroundColor: COLORS.secondary, padding: 14, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 10 },
  restartButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  homeButton: { backgroundColor: COLORS.surface, padding: 14, borderRadius: 12, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  homeButtonText: { color: COLORS.text, fontSize: 16 },
});
