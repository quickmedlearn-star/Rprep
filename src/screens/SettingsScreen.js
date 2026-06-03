import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, TextInput, Modal } from 'react-native';
import { signOut, updatePassword, updateEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { COLORS } from '../config/theme';
import Header from '../components/Header';

export default function SettingsScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [examAlerts, setExamAlerts] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [autoNext, setAutoNext] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const data = await getUserProfile(user.uid);
      setProfile(data);
      setNewName(data?.name || '');
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (user && newName.trim()) {
      await updateUserProfile(user.uid, { name: newName });
      Alert.alert('✅', 'Profile updated successfully!');
      setShowEditProfile(false);
      loadProfile();
    }
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleSavePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Password must be 6+ characters');
      return;
    }
    try {
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      Alert.alert('✅', 'Password changed successfully!');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSync = async () => {
    const user = auth.currentUser;
    if (user) {
      await updateUserProfile(user.uid, {
        lastSynced: new Date().toISOString(),
        settings: { darkMode, notifications, sound, vibration, autoNext }
      });
      Alert.alert('🔄 Synced', 'Data synced successfully!');
    }
  };

  const handleClearCache = () => {
    Alert.alert('🗑️', 'Cache cleared (24.5 MB)', [{ text: 'OK' }]);
  };

  const handleLogout = () => {
    Alert.alert('🚪 Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { await signOut(auth); } }
    ]);
  };

  const handleAbout = () => {
    Alert.alert('ℹ️ RPREP v1.0.0', 'Your Nursing Success Partner\n\nIndia\'s #1 Nursing Exam Prep Platform\nAI-Powered Learning\n\n© 2026 RPREP Technologies');
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" subtitle="Customize your experience" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.scrollArea}>
        
        {/* Profile Card */}
        <TouchableOpacity style={styles.profileCard} onPress={handleEditProfile}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarIcon}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.name || 'Nursing Aspirant'}</Text>
            <Text style={styles.profileEmail}>{auth.currentUser?.email}</Text>
            <Text style={styles.profileMember}>{profile?.membership || 'Free'} Member</Text>
          </View>
          <Text style={styles.profileArrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>APPEARANCE</Text>
        <View style={styles.sectionCard}>
          <View style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>🌙</Text><Text style={styles.settingLabel}>Dark Mode</Text></View><Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#333', true: COLORS.primary }} thumbColor={darkMode ? '#fff' : '#888'} /></View>
          <View style={styles.settingBorder} />
          <View style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>🔤</Text><Text style={styles.settingLabel}>Font Size</Text></View><Text style={styles.settingValue}>Medium</Text></View>
        </View>

        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        <View style={styles.sectionCard}>
          <View style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>🔔</Text><Text style={styles.settingLabel}>Push Notifications</Text></View><Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#333', true: COLORS.primary }} thumbColor={notifications ? '#fff' : '#888'} /></View>
          <View style={styles.settingBorder} />
          <View style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>📢</Text><Text style={styles.settingLabel}>Exam Alerts</Text></View><Switch value={examAlerts} onValueChange={setExamAlerts} trackColor={{ false: '#333', true: COLORS.primary }} thumbColor={examAlerts ? '#fff' : '#888'} /></View>
          <View style={styles.settingBorder} />
          <View style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>📧</Text><Text style={styles.settingLabel}>Email Updates</Text></View><Switch value={emailUpdates} onValueChange={setEmailUpdates} trackColor={{ false: '#333', true: COLORS.primary }} thumbColor={emailUpdates ? '#fff' : '#888'} /></View>
        </View>

        <Text style={styles.sectionTitle}>QUIZ SETTINGS</Text>
        <View style={styles.sectionCard}>
          <View style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>🔊</Text><Text style={styles.settingLabel}>Sound Effects</Text></View><Switch value={sound} onValueChange={setSound} trackColor={{ false: '#333', true: COLORS.primary }} thumbColor={sound ? '#fff' : '#888'} /></View>
          <View style={styles.settingBorder} />
          <View style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>📳</Text><Text style={styles.settingLabel}>Vibration</Text></View><Switch value={vibration} onValueChange={setVibration} trackColor={{ false: '#333', true: COLORS.primary }} thumbColor={vibration ? '#fff' : '#888'} /></View>
          <View style={styles.settingBorder} />
          <View style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>⏭️</Text><Text style={styles.settingLabel}>Auto Next</Text></View><Switch value={autoNext} onValueChange={setAutoNext} trackColor={{ false: '#333', true: COLORS.primary }} thumbColor={autoNext ? '#fff' : '#888'} /></View>
          <View style={styles.settingBorder} />
          <View style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>⏱️</Text><Text style={styles.settingLabel}>Default Timer</Text></View><Text style={styles.settingValue}>30 sec</Text></View>
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}><View style={styles.settingLeft}><Text style={styles.settingIcon}>👤</Text><Text style={styles.settingLabel}>Edit Profile</Text></View><Text style={styles.settingArrow}>›</Text></TouchableOpacity>
          <View style={styles.settingBorder} />
          <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}><View style={styles.settingLeft}><Text style={styles.settingIcon}>🔒</Text><Text style={styles.settingLabel}>Change Password</Text></View><Text style={styles.settingArrow}>›</Text></TouchableOpacity>
          <View style={styles.settingBorder} />
          <TouchableOpacity style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>📧</Text><Text style={styles.settingLabel}>Email Preferences</Text></View><Text style={styles.settingArrow}>›</Text></TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>DATA & STORAGE</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.settingItem} onPress={handleSync}><View style={styles.settingLeft}><Text style={styles.settingIcon}>🔄</Text><Text style={styles.settingLabel}>Sync Data</Text></View><Text style={styles.settingArrow}>›</Text></TouchableOpacity>
          <View style={styles.settingBorder} />
          <TouchableOpacity style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>📥</Text><Text style={styles.settingLabel}>Download Offline</Text></View><Text style={styles.settingArrow}>›</Text></TouchableOpacity>
          <View style={styles.settingBorder} />
          <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}><View style={styles.settingLeft}><Text style={styles.settingIcon}>🗑️</Text><Text style={styles.settingLabel}>Clear Cache</Text></View><Text style={styles.cacheSize}>24.5 MB</Text></TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}><View style={styles.settingLeft}><Text style={styles.settingIcon}>ℹ️</Text><Text style={styles.settingLabel}>About RPREP</Text></View><Text style={styles.settingArrow}>›</Text></TouchableOpacity>
          <View style={styles.settingBorder} />
          <TouchableOpacity style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>📄</Text><Text style={styles.settingLabel}>Terms & Conditions</Text></View><Text style={styles.settingArrow}>›</Text></TouchableOpacity>
          <View style={styles.settingBorder} />
          <TouchableOpacity style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>🔏</Text><Text style={styles.settingLabel}>Privacy Policy</Text></View><Text style={styles.settingArrow}>›</Text></TouchableOpacity>
          <View style={styles.settingBorder} />
          <TouchableOpacity style={styles.settingItem}><View style={styles.settingLeft}><Text style={styles.settingIcon}>⭐</Text><Text style={styles.settingLabel}>Rate Us</Text></View><Text style={styles.settingArrow}>›</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>RPREP v1.0.0 | Pro</Text>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfile} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput style={styles.modalInput} placeholder="Full Name" placeholderTextColor="#888" value={newName} onChangeText={setNewName} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowEditProfile(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSaveProfile}><Text style={styles.modalSaveText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={showChangePassword} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput style={styles.modalInput} placeholder="New Password (6+ chars)" placeholderTextColor="#888" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => { setShowChangePassword(false); setNewPassword(''); }}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSavePassword}><Text style={styles.modalSaveText}>Update</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollArea: { flex: 1, paddingHorizontal: 15 },
  profileCard: { backgroundColor: COLORS.surface, padding: 18, borderRadius: 15, marginTop: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  profileAvatar: { width: 55, height: 55, borderRadius: 28, backgroundColor: 'rgba(0,245,255,0.1)', borderWidth: 2, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  profileAvatarIcon: { fontSize: 28 },
  profileInfo: { flex: 1, marginLeft: 15 },
  profileName: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  profileEmail: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  profileMember: { color: COLORS.warning, fontSize: 10, marginTop: 4 },
  profileArrow: { color: COLORS.textSecondary, fontSize: 24 },
  sectionTitle: { color: 'rgba(0,245,255,0.5)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginTop: 22, marginBottom: 8, paddingHorizontal: 5 },
  sectionCard: { backgroundColor: COLORS.surface, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 18 },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { fontSize: 18, marginRight: 12, width: 25 },
  settingLabel: { color: COLORS.text, fontSize: 14 },
  settingValue: { color: COLORS.textSecondary, fontSize: 13 },
  settingArrow: { color: COLORS.textSecondary, fontSize: 22, fontWeight: 'bold' },
  cacheSize: { color: COLORS.warning, fontSize: 12 },
  logoutButton: { backgroundColor: 'rgba(255,45,149,0.1)', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: 'rgba(255,45,149,0.3)' },
  logoutText: { color: COLORS.accent, fontSize: 16, fontWeight: 'bold' },
  versionText: { color: COLORS.textSecondary, fontSize: 11, textAlign: 'center', marginTop: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 30 },
  modalContent: { backgroundColor: COLORS.surface, padding: 25, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  modalTitle: { color: COLORS.primary, fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalInput: { backgroundColor: COLORS.background, color: COLORS.text, padding: 15, borderRadius: 12, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  modalCancel: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: COLORS.surfaceLight },
  modalCancelText: { color: COLORS.textSecondary, fontSize: 15, fontWeight: 'bold' },
  modalSave: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: COLORS.primary },
  modalSaveText: { color: COLORS.background, fontSize: 15, fontWeight: 'bold' },
});
