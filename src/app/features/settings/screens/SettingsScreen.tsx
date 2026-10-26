import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronRight,
  Cloud,
  Database,
  Info,
  LogOut,
} from 'lucide-react-native';
import {
  BorderRadius,
  Button,
  Colors,
  getInitials,
  Spacing,
  TopAppBar,
  Typography,
  useSessionStore,
} from '../../../shared';

export type SettingsScreenProps = {
  onLogout?: () => void;
  onBack?: () => void;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onLogout,
  onBack,
}) => {
  const { professional, logout } = useSessionStore();
  const initials = getInitials(professional?.name ?? 'Dr. Roberto Silva');

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <View style={styles.container}>
      <TopAppBar title="Configurações" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{professional?.name ?? 'Dr. Roberto Silva'}</Text>
            <Text style={styles.category}>
              {professional?.professionalCategory ?? 'Fisioterapeuta'}
            </Text>
          </View>
          <ChevronRight size={20} color={Colors.border} />
        </View>

        {/* Settings Menu List */}
        <View style={styles.menuCard}>
          {/* Sincronização */}
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}>
            <View style={styles.menuIconWrapper}>
              <Cloud size={20} color={Colors.primaryDark} />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={styles.menuTitle}>Sincronização</Text>
              <Text style={styles.menuSubtitle}>Status da conexão com LIA Web</Text>
            </View>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Armazenamento local */}
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}>
            <View style={styles.menuIconWrapper}>
              <Database size={20} color={Colors.primaryDark} />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={styles.menuTitle}>Armazenamento local</Text>
              <Text style={styles.menuSubtitle}>12 avaliações &bull; 2.4 MB</Text>
            </View>
            <ChevronRight size={18} color={Colors.border} />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Sobre o LIA */}
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}>
            <View style={styles.menuIconWrapper}>
              <Info size={20} color={Colors.primaryDark} />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={styles.menuTitle}>Sobre o LIA</Text>
              <Text style={styles.menuSubtitle}>Versão 1.0 &bull; TecnoAging Lab</Text>
            </View>
            <ChevronRight size={18} color={Colors.border} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <Button
          title="Sair da conta"
          variant="outline"
          size="lg"
          icon={<LogOut size={20} color={Colors.danger} />}
          onPress={handleLogout}
          style={styles.logoutButton}
        />

        <Text style={styles.buildFooter}>LIA Mobile v1.0.0 &bull; Build 2026.09</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textMain,
    marginBottom: 2,
  },
  category: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuTextContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textMain,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  onlineText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 68,
  },
  logoutButton: {
    marginBottom: Spacing.lg,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  buildFooter: {
    fontSize: 10,
    color: 'rgba(102, 112, 133, 0.6)',
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
  },
});
