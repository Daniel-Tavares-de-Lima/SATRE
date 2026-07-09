import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

interface SearchBarProps extends TextInputProps {
  /** Defaults to "Pesquisar" per Figma. */
  placeholder?: string;
}

export function SearchBar({
  placeholder = 'Pesquisar',
  style,
  accessibilityLabel = 'Pesquisar',
  ...inputProps
}: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <Ionicons name="search" size={20} color={colors.textMuted} style={styles.icon} />
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={accessibilityLabel}
        returnKeyType="search"
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
});
