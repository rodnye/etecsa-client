# @rodny/etecsa-cli

[![npm version](https://img.shields.io/npm/v/@rodny/etecsa-cli.svg?style=for-the-badge)](https://www.npmjs.com/package/@rodny/etecsa-cli)

CLI para interactuar con la API de https://www.tienda.etecsa.cu. Permite consultar saldo de forma remota y datos del estado de tu cuenta en ETECSA.

> [!important]
> Las consultas de saldo de los planes son independientes de un teléfono móvil, esto quiere decir que no utiliza codigos USSD,
> todo es directamente consumiendo la API

## Características

- **Multi-cuenta**: Guarda y alterna fácilmente entre múltiples usuarios.
- **Persistencia y Auto-Login**: Las sesiones se cachean localmente. Si tu sesión expira (Error 403) a mitad de un comando, la CLI **reautentica automáticamente** en segundo plano usando tus credenciales cifradas y reintenta la operación.
- **Filtros de Campos**: Para scripts. Puedes extraer solo el dato que necesitas (ej. `etecsa status --field balance`).

## Instalación y Uso

```bash
npm install --g @rodny/etecsa-cli
```

```bash
# 1. Iniciar sesión
etecsa login

# 2. Consultar saldo y paquetes
etecsa status

# 3. Obtener solo los datos restantes
etecsa status --field datos

# 4. Ver datos del perfil
etecsa profile

# 5. Añadir otra cuenta
etecsa login -u 591234567 -p mi_contraseña

# 6. Alternar entre cuentas guardadas
etecsa use
# o
etecsa use 591234567

# 7. Ver todas las cuentas guardadas
etecsa list
```

## Comandos Principales

| Comando                     | Descripción                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| `login [-u user] [-p pass]` | Autentica, cachea la sesión y guarda la cuenta.                                 |
| `use [user]`                | Cambia el usuario activo. Si no se especifica, muestra un selector interactivo. |
| `list`                      | Lista todas las cuentas configuradas y marca la activa.                         |
| `status [-f field]`         | Muestra estado de la línea móvil (saldo, 4G, Voz, SMS).                         |
| `profile [-f field]`        | Muestra datos personales del perfil.                                            |
| `logout`                    | Borra la cuenta activa y sus credenciales del almacenamiento local.             |
