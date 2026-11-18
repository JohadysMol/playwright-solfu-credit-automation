export const SOLICITANTES_TEST_DATA = {
  // Caso Positivo 1: Solicitante estándar con empresa de convenio libranza
  clienteValido: {
    tipoCliente: 'SOLICITANTE',
    medioConocimiento: 'Redes Sociales',
    especificarOtroMedio: '',
    codigoEmbajador: '',
    tipoDocumento: 'Cédula de ciudadanía',
    identificacion: '1045789123',
    primerNombre: 'Carlos',
    segundoNombre: 'Andres',
    primerApellido: 'Mendoza',
    segundoApellido: 'Ruiz',
    email: 'qa.automation.solfu@ejemplo.com',
    contacto: '3001234567',
    whatsapp: '3001234567',
    direccion: 'Calle 72 # 45 - 12',
    departamento: 'Atlántico',
    ciudad: 'Barranquilla',
    fechaNacimiento: '1990-05-15',
    busquedaEmpresa: 'SANITAS',
    empresaConvenioExacta: 'SANITAS S.A.S - CONVENIO LIBRANZA',
    tipoContrato: 'Termino Indefinido'
  },

  // Caso Positivo 2: Valor Límite (18 años exactos) + Medio "Otra, cual?" + Empresa sin convenio (texto libre válido)
  clienteValorLimite18Anos: {
    tipoCliente: 'SOLICITANTE CODEUDOR',
    medioConocimiento: 'Otra, cual?',
    especificarOtroMedio: 'Pauta en emisora local',
    codigoEmbajador: 'EMB2026',
    tipoDocumento: 'Cédula de extranjeria',
    identificacion: '987654321',
    primerNombre: 'Laura',
    segundoNombre: '',
    primerApellido: 'Gomez',
    segundoApellido: 'Perez',
    email: 'laura.bva@ejemplo.com',
    contacto: '3109876543',
    whatsapp: '3109876543',
    direccion: 'Carrera 43A # 10 - 20',
    departamento: 'Antioquia',
    ciudad: 'Medellín',
    fechaNacimiento: '2008-11-18', // Valor límite exacto (18 años hoy)
    busquedaEmpresa: 'Inversiones Independientes del Caribe SAS', // Empresa sin convenio: texto libre permitido
    empresaConvenioExacta: '', // No selecciona del desplegable, deja el texto libre
    tipoContrato: 'Termino Fijo'
  },

  // Escenarios para Pruebas Negativas y Partición de Equivalencia (Data-Driven)
  casosInvalidos: [
    {
      nombreCaso: 'Cédula con formato inválido (letras y corta)',
      campoAlterado: 'identificacion',
      valorInvalido: 'ABC12'
    },
    {
      nombreCaso: 'Correo electrónico sin formato válido (sin @)',
      campoAlterado: 'email',
      valorInvalido: '://arroba.com'
    },
    {
      nombreCaso: 'Número de celular incompleto (menos de 10 dígitos)',
      campoAlterado: 'contacto',
      valorInvalido: '30012'
    }
  ]
};
