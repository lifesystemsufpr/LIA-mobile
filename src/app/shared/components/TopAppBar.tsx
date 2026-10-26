import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../theme';

export type TopAppBarProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  dark?: boolean;
};

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  dark = false,
}) => {
  return (
    <View style={[styles.container, dark && styles.containerDark]}>
      <View style={styles.leftContainer}>
        {onBack && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            style={[styles.backButton, dark && styles.backButtonDark]}
          >
            <ArrowLeft size={20} color={dark ? '#FFFFFF' : Colors.textMain} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        <Text numberOfLines={1} style={[styles.title, dark && styles.titleDark]}>
          {title}
        </Text>
        {subtitle && (
          <Text numberOfLines={1} style={[styles.subtitle, dark && styles.subtitleDark]}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
  },
  containerDark: {
    backgroundColor: Colors.primaryDark,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: Colors.primaryDark,
  },
  titleDark: {
    color: Colors.darkText,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  subtitleDark: {
    color: Colors.darkTextMuted,
  },
});
