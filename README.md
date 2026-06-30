# etecsa-client

Monorepo para el ecosistema de la Tienda ETECSA. Contiene el core no oficial para la API de ETECSA, eliminando las abstracciones y encriptados en una API cómoda y facil de usar.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

> - [¿Para qué es esto?](./docs/WHY.md)
> - [¿Cómo funciona?](./docs/HOW.md)

## Paquetes

- `@rodny/etecsa-core`: El cliente principal que emula el navegador y cifra las peticiones.
- `@rodny/etecsa-cli`: Proximamente...

## 🚀 Inicio rápido

1. Instala las dependencias:

```bash
pnpm install
```

2. Construye todos los paquetes:

```bash
pnpm build
```

3. Usa la CLI:

```bash
pnpm dev:cli login -u tu_usuario -p tu_contraseña
pnpm dev:cli me
```

## 📂 Estructura

```
.
├── packages/
│   ├── core/       # @rodny/etecsa-core
│   ├── cli/        # @rodny/etecsa-cli
├── package.json
└── pnpm-workspace.yaml
```
