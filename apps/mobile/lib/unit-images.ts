import type { UnitType } from '@satre/shared-types';
import { colors } from '@/constants/theme';

/** Placeholder styling for unit thumbnails until real photos are licensed. */
export function unitThumbnailStyle(type: UnitType) {
  return {
    backgroundColor: type === 'private' ? '#E8F5F3' : '#E0F2FE',
    iconColor: type === 'private' ? colors.primaryDark : colors.primary,
    iconName: type === 'private' ? ('business' as const) : ('medkit' as const),
  };
}

/** Private hospitals with low wait get the Figma "Serviço Excelente" badge. */
export function hasExcellentServiceBadge(
  type: UnitType,
  estimatedWaitMinutes: number,
): boolean {
  return type === 'private' && estimatedWaitMinutes <= 7;
}
