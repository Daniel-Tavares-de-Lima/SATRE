import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '@/constants/theme';

interface ScreenHeaderProps {
  /** Tab/screen title (default header variant). */
  title?: string;
  /** Home tab: avatar row instead of centered title. */
  variant?: 'default' | 'home';
  userLabel?: string;
  showBack?: boolean;
  onBack?: () => void;
  onSettingsPress?: () => void;
  onProfilePress?: () => void;
  rightAction?: ReactNode;
}

export function ScreenHeader({
  title,
  variant = 'default',
  userLabel = 'Usuário',
  showBack = false,
  onBack,
  onSettingsPress,
  onProfilePress,
  rightAction,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    }
  }

  function handleSettings() {
    if (onSettingsPress) {
      onSettingsPress();
      return;
    }
    router.push('/configuracoes');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      {variant === 'home' ? (
        <View style={styles.homeRow}>
          <Pressable
            style={styles.avatarButton}
            onPress={onProfilePress}
            accessibilityLabel="Ir para perfil"
          >
            <Ionicons name="person" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.homeTitle} numberOfLines={1}>
            {userLabel}
          </Text>
          <Pressable
            style={styles.iconButton}
            onPress={handleSettings}
            accessibilityLabel="Configurações"
          >
            <Ionicons name="settings-outline" size={22} color={colors.textOnPrimary} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.defaultRow}>
          {showBack ? (
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
              accessibilityLabel="Voltar"
            >
              <Ionicons name="chevron-back" size={26} color={colors.textOnPrimary} />
            </Pressable>
          ) : (
            <View style={styles.backPlaceholder} />
          )}

          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          {rightAction ?? <View style={styles.backPlaceholder} />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.header,
    borderBottomRightRadius: radius.header,
  },
  homeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeTitle: {
    flex: 1,
    ...typography.screenTitle,
    color: colors.textOnPrimary,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backPlaceholder: { width: 44 },
  title: {
    flex: 1,
    textAlign: 'center',
    ...typography.screenTitle,
    color: colors.textOnPrimary,
  },
});
