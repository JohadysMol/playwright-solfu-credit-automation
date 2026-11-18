import { test, expect } from '@playwright/test';
import path from 'path';
import { SolicitudCreditoPage } from '../pages/SolicitudCreditoPage';
import { SOLICITANTES_TEST_DATA } from '../data/solicitantes.data';

test.describe('Solfu - Automatización E2E Solicitud de Crédito Multipaso', () => {
  let solicitudPage: SolicitudCreditoPage;
  const archivoPdfPrueba = path.join(__dirname, '../fixtures/documento-prueba.pdf');

  test.beforeEach(async ({ page }) => {
    solicitudPage = new SolicitudCreditoPage(page);
    await solicitudPage.navegar();
  });

  test('CP-01: Validar bloqueo de avance si no se completan datos obligatorios del Paso 1 (Negativa)', async () => {
    await solicitudPage.btnContinuar.click();
    await expect(solicitudPage.selectTipoCliente).toBeVisible();
  });

  test('CP-02: Completar flujo completo de 4 pasos y carga de 5 documentos (Con aislamiento de producción)', async ({ page }) => {
    // Interceptar peticiones POST para evitar registrar datos ficticios en producción
    await page.route('**/controller**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'OK', radicado: 'SIMULACION-QA-2026' })
        });
      } else {
        await route.continue();
      }
    });

    await solicitudPage.completarPaso1InformacionBasica(SOLICITANTES_TEST_DATA.clienteValido);
    await solicitudPage.completarPaso2Contacto(SOLICITANTES_TEST_DATA.clienteValido);
    await solicitudPage.completarPaso3Laboral(SOLICITANTES_TEST_DATA.clienteValido);
    await solicitudPage.completarPaso4Documentos(archivoPdfPrueba);

    await expect(solicitudPage.btnContinuar).toBeEnabled();
  });
});
