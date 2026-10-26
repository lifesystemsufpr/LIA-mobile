import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../theme';

export type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  icon?: React.ReactNode;
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  icon,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error ? styles.inputError : undefined]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          placeholderTextColor="#9CA3AF"
          style={[styles.input, style]}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    width: '100%',
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: '#FEF2F2',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.textMain,
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    color: Colors.danger,
    marginTop: 4,
    fontWeight: Typography.weights.medium,
  },
});
