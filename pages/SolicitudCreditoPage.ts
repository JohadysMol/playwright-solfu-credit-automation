import { Page, Locator, expect } from '@playwright/test';

export class SolicitudCreditoPage {
  page: Page;

  // Pantalla Inicial y Redirección Cloud
  readonly btnSolicitarAhoraHome: Locator;

  // Paso 1: Información Básica
  selectTipoCliente!: Locator;
  selectMedioConocimiento!: Locator;
  inputCodigoEmbajador!: Locator;
  inputIdentificacion!: Locator;
  inputPrimerNombre!: Locator;
  inputSegundoNombre!: Locator;
  inputPrimerApellido!: Locator;
  inputSegundoApellido!: Locator;
  inputEmail!: Locator;
  inputContacto!: Locator;
  inputWhatsapp!: Locator;
  checkPoliticaDatos!: Locator;
  checkDeclaracionSarlaft!: Locator;

  // Paso 2: Información de Contacto
  inputDireccion!: Locator;
  selectDepartamento!: Locator;
  inputCiudad!: Locator;
  inputFechaNacimiento!: Locator;

  // Paso 3: Información Laboral
  inputNombreEmpresa!: Locator;
  selectTipoContrato!: Locator;

  // Paso 4: Adjuntar Documentos (6 archivos obligatorios)
  fileInputs!: Locator;

  // Paso 5: Confirmación
  btnEnviarFinal!: Locator;

  // Botón común de avance entre pasos
  btnContinuar!: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btnSolicitarAhoraHome = page.getByRole('link', { name: /Solicitar Ahora/i }).or(page.getByText(/Solicitar Ahora/i)).first();
    this.inicializarSelectores(page);
  }

  private inicializarSelectores(currentPage: Page) {
    this.page = currentPage;

    // Selectores Paso 1
    this.selectTipoCliente = currentPage.locator('#tipo_cliente');
    this.selectMedioConocimiento = currentPage.locator('#medio_conocimiento');
    this.inputCodigoEmbajador = currentPage.getByPlaceholder('Ingresa el código');
    this.inputIdentificacion = currentPage.locator('#identificacion');
    this.inputPrimerNombre = currentPage.locator('#primer_nombre');
    this.inputSegundoNombre = currentPage.locator('#segundo_nombre');
    this.inputPrimerApellido = currentPage.locator('#primer_apellido');
    this.inputSegundoApellido = currentPage.locator('#segundo_apellido');
    this.inputEmail = currentPage.locator('#email');
    this.inputContacto = currentPage.locator('#contacto');
    this.inputWhatsapp = currentPage.locator('#numero_whatsapp');
    this.checkPoliticaDatos = currentPage.getByRole('checkbox', { name: /Declaro que he leído y aceptado/i });
    this.checkDeclaracionSarlaft = currentPage.getByRole('checkbox', { name: /Declaro bajo la gravedad de juramento/i });

    // Selectores Paso 2
    this.inputDireccion = currentPage.getByPlaceholder('Escriba su dirección');
    this.selectDepartamento = currentPage.locator('#departamento_residencia');
    this.inputCiudad = currentPage.getByPlaceholder('Escriba su ciudad de residencia');
    this.inputFechaNacimiento = currentPage.locator('#fecha_nacimiento');

    // Selectores Paso 3
    this.inputNombreEmpresa = currentPage.locator('#nombre_empresa');
    this.selectTipoContrato = currentPage.locator('#tipo_contrato');

    // Selectores Paso 4 (6 inputs de archivo)
    this.fileInputs = currentPage.locator('input[type="file"]');

    // Selector Paso 5
    this.btnEnviarFinal = currentPage.getByRole('button', { name: /Enviar/i });

    // Botón Continuar (Pasos 1 al 4)
    this.btnContinuar = currentPage.getByRole('button', { name: /Continuar/i });
  }

  async navegarEIniciarSolicitud() {
    await this.page.goto('https://solucionfuturo.com', { waitUntil: 'networkidle' });

    // 1. Clic en "Solicitar Ahora ->" y esperar posible apertura de pestaña nueva
    await expect(this.btnSolicitarAhoraHome).toBeVisible({ timeout: 15000 });
    
    const [nuevaPestana] = await Promise.all([
      this.page.context().waitForEvent('page', { timeout: 8000 }).catch(() => null),
      this.btnSolicitarAhoraHome.click()
    ]);

    // Verificar si se abrió una nueva pestaña directamente o quedó en el contexto
    const paginasAbiertas = this.page.context().pages();
    const pestanaActiva = nuevaPestana || paginasAbiertas[paginasAbiertas.length - 1];

    await pestanaActiva.waitForLoadState('networkidle');
    this.inicializarSelectores(pestanaActiva);

    // 2. Clic exacto en el botón "Solicitar Credito"
    const btnSolicitarCredito = this.page.getByRole('button', { name: /Solicitar Credito/i });
    await expect(btnSolicitarCredito).toBeVisible({ timeout: 20000 });
    await btnSolicitarCredito.click();
  }


  async completarPaso1InformacionBasica(datos: any) {
    await expect(this.selectTipoCliente).toBeVisible({ timeout: 10000 });
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
