import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

/**
 * Subscribes to the OS color scheme without the hydration-mismatch flash static web
 * rendering would otherwise cause (server always has no scheme, client does).
 */
export function useColorScheme() {
  return useSyncExternalStore(
    (onChange) => {
      const subscription = Appearance.addChangeListener(onChange);
      return () => subscription.remove();
    },
    () => Appearance.getColorScheme() ?? 'light',
    () => 'light',
  );
}
