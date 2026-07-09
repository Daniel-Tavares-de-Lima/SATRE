import { create } from 'zustand';

export type FontScale = 'normal' | 'large';

interface SettingsState {
  fontScale: FontScale;
  accessibleEmergenciesOnly: boolean;
  neutralColors: boolean;
  setFontScale: (scale: FontScale) => void;
  setAccessibleEmergenciesOnly: (value: boolean) => void;
  setNeutralColors: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  fontScale: 'normal',
  accessibleEmergenciesOnly: false,
  neutralColors: false,
  setFontScale: (fontScale) => set({ fontScale }),
  setAccessibleEmergenciesOnly: (accessibleEmergenciesOnly) => set({ accessibleEmergenciesOnly }),
  setNeutralColors: (neutralColors) => set({ neutralColors }),
}));
