import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'localNotificationsDemo',
  webDir: 'www',
  bundledWebRuntime: false,

  plugins: {
    "LocalNotifications": {
      "iconColor": "#488AFF"
    }
  }
  
};

export default config;
