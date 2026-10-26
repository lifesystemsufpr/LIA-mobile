import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Lock, LogIn, Mail } from 'lucide-react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../../shared';
import { Button } from '../../../shared/components/Button';
import { useAuth } from '../hooks/useAuth';

export const LoginScreen: React.FC = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('dr.roberto@lia.com');
  const [password, setPassword] = useState('••••••••');

  const handlePressLogin = () => {
    login({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand / Logo Section */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>LIA</Text>
          </View>
          <Text style={styles.appName}>LIA Mobile</Text>
          <Text style={styles.appSubtitle}>Avaliação Funcional & Mobilidade</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="rgba(147, 197, 253, 0.7)" style={styles.inputIcon} />
            <Text style={styles.inputStaticText}>{email}</Text>
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={20} color="rgba(147, 197, 253, 0.7)" style={styles.inputIcon} />
            <Text style={styles.inputStaticText}>{password}</Text>
          </View>

          <Button
            title="Entrar"
            variant="white"
            size="lg"
            loading={loading}
            icon={<LogIn size={20} color={Colors.primaryDark} />}
            onPress={handlePressLogin}
            style={styles.loginButton}
          />

          <TouchableOpacity activeOpacity={0.7} style={styles.forgotPassButton}>
            <Text style={styles.forgotPassText}>
              Esqueceu a senha? <Text style={styles.recoveryLink}>Recuperar</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>LIA PLATFORM V1.0 — TECNOAGING LAB</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
    paddingBottom: Spacing.xl,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.black,
    color: Colors.surface,
    letterSpacing: 2,
  },
  appName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extrabold,
    color: Colors.darkText,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.darkTextMuted,
    fontWeight: Typography.weights.medium,
  },
  formContainer: {
    width: '100%',
    marginBottom: Spacing.xxl,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    marginBottom: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  inputStaticText: {
    fontSize: Typography.sizes.md,
    color: Colors.surface,
    fontWeight: Typography.weights.medium,
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  forgotPassButton: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  forgotPassText: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(147, 197, 253, 0.6)',
  },
  recoveryLink: {
    color: Colors.secondary,
    textDecorationLine: 'underline',
    fontWeight: Typography.weights.bold,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: 10,
    color: 'rgba(147, 197, 253, 0.4)',
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
});
