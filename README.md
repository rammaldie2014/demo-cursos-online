# Aprende y Avanza · Demo frontend (HU 001)

Demo web navegable de una plataforma de formación práctica y asesorías para emprendedores.
**Aprende y Avanza** es un nombre provisional; no se verificó su disponibilidad comercial.

> Todo es de demostración: no hay backend, autenticación real, pagos, correos ni videos.
> El avance se guarda **solo en el navegador** (`localStorage`).

## Requisitos

- Node.js 20.19+ (probado con 24.18) y npm 10+ (probado con 11.16)
- Angular 22 (se instala con las dependencias)

## Instalación y ejecución

```bash
cd front
npm install
npm start            # http://localhost:4200
npm run build        # compilación de producción en dist/aprende-y-avanza
npm test -- --watch=false   # pruebas unitarias (Vitest)
```

Para presentarlo sin servidor de desarrollo, sirve `dist/aprende-y-avanza/browser` con cualquier
servidor estático que redirija las rutas a `index.html`, por ejemplo: `npx serve -s dist/aprende-y-avanza/browser`.

## Flujos disponibles

| # | Pantalla | Ruta | Qué permite |
|---|----------|------|-------------|
| 1 | Inicio | `/` | Banner, ruta de 4 pasos, cursos destacados, bloque de asesorías y vista previa del certificado |
| 2 | Catálogo | `/cursos` | Búsqueda sin tildes, filtros por categoría, nivel y duración, orden, limpiar filtros, estado sin resultados |
| 3 | Detalle | `/cursos/:slug` | Descripción, objetivos, módulos, materiales, criterios del certificado, «Inscribirme gratis» |
| 4 | Acceso demo | `/acceso`, `/iniciar-sesion`, `/registro` | Invitado, inicio de sesión o registro simulados (solo nombre y correo opcional), cambio de perfil |
| 5 | Panel del alumno | `/panel` | Cursos inscritos, % de avance, última lección, actividades, próxima asesoría, reservas, estados vacíos |
| 6 | Instructivos | `/aprender/crea-tu-marca/:paso` | 4 pasos con objetivo, explicación, ejemplo, actividad, validación, guardado, navegación e índice lateral |
| 7 | Evaluación | `/aprender/crea-tu-marca/evaluacion` | 3 preguntas, aprobación con 2/3, reintento ilimitado; bloqueada hasta completar los 4 pasos |
| 8 | Certificado | `/certificado/crea-tu-marca` | Bloqueado con explicación o vista previa con nombre, curso, fecha, emisor y leyenda demo; descarga por impresión a PDF |
| 9 | Asesorías | `/asesorias` | Especialista → fecha futura → horario → confirmación; reprogramar, cancelar y evitar duplicados |
| – | Perfil | `/perfil` | Datos del perfil demo, cambiar perfil, salir, reiniciar datos |

Curso con recorrido completo: **Crea tu marca desde cero**, gratuito. Los otros tres cursos aparecen marcados como «Curso de ejemplo».

## Arquitectura

```
src/app/
├── core/                      ← dominio y casos de uso (sin dependencias de UI)
│   ├── models/                ← tipos de dominio (Course, Lesson, Booking…)
│   ├── data/                  ← datos de ejemplo (cursos, instructivos, preguntas, especialistas)
│   ├── repositories/          ← contratos abstractos + implementación local
│   ├── storage/               ← puerto KeyValueStorage + adaptador localStorage / memoria
│   ├── services/              ← sesión, estado del alumno, inscripción, progreso, evaluación, certificado, reservas
│   ├── guards/                ← profileGuard, enrollmentGuard
│   ├── utils/                 ← reloj inyectable, fechas, texto
│   └── providers.ts           ← punto único de composición (inversión de dependencias)
├── shared/                    ← componentes de UI reutilizables (header, card, icon, progress, dialog…)
└── features/                  ← una carpeta por pantalla, cargadas con lazy loading
```

Cómo se aplican SOLID y clean code:

- **Responsabilidad única.** Cada servicio cubre un caso de uso: `EnrollmentService`, `CourseProgressService`, `AssessmentService`, `CertificateService`, `BookingService` y `DemoAccessService`. `LearnerStateStore` es la única fuente de estado persistido.
- **Abierto/cerrado e inversión de dependencias.** Los servicios dependen de `CourseRepository`, `LessonRepository`, `KeyValueStorage` y `Clock`, que son abstracciones. Para conectar una API real basta con cambiar las implementaciones en `core/providers.ts`.
- **Segregación de interfaces.** Hay repositorios pequeños por tipo de contenido.
- **Reglas en funciones puras y probadas.** `filterCourses`, `gradeAssessment`, `validateLessonAnswers`/`fieldError` (la misma regla para formularios y servicio) y `buildWorkbookHtml`.
- **Angular moderno.** Componentes standalone, signals (`computed`, `linkedSignal`), aplicación zoneless, control de flujo `@if/@for`, `OnPush` y parámetros de ruta como `input()`.

## Persistencia y reinicio de datos

- Las claves usan el prefijo `ayv:`. `ayv:session` guarda el perfil activo, `ayv:profiles` los perfiles demo y `ayv:state:<perfil>` el avance de cada perfil.
- Si un invitado se registra, su avance pasa al nuevo perfil.
- **Reiniciar la demo:** usa el botón «Reiniciar datos de la demo» del pie de página o de *Mi perfil*. También puedes borrar los datos del sitio en el navegador (DevTools → Application → Local Storage).

## Supuestos

- La duración estimada del curso principal es de 3 horas. Los precios son de ejemplo, en soles, y nunca se cobran.
- La disponibilidad de los especialistas es determinista: de lunes a sábado según el especialista y hasta 60 días hacia adelante. Algunos horarios aparecen como «ocupados» para dar realismo.
- Se permite una sola asesoría vigente por especialista; para cambiarla se reprograma.
- El correo del perfil demo solo identifica el perfil en el navegador. Si no hay correo, se usa el nombre.

## Limitaciones conocidas

- No hay sincronización entre dispositivos ni navegadores. Borrar los datos del navegador elimina el avance.
- El PDF del certificado se genera con la vista de impresión del navegador (elegir «Guardar como PDF»). No tiene QR ni validación externa.
- Las fotografías son recortes de las imágenes de referencia entregadas por el cliente. Antes de pasar a producción hay que reemplazarlas por fotos propias o con licencia. Si una imagen no carga, se muestra un ícono alternativo.
- La tipografía *Plus Jakarta Sans* se carga desde Google Fonts. Sin conexión, se usa la fuente del sistema.
- Los íconos son SVG propios, con trazos inspirados en Feather Icons (licencia MIT).
