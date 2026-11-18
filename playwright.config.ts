import { defineConfig, devices } from '@playwright/test';

// Detecta si ejecutamos en modo certificación (con evidencia completa) o modo rápido (solo en fallos)
const esCertificacion = process.env.MODO_CERTIFICACION === 'true';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://solucionfuturo.com',
    trace: esCertificacion ? 'on' : 'on-first-retry',
    screenshot: esCertificacion ? 'on' : 'only-on-failure',
    video: esCertificacion ? 'on' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
