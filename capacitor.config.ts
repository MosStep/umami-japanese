import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.umami.japanese',
  appName: 'うまみ',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_umami',
      iconColor: '#A855F7',
    },
    CapacitorUpdater: {
      autoUpdate: false,
      appReadyTimeout: 10000,
      autoDeleteFailed: true,
      autoDeletePrevious: true,
      resetWhenUpdate: true,
    },
  },
};

export default config;
