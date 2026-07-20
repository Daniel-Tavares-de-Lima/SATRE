import type { ImageSourcePropType } from 'react-native';
import type { UnitType } from '@satre/shared-types';
import { colors } from '@/constants/theme';

const UNIT_PHOTOS: Record<string, ImageSourcePropType> = {
  'UPA Caxangá (Escritor Paulo Cavalcanti)': require('../assets/units/upa-caxanga.jpg'),
  'UPA Caxangá': require('../assets/units/upa-caxanga.jpg'),
  'UPA Torrões – Dulce Sampaio': require('../assets/units/upa-torroes.jpg'),
  'UPA Torrões': require('../assets/units/upa-torroes.jpg'),
  'UPA Torrões - Dulce Sampaio': require('../assets/units/upa-torroes.jpg'),
  'UPA Barra de Jangada (Senador Wilson Campos)': require('../assets/units/upa-barra-jangada.jpg'),
  'UPA Barra de Jangada': require('../assets/units/upa-barra-jangada.jpg'),
  'UPA Curado (Fernando de Lacerda)': require('../assets/units/upa-curado.jpg'),
  'UPA Curado': require('../assets/units/upa-curado.jpg'),
  'UPA do Curado': require('../assets/units/upa-curado.jpg'),
};

/** Photo for a unit card/hero when available. */
export function unitPhoto(name: string): ImageSourcePropType | null {
  return UNIT_PHOTOS[name] ?? null;
}

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
