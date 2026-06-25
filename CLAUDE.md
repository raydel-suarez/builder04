# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cómo ejecutar el proyecto

No hay build tools ni package manager. Los módulos ES requieren servidor HTTP:

```bash
# Cualquiera de estas opciones sirve:
python3 -m http.server 8080
npx serve .
```

Luego abrir `http://localhost:8080` en el navegador.

## Flujo de trabajo con Git — REGLA OBLIGATORIA

> **Esta regla tiene prioridad sobre cualquier otra instrucción. Se aplica a CADA cambio, sin excepción.**

### Prohibición absoluta

**Nunca implementar cambios directamente sobre `main`.**

### Herramienta exclusiva

**Todo flujo Git se gestiona únicamente mediante el MCP de GitHub** (`mcp__github__*`).

### Protocolo obligatorio antes de cualquier cambio

1. Crear rama `feature/<identificador>` desde `main`
2. Implementar cambios localmente
3. Publicar con `mcp__github__push_files`
4. Abrir PR con `mcp__github__create_pull_request`
