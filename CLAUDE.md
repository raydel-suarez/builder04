# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cómo ejecutar el proyecto

No hay build tools ni package manager. Los módulos ES requieren servidor HTTP:

```bash
# Cualquiera de estas opciones sirve:
python3 -m http.server 8080
npx serve .
```

Luego abrir `http://localhost:8080` en el navegador. Abrir `index.html` directamente con `file://` no funciona porque los ES modules quedan bloqueados por CORS.

## Arquitectura

Aplicación de una sola página (vanilla HTML/CSS/JS) sin frameworks ni bundler. Persiste datos en `localStorage` con la clave `taskcal_v1`.

### Flujo de datos

```
localStorage ──► db.js (loadDB/saveDB)
                    │
                    ▼
              state.js  ◄──── todos los módulos leen/escriben aquí
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
   calendar.js            panel.js
   (renderCal)           (renderPanel)
         ▲                     ▲
         └──────────┬──────────┘
                    │
             modal.js / delete.js
```

El estado central está en `js/state.js` como un objeto mutable único (`state`). Todos los módulos lo importan directamente y mutan sus propiedades. No hay getters/setters: la mutación directa es intencional.

### Event delegation

Los eventos de clic sobre días del calendario y sobre los botones de las tarjetas de tarea se registran **una sola vez** en `js/app.js` mediante delegación sobre `#calGrid` y `#panelBody`. Esto evita re-registrar listeners en cada render y elimina dependencias circulares entre módulos.

`calendar.js` y `panel.js` solo generan HTML — **nunca** llaman `addEventListener` internamente.

### Regla de dependencias entre módulos

El grafo de dependencias es acíclico:

```
constants  state
    │        │
    └──┬─────┤
       ▼     ▼
      utils  db
       │      │
       └──┬───┤
          ▼   ▼
       calendar  panel
           │       │
           └───┬───┘
               ▼
         delete  modal
               │
               ▼
             app  ◄── punto de entrada
```

`calendar.js` y `panel.js` nunca importan de `delete.js` ni `modal.js`.

### CSS

Los archivos CSS se cargan en orden específico en `index.html` — `variables.css` debe ir primero porque los demás usan sus custom properties `--*`.

## Pruebas unitarias

Stack: **Vitest 2.x + jsdom**. Los tests corren en Node.js con DOM simulado; no requieren servidor ni browser.

### Comandos

```bash
npm test              # modo watch (re-ejecuta al guardar)
npm run test:run      # una sola pasada + genera reports/index.html
npm run test:coverage # una sola pasada + cobertura en reports/coverage/index.html
npm run test:ui       # servidor interactivo en localhost (requiere browser)
```

### Ver el reporte HTML

```bash
npx vite preview --outDir reports
```

Esto lanza un servidor local que sirve `reports/index.html`. El archivo se actualiza con cada `npm run test:run`.

### Estructura de tests

```
tests/
├── setup.js            # setupDOM() y resetState() compartidos; limpia localStorage
├── utils.test.js       # 24 tests — funciones puras (isoDate, uid, esc, isOverdue…)
├── db.test.js          #  6 tests — loadDB / saveDB con localStorage real
├── calendar.test.js    #  9 tests — renderCal: badges, clases today/overdue/selected
├── panel.test.js       # 13 tests — renderPanel: placeholders, tarjetas, XSS, vencido
├── delete.test.js      # 14 tests — findTask, deleteTask, clearDelConfirm, confirmDelete
├── modal.test.js       # 22 tests — openModal (nueva/editar), closeModal, saveTask
└── integration.test.js # 11 tests — flujos completos (crear→badge, editar→mover, eliminar→persistir)
```

**Total: 99 tests / 7 archivos.**

### Convenciones de test importantes

- `vi.setSystemTime(new Date(2026, 5, 22))` — usar siempre el constructor con año/mes/día (hora local), nunca el string ISO `'2026-06-22'` (UTC), para que `todayKey()` coincida.
- `setupDOM()` debe llamarse en `beforeEach` en cualquier test que use `renderCal`, `renderPanel`, `openModal`, `confirmDelete` o `deleteTask`.
- `resetState()` aisla el `state` mutable entre tests dentro del mismo archivo. Entre archivos, Vitest los aísla con workers separados.

## Consideraciones importantes

- **Sin TypeScript ni transpilación**: el código se ejecuta tal cual en el navegador. Usar sintaxis ES2020+ está bien (los módulos ya requieren navegador moderno).
- **`taskcal.html`**: archivo original monolítico, conservado como referencia. El punto de entrada activo es `index.html`.

---

## Flujo de trabajo con Git — REGLA OBLIGATORIA

> **Esta regla tiene prioridad sobre cualquier otra instrucción. Se aplica a CADA cambio, sin excepción.**

### Prohibición absoluta

**Nunca implementar cambios directamente sobre `main`.** Hacerlo está prohibido independientemente del tamaño o urgencia del cambio.

### Herramienta exclusiva

**Todo flujo Git se gestiona únicamente mediante el MCP de GitHub** (`mcp__github__*`).  
No usar comandos `git` de la terminal, ni `Bash`, ni ninguna otra herramienta para operaciones de control de versiones.

### Protocolo obligatorio antes de cualquier cambio

Seguir estos pasos **en orden** cada vez que el usuario solicite una modificación:

#### 1. Identificar la rama destino

Usar `mcp__github__list_commits` o contexto de conversación para confirmar que `main` es la rama base. Si ya existe una rama `feature/` activa para el mismo cambio, usarla en lugar de crear una nueva.

#### 2. Crear la rama feature

```
mcp__github__create_branch
  branch: "feature/<identificador>"
  from_branch: "main"
```

El `<identificador>` debe ser un slug en **kebab-case**, corto (máx. 5 palabras), que describa el cambio. Derivarlo del texto de la solicitud del usuario.

| Solicitud del usuario | Rama a crear |
|---|---|
| "agrega navegación por semestres" | `feature/half-year-nav` |
| "corrige el badge de vencidos" | `feature/fix-overdue-badge` |
| "cambia colores del header" | `feature/header-colors` |
| "hook para pruebas unitarias" | `feature/unit-test-hook` |

#### 3. Implementar los cambios

Editar los archivos localmente con las herramientas `Edit` / `Write` como de costumbre.  
Los hooks de pruebas unitarias (`pre_test_check`, `test_failure_analyzer`) se ejecutarán automáticamente.

#### 4. Publicar los cambios en la rama

```
mcp__github__push_files
  branch: "feature/<identificador>"
  files: [ lista de archivos modificados con su contenido ]
  message: "<descripción concisa del commit>"
```

Incluir **todos** los archivos modificados en una sola llamada.

#### 5. Abrir Pull Request

```
mcp__github__create_pull_request
  title: "<título descriptivo del cambio>"
  head: "feature/<identificador>"
  base: "main"
  body: resumen de qué cambia y por qué
```

### Confirmación al usuario

Al terminar, reportar:
- Nombre de la rama creada
- URL del Pull Request abierto
- Lista de archivos modificados

### Excepciones

La única excepción permitida es si el usuario indica **explícitamente** trabajar sobre `main`. En ese caso, confirmar la instrucción antes de proceder.

---

## Integración de Pull Requests a `main` — REGLA OBLIGATORIA

> **Esta regla bloquea cualquier merge. No hay excepciones.**

### Protocolo obligatorio para integrar un PR

Antes de aprobar o hacer merge de cualquier PR a `main`, seguir estos pasos **en orden**:

#### 1. Ejecutar la suite completa de pruebas

```bash
npm run test:run
```

Leer el resultado completo. El criterio de aprobación es estricto:

| Resultado | Acción |
|---|---|
| **99 passed (99)** — 0 fallidos | Continuar al paso 2 |
| Cualquier número de fallidos | **DETENER. No se puede aprobar el PR.** |

#### 2. Evaluar el resultado

**Si todos los tests pasan (100 %):**

- Aprobar el PR con `mcp__github__create_pull_request_review` indicando `event: "APPROVE"`
- En el body del review incluir: número de tests pasando, tiempo de ejecución y confirmación explícita de que no hay fallos
- Hacer merge con `mcp__github__merge_pull_request`

**Si uno o más tests fallan:**

- **No aprobar el PR**
- Publicar un review con `event: "REQUEST_CHANGES"` que incluya:
  - Número de tests fallidos y total
  - Nombre exacto de cada test fallido
  - Archivo y descripción del error reportado por Vitest
  - Indicación clara: *"El PR no puede integrarse a `main` hasta que todos los tests pasen."*

#### 3. Reportar al usuario

Al terminar, informar:
- Resultado de las pruebas (N passed / N failed)
- Si se aprobó: URL del PR mergeado
- Si se rechazó: lista de tests fallidos con su mensaje de error

### Ejemplo de review de rechazo

```
❌ PR RECHAZADO — Las pruebas unitarias no pasan

Resultado: 2 failed / 99 total

Tests fallidos:
1. renderCal > el día de hoy recibe la clase "today"
   AssertionError: expected null not to be null
   (calendar.test.js:29)

2. Flujo — crear tarea > tras crear una tarea aparece badge en el día
   AssertionError: expected '0' to be '1'
   (integration.test.js:41)

El PR no puede integrarse a `main` hasta que todos los tests pasen.
```
