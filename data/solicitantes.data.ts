export const SOLICITANTES_TEST_DATA = {
  clienteValido: {
    tipoDocumento: 'Cédula de Ciudadanía',
    numeroDocumento: '1045789123',
    primerNombre: 'Carlos',
    primerApellido: 'Mendoza',
    celular: '3001234567',
    correo: 'qa.automation.test@ejemplo.com',
    montoSolicitado: '1500000'
  },
  datosInvalidos: {
    documentoCorto: '123',
    celularInvalido: '111111',
    correoSinFormato: 'usuario-sin-arroba.com'
  }
};
