# Playwright Automation Suite: Flujo de Solicitud de Crédito (Solfu)

Proyecto de automatización End-to-End (E2E) construido con **Playwright + TypeScript** aplicando el patrón de diseño **Page Object Model (POM)** sobre el portal de originación digital de crédito de [Solfu (Solución Futuro)](https://www.solucionfuturo.com/solicitud-de-credito/).

## Enfoque de Calidad y Seguridad en Producción
Dado que se trata de un entorno real de crédito de libranza y adelanto de nómina:
1. **Validaciones Front-End:** Se verifican reglas de obligatoriedad, formatos de documento/celular y navegación entre pasos (*Paso 1: Información Básica* -> *Paso 2: Información de Contacto*).
2. **Aislamiento de Producción (Network Mocking):** Las pruebas de envío final interceptan la petición HTTP (`page.route`) para simular respuestas exitosas o errores del core financiero **sin registrar solicitudes ficticias en la base de datos real**.

## Estructura del Framework
- `pages/SolicitudCreditoPage.ts`: Encapsula localizadores resilientes y acciones del flujo.
- `data/solicitantes.data.ts`: Set de datos de prueba parametrizados (casos positivos, negativos y borde).
- `tests/solicitud-credito.spec.ts`: Casos de prueba automatizados con aserciones explícitas.
