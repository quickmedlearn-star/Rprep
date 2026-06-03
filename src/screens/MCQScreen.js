import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { COLORS } from '../config/theme';
import Header from '../components/Header';

const sampleQuestions = [
  {
    id: 1,
    question: 'What is the normal range for adult blood pressure?',
    options: ['120/80 mmHg', '140/90 mmHg', '100/60 mmHg', '160/100 mmHg'],
    correct: 0,
  },
  {
    id: 2,
    question: 'Which vitamin is essential for calcium absorption?',
    options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
    correct: 3,
  },
  {
    id: 3,
    question: 'What is the normal resting heart rate for adults?',
    options: ['40-50 bpm', '60-100 bpm', '100-120 bpm', '120-140 bpm'],
    correct: 1,
  },
  {
    id: 4,
    question: 'Which organ produces insulin?',
    options: ['Liver', 'Kidney', 'Pancreas', 'Heart'],
    correct: 2,
  },
  {
    id: 5,
    question: 'What does CPR stand for?',
    options: [
      'Cardio Pulmonary Resuscitation',
      'Cardiac Pain Relief',
      'Critical Patient Recovery',
      'Chronic Pain Relief',
    ],
    correct: 0,
  },
];

export default function MCQScreen({ navigation }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(30);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (timer > 0 && !showResult && selectedAnswer === null) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && selectedAnswer === null) {
      handleNext();
    }
  }, [timer, showResult, selectedAnswer]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    const isCorrect = index === sampleQuestions[currentQuestion].correct;
    if (isCorrect) setScore(score + 1);
    setAnswers([...answers, { question: currentQuestion, selected: index, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimer(30);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setTimer(30);
    setAnswers([]);
  };

  if (showResult) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <Header title="Quiz Result" showBack onBack={() => navigation.goBack()} />
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>{score >= 3 ? '🎉' : '📚'}</Text>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.resultScore}>{score} / {sampleQuestions.length}</Text>
          <Text style={styles.resultPercentage}>{Math.round((score / sampleQuestions.length) * 100)}%</Text>
          
          <View style={styles.resultStats}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{sampleQuestions.length - score}</Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>+{score * 10}</Text>
              <Text style={styles.statLabel}>XP Earned</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.homeButtonText}>🏠 Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const question = sampleQuestions[currentQuestion];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <Header 
        title="MCQ Practice" 
        showBack 
        onBack={() => navigation.goBack()} 
      />
      
      <View style={styles.timerBox}>
        <Text style={[styles.timerText, timer <= 5 && styles.timerWarning]}>
          ⏱ {timer}s
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentQuestion + 1}/{sampleQuestions.length}</Text>
      </View>

      <ScrollView style={styles.questionContainer}>
        <View style={styles.questionCard}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionBadgeText}>Q{currentQuestion + 1}</Text>
          </View>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && (index === question.correct ? styles.correctOption : styles.wrongOption),
                selectedAnswer !== null && index === question.correct && styles.correctOption,
              ]}
              onPress={() => selectedAnswer === null && handleAnswer(index)}
              disabled={selectedAnswer !== null}
            >
              <View style={styles.optionLetter}>
                <Text style={styles.optionLetterText}>{String.fromCharCode(65 + index)}</Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
              {selectedAnswer === index && index === question.correct && <Text style={styles.optionIcon}>✓</Text>}
              {selectedAnswer === index && index !== question.correct && <Text style={styles.optionIcon}>✗</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {selectedAnswer !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentQuestion < sampleQuestions.length - 1 ? 'Next →' : 'See Results 🎯'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  timerBox: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timerText: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold' },
  timerWarning: { color: COLORS.accent },
  progressContainer: { paddingHorizontal: 20, marginTop: 15, marginBottom: 10 },
  progressBar: { height: 6, backgroundColor: COLORS.surface, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressText: { color: COLORS.textSecondary, fontSize: 12, textAlign: 'right', marginTop: 5 },
  questionContainer: { flex: 1, paddingHorizontal: 20 },
  questionCard: { backgroundColor: COLORS.surface, padding: 25, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 25 },
  questionBadge: { backgroundColor: 'rgba(0, 245, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 15 },
  questionBadgeText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
  questionText: { color: COLORS.text, fontSize: 20, fontWeight: 'bold', lineHeight: 30 },
  optionsContainer: { gap: 12, paddingBottom: 20 },
  optionButton: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' },
  correctOption: { borderColor: COLORS.success, backgroundColor: 'rgba(0, 255, 136, 0.1)' },
  wrongOption: { borderColor: COLORS.accent, backgroundColor: 'rgba(255, 45, 149, 0.1)' },
  optionLetter: { width: 35, height: 35, borderRadius: 10, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  optionLetterText: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  optionText: { color: COLORS.text, fontSize: 16, flex: 1 },
  optionIcon: { fontSize: 20, marginLeft: 10 },
  nextButton: { backgroundColor: COLORS.primary, margin: 20, padding: 18, borderRadius: 15, alignItems: 'center' },
  nextButtonText: { color: COLORS.background, fontSize: 18, fontWeight: 'bold' },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  resultEmoji: { fontSize: 80, marginBottom: 20 },
  resultTitle: { color: COLORS.primary, fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  resultScore: { color: COLORS.text, fontSize: 48, fontWeight: 'bold', marginBottom: 5 },
  resultPercentage: { color: COLORS.success, fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  resultStats: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statBox: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, minWidth: 90 },
  statValue: { color: COLORS.text, fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: COLORS.textSecondary, fontSize: 11, marginTop: 5 },
  restartButton: { backgroundColor: COLORS.secondary, padding: 16, borderRadius: 15, alignItems: 'center', width: '100%', marginBottom: 12 },
  restartButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  homeButton: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 15, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: COLORS.border },
  homeButtonText: { color: COLORS.text, fontSize: 16 },
});
