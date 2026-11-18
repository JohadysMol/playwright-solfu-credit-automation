import { Page, Locator, expect } from '@playwright/test';

export class SolicitudCreditoPage {
  readonly page: Page;

  // Pantalla Inicial
  readonly btnSolicitarCredito: Locator;

  // Paso 1: Información Básica
  readonly selectTipoCliente: Locator;
  readonly selectMedioConocimiento: Locator;
  readonly inputCodigoEmbajador: Locator;
  readonly inputIdentificacion: Locator;
  readonly inputPrimerNombre: Locator;
  readonly inputSegundoNombre: Locator;
  readonly inputPrimerApellido: Locator;
  readonly inputSegundoApellido: Locator;
  readonly inputEmail: Locator;
  readonly inputContacto: Locator;
  readonly inputWhatsapp: Locator;
  readonly checkPoliticaDatos: Locator;
  readonly checkDeclaracionSarlaft: Locator;

  // Paso 2: Información de Contacto
  readonly inputDireccion: Locator;
  readonly selectDepartamento: Locator;
  readonly inputCiudad: Locator;
  readonly inputFechaNacimiento: Locator;

  // Paso 3: Información Laboral
  readonly inputNombreEmpresa: Locator;
  readonly selectTipoContrato: Locator;

  // Paso 4: Adjuntar Documentos (6 archivos obligatorios)
  readonly fileInputs: Locator;

  // Paso 5: Confirmación
  readonly btnEnviarFinal: Locator;

  // Botón común de avance entre pasos
  readonly btnContinuar: Locator;

  constructor(page: Page) {
    this.page = page;

    // Pantalla de bienvenida
    this.btnSolicitarCredito = page.getByText('Solicitar Credito', { exact: false });

    // Selectores Paso 1
    this.selectTipoCliente = page.locator('#tipo_cliente');
    this.selectMedioConocimiento = page.locator('#medio_conocimiento');
    this.inputCodigoEmbajador = page.getByPlaceholder('Ingresa el código');
    this.inputIdentificacion = page.locator('#identificacion');
    this.inputPrimerNombre = page.locator('#primer_nombre');
    this.inputSegundoNombre = page.locator('#segundo_nombre');
    this.inputPrimerApellido = page.locator('#primer_apellido');
    this.inputSegundoApellido = page.locator('#segundo_apellido');
    this.inputEmail = page.locator('#email');
    this.inputContacto = page.locator('#contacto');
    this.inputWhatsapp = page.locator('#numero_whatsapp');
    this.checkPoliticaDatos = page.getByRole('checkbox', { name: /Declaro que he leído y aceptado/i });
    this.checkDeclaracionSarlaft = page.getByRole('checkbox', { name: /Declaro bajo la gravedad de juramento/i });

    // Selectores Paso 2
    this.inputDireccion = page.getByPlaceholder('Escriba su dirección');
    this.selectDepartamento = page.locator('#departamento_residencia');
    this.inputCiudad = page.getByPlaceholder('Escriba su ciudad de residencia');
    this.inputFechaNacimiento = page.locator('#fecha_nacimiento');

    // Selectores Paso 3
    this.inputNombreEmpresa = page.locator('#nombre_empresa');
    this.selectTipoContrato = page.locator('#tipo_contrato');

    // Selectores Paso 4 (6 inputs de archivo)
    this.fileInputs = page.locator('input[type="file"]');

    // Selector Paso 5
    this.btnEnviarFinal = page.getByRole('button', { name: /Enviar/i });

    // Botón Continuar (Pasos 1 al 4)
    this.btnContinuar = page.getByRole('button', { name: /Continuar/i });
  }

  async navegarEIniciarSolicitud() {
    await this.page.goto(
      'https://solucionfuturo.com',
      { waitUntil: 'networkidle' }
    );
    // Clic en el botón inicial "Solicitar Credito" si está visible
    if (await this.btnSolicitarCredito.isVisible()) {
      await this.btnSolicitarCredito.click();
    }
  }

  async completarPaso1InformacionBasica(datos: any) {
    await expect(this.selectTipoCliente).toBeVisible();
    await this.selectTipoCliente.selectOption(datos.tipoCliente);
    await this.selectMedioConocimiento.selectOption(datos.medioConocimiento);

    if (datos.codigoEmbajador) {
      await this.inputCodigoEmbajador.fill(datos.codigoEmbajador);
    }

    await this.page.getByText(datos.tipoDocumento, { exact: false }).click();

    await this.inputIdentificacion.fill(datos.identificacion);
    await this.inputPrimerNombre.fill(datos.primerNombre);
    await this.inputSegundoNombre.fill(datos.segundoNombre);
    await this.inputPrimerApellido.fill(datos.primerApellido);
    await this.inputSegundoApellido.fill(datos.segundoApellido);
    await this.inputEmail.fill(datos.email);
    await this.inputContacto.fill(datos.contacto);
    await this.inputWhatsapp.fill(datos.whatsapp);

    await this.checkPoliticaDatos.check();
    await this.checkDeclaracionSarlaft.check();
    await this.btnContinuar.click();
  }

  async completarPaso2Contacto(datos: any) {
    await expect(this.inputDireccion).toBeVisible();
    await this.inputDireccion.fill(datos.direccion);
    await this.selectDepartamento.selectOption(datos.departamento);
    await this.inputCiudad.fill(datos.ciudad);
    await this.inputFechaNacimiento.fill(datos.fechaNacimiento);
    await this.btnContinuar.click();
  }

  async completarPaso3Laboral(datos: any) {
    await expect(this.inputNombreEmpresa).toBeVisible();
    await this.inputNombreEmpresa.fill(datos.nombreEmpresa);
    await this.selectTipoContrato.selectOption(datos.tipoContrato);
    await this.btnContinuar.click();
  }

  async completarPaso4Documentos(rutaArchivoPdf: string) {
    await expect(this.page.getByText('Adjunta tu cédula (Frente)')).toBeVisible();
    // Carga automáticamente el PDF de prueba en los 6 campos (Frente, Reverso, Cert. Bancaria, Carta Laboral, Desprendibles 1 y 2)
    const totalAdjuntos = await this.fileInputs.count();
    for (let i = 0; i < totalAdjuntos; i++) {
      await this.fileInputs.nth(i).setInputFiles(rutaArchivoPdf);
    }
    await this.btnContinuar.click();
  }

  async validarLlegadaAPaso5Confirmacion() {
    await expect(this.page.getByText('Por favor, revisa toda la información antes de enviar el formulario.')).toBeVisible();
    await expect(this.btnEnviarFinal).toBeVisible();
  }
}
