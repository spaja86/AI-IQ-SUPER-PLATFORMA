interface LocalCapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime: boolean;
  server?: {
    androidScheme?: string;
  };
}

const config: LocalCapacitorConfig = {
  appId: 'rs.spaja.wallet',
  appName: 'Spaja Poslovni Novcanik',
  webDir: '../../.next',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
