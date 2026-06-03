import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { COLORS } from '../config/theme';

export default function Header({ title, subtitle, onBack, onMenu, showBack, showMenu }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity style={styles.iconButton} onPress={onBack}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          ) : showMenu ? (
            <TouchableOpacity style={styles.iconButton} onPress={onMenu}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
          ) : null}
          <View>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            <Text style={styles.title}>{title || 'RPREP'}</Text>
          </View>
        </View>
        <Text style={styles.brandIcon}>🎓</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: 45,
    paddingBottom: 12,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  backIcon: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuIcon: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 2,
  },
  title: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: COLORS.glow.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  brandIcon: {
    fontSize: 24,
    marginLeft: 10,
  },
});
