import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export const createUserProfile = async (user, name) => {
  try {
    await setDoc(doc(db, 'users', user.uid), {
      name: name || 'Nursing Aspirant',
      email: user.email,
      xp: 0,
      streak: 0,
      rank: '#New',
      progress: 0,
      membership: 'Free',
      avatar: '👤',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

export const getUserProfile = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    return null;
  }
};

export const updateUserProfile = async (uid, data) => {
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

export const saveTestResult = async (uid, result) => {
  try {
    const { subject, score, total, answers } = result;
    const accuracy = Math.round((score / total) * 100);
    
    await setDoc(doc(db, 'users', uid, 'results', Date.now().toString()), {
      subject,
      score,
      total,
      accuracy,
      answers,
      timestamp: new Date().toISOString(),
    });
    
    // Update user stats
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      await setDoc(doc(db, 'users', uid), {
        testsCompleted: (data.testsCompleted || 0) + 1,
        correctAnswers: (data.correctAnswers || 0) + score,
        totalQuestions: (data.totalQuestions || 0) + total,
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error saving result:', error);
  }
};

export const getTestResults = async (uid) => {
  try {
    const resultsRef = collection(db, 'users', uid, 'results');
    const q = query(resultsRef, orderBy('timestamp', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return [];
  }
};

export const getWeakAreas = async (uid) => {
  try {
    const results = await getTestResults(uid);
    const subjectMap = {};
    
    results.forEach(r => {
      if (!subjectMap[r.subject]) {
        subjectMap[r.subject] = { total: 0, correct: 0, count: 0 };
      }
      subjectMap[r.subject].total += r.total;
      subjectMap[r.subject].correct += r.score;
      subjectMap[r.subject].count += 1;
    });
    
    return Object.entries(subjectMap)
      .map(([subject, data]) => ({
        subject,
        accuracy: Math.round((data.correct / data.total) * 100),
        tests: data.count,
      }))
      .filter(s => s.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy);
  } catch (error) {
    return [];
  }
};

export const getLeaderboard = async (limit = 50) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('xp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      name: doc.data().name || 'Anonymous',
      xp: doc.data().xp || 0,
      testsCompleted: doc.data().testsCompleted || 0,
      accuracy: doc.data().totalQuestions > 0 
        ? Math.round((doc.data().correctAnswers / doc.data().totalQuestions) * 100) 
        : 0,
      streak: doc.data().streak || 0,
      membership: doc.data().membership || 'Free',
    }));
  } catch (error) {
    console.error('Leaderboard error:', error);
    return [];
  }
};

export const toggleBookmark = async (uid, questionId, question) => {
  try {
    const bookmarkRef = doc(db, 'users', uid, 'bookmarks', questionId.toString());
    const docSnap = await getDoc(bookmarkRef);
    
    if (docSnap.exists()) {
      await deleteDoc(bookmarkRef);
      return false; // unbookmarked
    } else {
      await setDoc(bookmarkRef, {
        ...question,
        bookmarkedAt: new Date().toISOString(),
      });
      return true; // bookmarked
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    return null;
  }
};

export const getBookmarks = async (uid) => {
  try {
    const bookmarksRef = collection(db, 'users', uid, 'bookmarks');
    const snapshot = await getDocs(bookmarksRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return [];
  }
};

export const isBookmarked = async (uid, questionId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid, 'bookmarks', questionId.toString()));
    return docSnap.exists();
  } catch (error) {
    return false;
  }
};
