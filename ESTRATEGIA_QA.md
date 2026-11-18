
Estrategia de Aseguramiento de Calidad y Automatización E2E (Estándar ISTQB)


1. Propósito y Enfoque Metodológico

Este documento define el marco de trabajo aplicado para migrar pruebas funcionales manuales hacia una suite de automatización End-to-End (E2E) mantenible, enfocada en flujos críticos de originación de crédito y servicios financieros. El enfoque parte de una premisa fundamental: primero se define la estrategia, el riesgo de negocio y la cobertura de pruebas; luego se automatiza con propósito.

2. Ciclo de Trabajo de QA Senior (De Manual a Automatizado)

1. Análisis de Riesgo y Negocio (Shift-Left Testing). Identificar los flujos donde un fallo genera impacto financiero, pérdida de clientes o incumplimiento normativo (cálculo de cupos, validaciones legales Habeas Data / SARLAFT, integridad de datos y carga de documentos).
2. Diseño de Casos bajo Técnicas ISTQB. Aplicar Partición de Equivalencia, Análisis de Valores Límite y Tablas de Decisión para diseñar la matriz de pruebas, evitando redundancias y cubriendo caminos felices, alternativos y negativos.
3. Estrategia de Datos de Prueba (Test Data Management). Definir perfiles sintéticos aislados (cliente aprobado, rechazado, menor de edad, formatos inválidos) sin exponer información real de usuarios.
4. Criterios de Selección para Automatización. Priorizar para automatización los escenarios repetitivos de alto impacto (Humo, Flujo Feliz, Regresión crítica y Fronteras), reservando las pruebas exploratorias manuales para cambios visuales recientes o flujos de un solo uso.
5. Arquitectura Mantenible (POM + Data-Driven). Construir los scripts separando localizadores (Pages), conjuntos de datos (Data) y aserciones (Tests), protegiendo los entornos mediante interceptación de red (Network Mocking).
6. Ejecución Continua y Evidencia Auditada (CI/CD). Configurar perfiles de ejecución en la nube (regresión rápida diaria frente a certificación con trazas y capturas) y medir el Retorno de Inversión (ROI) en tiempo ahorrado y defectos prevenidos.

3. Taxonomía de Pruebas Aplicada (Estándar ISTQB)


A. Tipos de Prueba por Objetivo

• Pruebas de Humo (Smoke Testing): Verificaciones rápidas y superficiales que confirman si la aplicación carga y permite navegar por las rutas principales antes de ejecutar pruebas profundas (Ej. apertura del portal, navegación inicial y renderizado del Paso 1).
• Pruebas Funcionales (Functional Testing): Validan que cada campo, botón y regla cumpla con los requisitos del negocio, abarcando el flujo feliz (Happy Path) y los caminos alternativos.
• Pruebas Negativas (Negative Testing): Evalúan el comportamiento del sistema ante datos inválidos, campos obligatorios vacíos o acciones no permitidas, asegurando mensajes de error claros y el bloqueo de peticiones erróneas hacia el servidor.
• Pruebas de Cordura (Sanity Testing): Ejecuciones focalizadas tras una corrección puntual de código para confirmar que el defecto específico quedó resuelto sin correr toda la suite.
• Pruebas de Regresión (Regression Testing): Reejecución automatizada de la suite completa en CI/CD ante cada cambio nuevo para garantizar que las funcionalidades existentes siguen operando sin fallos.

B. Técnicas de Diseño y Estrategia de Datos

• Partición de Equivalencia (Equivalence Partitioning): División de los datos de entrada en clases válidas e inválidas para optimizar la cobertura sin combinaciones redundantes (Ej. correo sin @, correo sin dominio y correo válido).
• Análisis de Valores Límite (Boundary Value Analysis - BVA): Evaluación de los bordes exactos de una regla de negocio (Ej. validación de mayoría de edad: 17 años y 364 días frente a 18 años exactos).
• Pruebas Parametrizadas (Data-Driven Testing): Separación de los datos de prueba en archivos externos (data/solicitantes.data.ts) para que el motor de automatización recorra múltiples escenarios negativos y de frontera reutilizando un mismo flujo de código.

4. Indicadores de Eficiencia y ROI (Manual vs. Automatizado)


Métrica	Ejecución Manual	Ejecución Automatizada (CI/CD)	Impacto / ROI
Tiempo por ciclo completo (1 flujo)	8 – 12 minutos	12 – 15 segundos	-97% en tiempo de ejecución
Regresión de 15 escenarios críticos	~2.5 – 3 horas	~3.5 minutos (ejecución paralela)	Ahorro de ~2.8 horas por despliegue
Generación de evidencia auditada	Manual (+15 min por ciclo)	Automática (0 min) vía Reporte HTML y Trace Viewer	100% de trazabilidad sin esfuerzo manual
Riesgo de error por fatiga humana	Medio / Alto en ciclos repetitivos	0% en validación de pasos y aserciones	Mayor estabilidad en salida a producción

