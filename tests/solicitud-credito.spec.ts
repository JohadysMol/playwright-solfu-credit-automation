import { test, expect } from '@playwright/test';
import path from 'path';
import { SolicitudCreditoPage } from '../pages/SolicitudCreditoPage';
import { SOLICITANTES_TEST_DATA } from '../data/solicitantes.data';

test.describe('Solfu - Suite Completa QA Senior (Humo, Funcional, Negativas y Valores Límite)', () => {
  let solicitudPage: SolicitudCreditoPage;
  const archivoPdfPrueba = path.join(__dirname, '../fixtures/documento-prueba.pdf');

  test.beforeEach(async ({ page }) => {
    solicitudPage = new SolicitudCreditoPage(page);
    await solicitudPage.navegarEIniciarSolicitud();
  });

  // 1. PRUEBA DE HUMO (SMOKE TESTING)
  test('CP-01 [@smoke]: Verificar disponibilidad del portal, renderizado del Paso 1 y regla de edad máxima', async () => {
    await expect(solicitudPage.selectTipoCliente).toBeVisible();
    await expect(solicitudPage.inputIdentificacion).toBeVisible();
    
    const maxFecha = await solicitudPage.inputFechaNacimiento.getAttribute('max');
    expect(maxFecha).not.toBeNull();
  });

  // 2. PRUEBA FUNCIONAL / FLUJO FELIZ (HAPPY PATH) CON CONVENIO LIBRANZA
  test('CP-02 [@functional]: Completar flujo E2E de 5 pasos con empresa de convenio libranza y 6 documentos', async () => {
    await solicitudPage.page.route('**/controller**', async (route) => {
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

  // 3. ANÁLISIS DE VALORES LÍMITE (BVA) + EMPRESA SIN CONVENIO + CAMPO CONDICIONAL "OTRA, CUAL?"
  test('CP-03 [@functional @boundary]: Validar edad límite (18 años exactos), empresa libre sin convenio y "Otro medio"', async () => {
    await solicitudPage.completarPaso1InformacionBasica(SOLICITANTES_TEST_DATA.clienteValorLimite18Anos);
    await solicitudPage.completarPaso2Contacto(SOLICITANTES_TEST_DATA.clienteValorLimite18Anos);
    await solicitudPage.completarPaso3Laboral(SOLICITANTES_TEST_DATA.clienteValorLimite18Anos);
    await solicitudPage.completarPaso4Documentos(archivoPdfPrueba);
    await solicitudPage.validarLlegadaAPaso5Confirmacion();
  });

  // 4. REGLAS CONDICIONALES DE INTERFAZ PARA ROL "CODEUDOR"
  test('CP-04 [@functional]: Validar que rol "CODEUDOR" habilita búsqueda de solicitante y oculta código de embajador', async () => {
    // Verificar primero que en rol SOLICITANTE el código de embajador sí es visible
    await solicitudPage.selectTipoCliente.selectOption('SOLICITANTE');
    await expect(solicitudPage.inputCodigoEmbajador).toBeVisible();

    // Cambiar a CODEUDOR y disparar el evento 'change' nativo del navegador
    await solicitudPage.selectTipoCliente.selectOption('CODEUDOR');
    await solicitudPage.selectTipoCliente.dispatchEvent('change');

    // Confirmar la regla de negocio: el campo de código de embajador se oculta al elegir CODEUDOR
    await expect(solicitudPage.inputCodigoEmbajador).not.toBeVisible();
  });


  // 5. PRUEBA NEGATIVA DE CUMPLIMIENTO LEGAL (SARLAFT / HABEAS DATA)
  test('CP-05 [@negative]: Bloquear envío final si no se marca la declaración SARLAFT ni Habeas Data', async () => {
    let peticionEnvioDisparada = false;

    await solicitudPage.page.route('**/controller**', async (route) => {
      if (route.request().method() === 'POST') {
        peticionEnvioDisparada = true;
        await route.abort();
      } else {
        await route.continue();
      }
    });

    const datos = SOLICITANTES_TEST_DATA.clienteValido;
    await solicitudPage.selectTipoCliente.selectOption(datos.tipoCliente);
    await solicitudPage.selectMedioConocimiento.selectOption(datos.medioConocimiento);
    await solicitudPage.page.getByText(datos.tipoDocumento, { exact: false }).click();
    await solicitudPage.inputIdentificacion.fill(datos.identificacion);
    await solicitudPage.inputPrimerNombre.fill(datos.primerNombre);
    await solicitudPage.inputPrimerApellido.fill(datos.primerApellido);
    await solicitudPage.inputEmail.fill(datos.email);
    await solicitudPage.inputContacto.fill(datos.contacto);
    await solicitudPage.inputWhatsapp.fill(datos.whatsapp);
    // Se omiten intencionalmente ambos checkboxes legales
    await solicitudPage.btnContinuar.first().click();

    await solicitudPage.completarPaso2Contacto(datos);
    await solicitudPage.completarPaso3Laboral(datos);
    await solicitudPage.completarPaso4Documentos(archivoPdfPrueba);

    await solicitudPage.btnEnviarFinal.click();
    expect(peticionEnvioDisparada).toBe(false);
  });

  // 6. PRUEBAS PARAMETRIZADAS: PARTICIÓN DE EQUIVALENCIA (DATA-DRIVEN)
  for (const escenario of SOLICITANTES_TEST_DATA.casosInvalidos) {
    test(`CP-06 [@negative]: Bloquear envío ante -> ${escenario.nombreCaso}`, async () => {
      let peticionEnvioDisparada = false;

      await solicitudPage.page.route('**/controller**', async (route) => {
        if (route.request().method() === 'POST') {
          peticionEnvioDisparada = true;
          await route.abort();
        } else {
          await route.continue();
        }
      });

      const datosPrueba = {
        ...SOLICITANTES_TEST_DATA.clienteValido,
        [escenario.campoAlterado]: escenario.valorInvalido
      };

      await solicitudPage.completarPaso1InformacionBasica(datosPrueba);
      await solicitudPage.completarPaso2Contacto(datosPrueba);
      await solicitudPage.completarPaso3Laboral(datosPrueba);
      await solicitudPage.completarPaso4Documentos(archivoPdfPrueba);

      await solicitudPage.btnEnviarFinal.click();
      expect(peticionEnvioDisparada).toBe(false);
    });
  }
});
