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
