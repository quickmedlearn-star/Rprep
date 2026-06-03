import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../config/theme';

export default function Footer({ navigation, activeTab }) {
  const tabs = [
    { name: 'Home', icon: '🏠', route: 'Home' },
    { name: 'Test Series', icon: '📋', route: 'TestSeries' },
    { name: 'Subject Test', icon: '📚', route: 'SubjectTest' },
    { name: 'Rank', icon: '🏆', route: 'Leaderboard' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.glowLine} />
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.route;
        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.route)}
          >
            <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
              <Text style={styles.icon}>{tab.icon}</Text>
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.name}</Text>
            {isActive && (
              <View style={styles.activeIndicator}>
                <View style={styles.activeDot} />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    paddingBottom: 22,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  glowLine: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    backgroundColor: 'rgba(0, 245, 255, 0.3)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  icon: { fontSize: 22 },
  label: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '500' },
  activeLabel: { color: COLORS.primary, fontWeight: 'bold' },
  activeIndicator: { position: 'absolute', bottom: -6, alignItems: 'center' },
  activeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.primary },
});
