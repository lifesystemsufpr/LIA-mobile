import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../theme';
import { Button } from './Button';

export type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Algo deu errado',
  message,
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertTriangle size={36} color={Colors.danger} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title="Tentar Novamente"
          variant="outline"
          onPress={onRetry}
          style={styles.retryButton}
        />
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  message: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  retryButton: {
    marginTop: Spacing.lg,
  },
});
