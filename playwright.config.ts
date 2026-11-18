import { defineConfig, devices } from '@playwright/test';

// Lee directamente el perfil seleccionado en el menú desplegable de GitHub Actions
const esCertificacion = process.env.PERFIL_QA === 'certificacion_con_evidencia';

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
