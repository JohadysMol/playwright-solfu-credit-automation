import { Page, Locator, expect } from '@playwright/test';

export class SolicitudCreditoPage {
  readonly page: Page;
  readonly btnSolicitarCredito: Locator;
  readonly btnConsultarSolicitud: Locator;
  readonly inputDocumento: Locator;
  readonly inputNombres: Locator;
  readonly inputApellidos: Locator;
  readonly inputCelular: Locator;
  readonly inputCorreo: Locator;
  readonly checkAutorizacionDatos: Locator;
  readonly btnContinuar: Locator;

  constructor(page: Page) {
    this.page = page;
    // Selección inicial de flujo en el portal
    this.btnSolicitarCredito = page.getByRole('button', { name: /Solicitar Cr[eé]dito/i }).or(page.getByText(/Solicitar Cr[eé]dito/i));
    this.btnConsultarSolicitud = page.getByRole('button', { name: /Consultar Solicitud/i }).or(page.getByText(/Consultar Solicitud/i));
    
    // Campos principales del formulario (Localizadores resilientes por etiqueta/placeholder)
    this.inputDocumento = page.getByLabel(/documento|c[eé]dula/i).or(page.locator('input[name*="doc"], input[id*="doc"]')).first();
    this.inputNombres = page.getByLabel(/nombre/i).or(page.locator('input[name*="nombre"], input[id*="nombre"]')).first();
    this.inputApellidos = page.getByLabel(/apellido/i).or(page.locator('input[name*="apellido"], input[id*="apellido"]')).first();
    this.inputCelular = page.getByLabel(/celular|tel[eé]fono/i).or(page.locator('input[name*="cel"], input[type="tel"]')).first();
    this.inputCorreo = page.getByLabel(/correo|email/i).or(page.locator('input[type="email"]')).first();
    this.checkAutorizacionDatos = page.locator('input[type="checkbox"]').first();
    this.btnContinuar = page.getByRole('button', { name: /Continuar|Siguiente|Enviar/i }).first();
  }

  async navegar() {
    await this.page.goto('https://solucionfuturo.com/solicitud-de-credito/controller?utm_source=portal_solfu&utm_medium=action_solicitud_credito&utm_campaign=linksolicitudcredito', {
      waitUntil: 'networkidle'
    });
  }

  async iniciarNuevaSolicitud() {
    if (await this.btnSolicitarCredito.isVisible()) {
      await this.btnSolicitarCredito.click();
    }
  }

  async completarInformacionBasica(datos: {
    numeroDocumento: string;
    primerNombre: string;
    primerApellido: string;
  }) {
    await this.inputDocumento.fill(datos.numeroDocumento);
    if (await this.inputNombres.isVisible()) {
      await this.inputNombres.fill(datos.primerNombre);
    }
    if (await this.inputApellidos.isVisible()) {
      await this.inputApellidos.fill(datos.primerApellido);
    }
  }
}
