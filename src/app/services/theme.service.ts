import { Injectable, signal, computed, effect } from '@angular/core';

export type ColorTheme =
  | 'blue'
  | 'green'
  | 'purple'
  | 'red'
  | 'orange'
  | 'teal'
  | 'pink'
  | 'indigo';

export interface ThemeOption {
  value: ColorTheme;
  label: string;
  color: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'ngx-chronica-theme';

  // Available theme options with their display colors
  public readonly themeOptions: readonly ThemeOption[] = [
    { value: 'blue', label: 'Blue', color: '#3b82f6', description: 'Classic blue theme' },
    { value: 'green', label: 'Green', color: '#10b981', description: 'Nature-inspired green' },
    { value: 'purple', label: 'Purple', color: '#8b5cf6', description: 'Royal purple theme' },
    { value: 'red', label: 'Red', color: '#ef4444', description: 'Bold red theme' },
    { value: 'orange', label: 'Orange', color: '#f97316', description: 'Warm orange theme' },
    { value: 'teal', label: 'Teal', color: '#14b8a6', description: 'Cool teal theme' },
    { value: 'pink', label: 'Pink', color: '#ec4899', description: 'Vibrant pink theme' },
    { value: 'indigo', label: 'Indigo', color: '#6366f1', description: 'Deep indigo theme' },
  ] as const;

  // Current selected theme (reactive signal)
  private readonly _currentTheme = signal<ColorTheme>(this.loadSavedTheme());

  // Public readonly signal for current theme
  public readonly currentTheme = this._currentTheme.asReadonly();

  // Computed signal for current theme option details
  public readonly currentThemeOption = computed(
    () =>
      this.themeOptions.find((option) => option.value === this._currentTheme()) ||
      this.themeOptions[0]
  );

  constructor() {
    // Effect to persist theme changes to localStorage
    effect(() => {
      const theme = this._currentTheme();
      try {
        localStorage.setItem(this.STORAGE_KEY, theme);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    });
  }

  /**
   * Set the current color theme
   */
  public setTheme(theme: ColorTheme): void {
    if (this.themeOptions.some((option) => option.value === theme)) {
      this._currentTheme.set(theme);
    } else {
      console.warn(`Invalid theme: ${theme}. Falling back to blue.`);
      this._currentTheme.set('blue');
    }
  }

  /**
   * Get the current theme value
   */
  public getCurrentTheme(): ColorTheme {
    return this._currentTheme();
  }

  /**
   * Get theme option by value
   */
  public getThemeOption(theme: ColorTheme): ThemeOption | undefined {
    return this.themeOptions.find((option) => option.value === theme);
  }

  /**
   * Load saved theme from localStorage with fallback
   */
  private loadSavedTheme(): ColorTheme {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved && this.themeOptions.some((option) => option.value === saved)) {
        return saved as ColorTheme;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }

    // Fallback to default theme
    return 'blue';
  }

  /**
   * Reset theme to default
   */
  public resetTheme(): void {
    this.setTheme('blue');
  }
}
