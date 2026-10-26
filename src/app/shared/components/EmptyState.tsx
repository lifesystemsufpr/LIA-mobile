import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FolderOpen } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../theme';
import { Button } from './Button';

export type EmptyStateProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionTitle?: string;
  onAction?: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionTitle,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon ?? <FolderOpen size={40} color={Colors.textMuted} />}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} style={styles.actionButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  actionButton: {
    marginTop: Spacing.lg,
  },
});
