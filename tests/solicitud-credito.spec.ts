import { test, expect } from '@playwright/test';
import path from 'path';
import { SolicitudCreditoPage } from '../pages/SolicitudCreditoPage';
import { SOLICITANTES_TEST_DATA } from '../data/solicitantes.data';

test.describe('Solfu - Automatización E2E Solicitud de Crédito (5 Pasos)', () => {
  let solicitudPage: SolicitudCreditoPage;
  const archivoPdfPrueba = path.join(__dirname, '../fixtures/documento-prueba.pdf');

  test.beforeEach(async ({ page }) => {
    solicitudPage = new SolicitudCreditoPage(page);
    await solicitudPage.navegarEIniciarSolicitud();
  });

  test('CP-01: Validar bloqueo de avance en Paso 1 si no se completan campos obligatorios (Negativa)', async () => {
    // Hacer clic en el botón visible "Continuar" del Paso 1 sin llenar datos
    await solicitudPage.btnContinuar.first().click();

    // Verificar que el sistema bloquea el avance: el campo del Paso 2 ("Escriba su dirección") NO debe ser visible
    await expect(solicitudPage.inputDireccion).not.toBeVisible();
  });

  test('CP-02: Completar flujo E2E de los 5 pasos y 6 documentos hasta pantalla de Confirmación', async ({ page }) => {
    // Bloquear cualquier petición POST de envío final por seguridad en producción
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
    await solicitudPage.validarLlegadaAPaso5Confirmacion();
  });
});
