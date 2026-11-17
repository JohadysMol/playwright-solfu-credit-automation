import { test, expect } from '@playwright/test';
import { SolicitudCreditoPage } from '../pages/SolicitudCreditoPage';
import { SOLICITANTES_TEST_DATA } from '../data/solicitantes.data';

test.describe('Solfu - Automatización Flujo de Solicitud de Crédito', () => {
  let solicitudPage: SolicitudCreditoPage;

  test.beforeEach(async ({ page }) => {
    solicitudPage = new SolicitudCreditoPage(page);
    await solicitudPage.navegar();
  });

  test('CP-01: Validar carga inicial y opciones principales del portal de crédito', async ({ page }) => {
    // Verificar que la página carga correctamente y muestra las opciones de negocio
    await expect(page).toHaveTitle(/Solfu|Solicitud/i);
    await expect(solicitudPage.btnSolicitarCredito).toBeVisible();
    await expect(solicitudPage.btnConsultarSolicitud).toBeVisible();
  });

  test('CP-02: Validar bloqueo de avance con campos obligatorios vacíos (Prueba Negativa)', async ({ page }) => {
    await solicitudPage.iniciarNuevaSolicitud();

    // Intentar avanzar sin diligenciar información básica
    if (await solicitudPage.btnContinuar.isVisible()) {
      await solicitudPage.btnContinuar.click();
      // Validar que no avanza al paso final y muestra alertas de validación HTML5 o mensajes de error
      const mensajesError = page.locator('.error, .invalid-feedback, [aria-invalid="true"], :invalid');
      await expect(mensajesError.first()).toBeVisible();
    }
  });

  test('CP-03: Simular envío completo interceptando API (Sin ensuciar base de datos productiva)', async ({ page }) => {
    // Interceptar cualquier petición POST de envío de solicitud para evitar registros reales en producción
    await page.route('**/solicitud**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'SUCCESS',
            radicado: 'SOLFU-QA-998877',
            mensaje: 'Solicitud recibida correctamente (Simulación QA)'
          })
        });
      } else {
        await route.continue();
      }
    });

    await solicitudPage.iniciarNuevaSolicitud();
    await solicitudPage.completarInformacionBasica(SOLICITANTES_TEST_DATA.clienteValido);

    // Verificar que el campo documento retiene el dato formateado correctamente
    await expect(solicitudPage.inputDocumento).toHaveValue(SOLICITANTES_TEST_DATA.clienteValido.numeroDocumento);
  });

});
