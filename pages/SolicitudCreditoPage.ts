import { Page, Locator, expect } from '@playwright/test';

export class SolicitudCreditoPage {
  readonly page: Page;

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

  // Paso 2: Información de Contacto / Ubicación
  readonly inputDireccion: Locator;
  readonly selectDepartamento: Locator;
  readonly inputCiudad: Locator;
  readonly inputFechaNacimiento: Locator;

  // Paso 3: Información Laboral
  readonly inputNombreEmpresa: Locator;
  readonly selectTipoContrato: Locator;

  // Paso 4: Adjuntar Documentos (5 archivos)
  readonly fileInputs: Locator;

  // Botón común de avance
  readonly btnContinuar: Locator;

  constructor(page: Page) {
    this.page = page;

    // Selectores exactos Paso 1 (según captura de pantalla)
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
    
    // Checkboxes legales al final del Paso 1
    this.checkPoliticaDatos = page.getByRole('checkbox', { name: /Declaro que he leído y aceptado/i });
    this.checkDeclaracionSarlaft = page.getByRole('checkbox', { name: /Declaro bajo la gravedad de juramento/i });

    // Selectores Paso 2
    this.inputDireccion = page.getByRole('textbox', { name: /Escriba su dirección/i });
    this.selectDepartamento = page.locator('#departamento_residencia');
    this.inputCiudad = page.getByRole('textbox', { name: /Escriba su ciudad de/i });
    this.inputFechaNacimiento = page.locator('#fecha_nacimiento');

    // Selectores Paso 3
    this.inputNombreEmpresa = page.locator('#nombre_empresa');
    this.selectTipoContrato = page.locator('#tipo_contrato');

    // Selectores Paso 4
    this.fileInputs = page.locator('input[type="file"]');

    this.btnContinuar = page.getByRole('button', { name: /Continuar/i });
  }

  async navegar() {
    await this.page.goto(
      'https://solucionfuturo.com',
      { waitUntil: 'networkidle' }
    );
  }

  async completarPaso1InformacionBasica(datos: any) {
    // 1. Seleccionar tipo de cliente y medio de conocimiento
    await this.selectTipoCliente.selectOption(datos.tipoCliente);
    await this.selectMedioConocimiento.selectOption(datos.medioConocimiento);

    // 2. Código de embajador (solo si se envía un valor en los datos de prueba)
    if (datos.codigoEmbajador) {
      await this.inputCodigoEmbajador.fill(datos.codigoEmbajador);
    }

    // 3. Seleccionar pestaña/botón de tipo de documento
    await this.page.getByText(datos.tipoDocumento, { exact: false }).click();

    // 4. Llenar campos personales y de contacto
    await this.inputIdentificacion.fill(datos.identificacion);
    await this.inputPrimerNombre.fill(datos.primerNombre);
    await this.inputSegundoNombre.fill(datos.segundoNombre);
    await this.inputPrimerApellido.fill(datos.primerApellido);
    await this.inputSegundoApellido.fill(datos.segundoApellido);
    await this.inputEmail.fill(datos.email);
    await this.inputContacto.fill(datos.contacto);
    await this.inputWhatsapp.fill(datos.whatsapp);

    // 5. Marcar los dos checkboxes legales al final del formulario
    await this.checkPoliticaDatos.check();
    await this.checkDeclaracionSarlaft.check();

    // 6. Avanzar al Paso 2
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
    await expect(this.page.getByText('Adjunta tu cédula (Frente) *')).toBeVisible();
    const totalAdjuntos = await this.fileInputs.count();
    for (let i = 0; i < totalAdjuntos; i++) {
      await this.fileInputs.nth(i).setInputFiles(rutaArchivoPdf);
    }
  }
}
