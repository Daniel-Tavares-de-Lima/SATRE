import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { colors, spacing } from '@/constants/theme';

interface AuthTextFieldProps extends TextInputProps {
  label: string;
  /** Figma login uses underline-only inputs. */
  variant?: 'boxed' | 'underline';
}

export function AuthTextField({ label, variant = 'underline', style, ...props }: AuthTextFieldProps) {
  const isUnderline = variant === 'underline';

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[isUnderline ? styles.inputUnderline : styles.inputBox, style]}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
      {isUnderline ? <View style={styles.underline} /> : null}
    </View>
  );
}

interface ConsentCheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function ConsentCheckbox({ label, checked, onToggle }: ConsentCheckboxProps) {
  return (
    <Pressable
      style={styles.checkboxRow}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.lg },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputUnderline: {
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
  },
  underline: {
    height: 1,
    backgroundColor: colors.border,
  },
  inputBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
