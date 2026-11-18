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

  test('CP-01: Validar que el sistema impide el envío final en Paso 5 si hay campos obligatorios vacíos (Negativa)', async ({ page }) => {
    let peticionEnvioDisparada = false;

    // Monitorear si el navegador intenta enviar datos al servidor
    await page.route('**/controller**', async (route) => {
      if (route.request().method() === 'POST') {
        peticionEnvioDisparada = true;
        await route.abort();
      } else {
        await route.continue();
      }
    });

    // Avanzar por los 4 pasos haciendo clic en el botón "Continuar" visible en cada pantalla
    const btnContinuarVisible = page.locator('button:visible', { hasText: /Continuar/i }).first();
    
    for (let paso = 1; paso <= 4; paso++) {
      await btnContinuarVisible.click();
    }

    // En el Paso 5, intentar presionar el botón final "Enviar"
    await expect(solicitudPage.btnEnviarFinal).toBeVisible();
    await solicitudPage.btnEnviarFinal.click();

    // Verificar que el navegador bloqueó el envío por validaciones HTML5 (required) y no se disparó ningún POST
    expect(peticionEnvioDisparada).toBe(false);
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
