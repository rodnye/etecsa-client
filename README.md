# etecsa-client

Monorepo para el ecosistema de la Tienda ETECSA. Contiene el core no oficial para la API de ETECSA, eliminando las abstracciones y encriptados en una API cómoda y facil de usar.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Paquetes

- [`@rodny/etecsa-cli`](packages/cli#readme): Herramienta de línea de comandos para hacer consultas de saldo desde la terminal.
- [`@rodny/etecsa-core`](packages/core#readme): Librería y cliente principal que emula el navegador y cifra las peticiones.

> - [¿Para qué es esto?](./docs/WHY.md)
> - [¿Cómo funciona?](./docs/HOW.md)

## Desarrollo

1. Instalar las dependencias:

```bash
pnpm install
```

2. Construye todos los paquetes:

```bash
pnpm clean # opcional
pnpm build
```

3. Usa la CLI:

```bash
pnpm dev:cli login -u tu_usuario -p tu_contraseña
pnpm dev:cli status
```

4. Otros comandos para desarrollo

```bash
# dar formato con prettier
pnpm format

# publicar a npm todos los paquetes (usa changesets)
pnpm release
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
