import { create } from 'zustand';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'aivion-theme';

/**
 * Injected as a blocking <script> in the root layout. Must stay
 * dependency-free and synchronous: it sets data-theme on <html> before React
 * hydrates, so the correct palette paints on the first frame with no flash.
 *
 * Preference order: explicit user choice > OS preference > dark (product default).
 */
export const themeInitScript = `(function(){try{
var d=document.documentElement;
var stored=null;
try{stored=localStorage.getItem('${THEME_STORAGE_KEY}');}catch(e){}
var theme=(stored==='light'||stored==='dark')?stored:null;
if(!theme){theme=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
d.setAttribute('data-theme',theme);
d.style.colorScheme=theme;
}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
}

interface ThemeState {
  theme: Theme;
  /** False until the store has synced with the DOM, to avoid hydration mismatches. */
  ready: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  // Matches the SSR default; corrected on mount by initThemeStore.
  theme: 'dark',
  ready: false,

  setTheme: (theme) => {
    set({ theme });
    applyTheme(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage unavailable (private browsing) - the theme still applies for this session.
    }
  },

  toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
}));

/**
 * Syncs the store with the DOM attribute written by themeInitScript, and keeps
 * it aligned with the OS preference while the user has made no explicit choice.
 * Returns a cleanup function. Call from a client component effect.
 */
export function initThemeStore() {
  if (typeof window === 'undefined') return;

  const current = document.documentElement.getAttribute('data-theme');
  useThemeStore.setState({ theme: current === 'light' ? 'light' : 'dark', ready: true });

  const media = window.matchMedia('(prefers-color-scheme: light)');
  const onSystemChange = (event: MediaQueryListEvent) => {
    if (readStoredTheme()) return; // explicit choice wins
    const theme: Theme = event.matches ? 'light' : 'dark';
    useThemeStore.setState({ theme });
    applyTheme(theme);
  };

  media.addEventListener('change', onSystemChange);
  return () => media.removeEventListener('change', onSystemChange);
}