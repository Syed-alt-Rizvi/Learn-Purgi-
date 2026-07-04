import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.purgi.dictionary',
  appName: 'Kargil Purgi Dictionary & AI Tutor',
  webDir: 'dist',
  server: {
    // Standard secure scheme for on-device assets
    androidScheme: 'https',
    
    // OPTIONAL: If you want the mobile app to load directly from your live hosted URL,
    // uncomment the line below and replace it with your hosted domain:
    // url: 'https://ais-pre-yn3xnios343hveccptb4ag-1063163461455.asia-southeast1.run.app',
    // cleartext: true
  }
};

export default config;
