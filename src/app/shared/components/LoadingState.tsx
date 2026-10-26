import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../theme';

export type LoadingStateProps = {
  message?: string;
};

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Carregando...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
  message: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
});
