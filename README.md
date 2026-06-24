# etecsa-client

Cliente no oficial para la API de ETECSA (https://www.tienda.etecsa.cu).  
Permite autenticación, consulta de servicios móviles, gestión de perfil, nomencladores y más.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

> - [¿Para qué es esto?](./docs/WHY.md)
> - [¿Cómo funciona?](./docs/HOW.md)

## Características

- **Autenticación** – Inicio de sesión, manejo de cookies y recuperación de contraseña.
- **Perfil de usuario** – Obtener datos, editar perfil, cerrar sesión.
- **Servicios móviles** – Consultar saldo, paquetes, estado de línea (prepago/postpago/SIM datos).
- **Nomencladores** – Provincias, municipios, interrupciones de Nauta y STB.
- **Páginas públicas** – Obtener paquetes, planes, ofertas, preguntas frecuentes.
- **Manejo robusto de errores** – Errores tipados con códigos específicos.
- **TypeScript** – Tipos completos incluidos tanto de las solicitudes como de las respuestas.
- **Múltiples instancias** – Soporta múltiples clientes independientes con sus propias sesiones.

## 🚀 Uso rápido

```typescript
import { EtecsaClient } from 'etecsa-client';

// 1. Crear instancia del cliente
const client = new EtecsaClient();

// 2. Inicializar el cliente (solo una vez por instancia)
await client.init();

// 3. Iniciar sesión
await client.auth.login({
  user: '+53 5555555',
  pass: 'tu_contraseña',
});

// 4. Obtener datos del perfil
const perfil = await client.profile.me();
console.log(perfil.usuario.nombre);

// 5. Consultar estado de un servicio móvil
const estadoMovil = await client.mobile.status();
console.log(`Saldo: ${estadoMovil.balance}`);

// 6. Cerrar sesión
await client.auth.logout();
```

---

## 📚 API Principal

### `new EtecsaClient()`

Crea una nueva instancia del cliente. Cada instancia mantiene su propia sesión y cookies independientes.

```typescript
const client = new EtecsaClient();
```

---

### `client.init()`

Debe llamarse **una sola vez** por instancia antes de cualquier otra operación.  
Carga el entorno virtual y prepara los métodos de comunicación.

```typescript
await client.init();
```

---

### 🔐 `client.auth` – Autenticación

| Método                         | Descripción                                             |
| ------------------------------ | ------------------------------------------------------- |
| `login({ user, pass })`        | Inicia sesión y devuelve cookies de sesión.             |
| `logout()`                     | Cierra la sesión actual.                                |
| `sendCode(user)`               | Envía código de verificación para recuperar contraseña. |
| `verifyCode(user, code)`       | Verifica el código enviado.                             |
| `resetPassword(user, newPass)` | Restablece la contraseña.                               |
| `save()`                       | Guarda las cookies actuales (serializables a JSON).     |
| `load(cookiesJson)`            | Restaura cookies desde JSON.                            |
| `clear()`                      | Limpia todas las cookies.                               |

**Ejemplo completo de recuperación:**

```typescript
await client.auth.sendCode('+53 55555555');

// chequear el código de confirmación recibido
await client.auth.verifyCode('+53 55555555', '123456');
await client.auth.resetPassword('+53 55555555', 'nuevaPass123');
```

---

### 👤 `client.profile` – Perfil de usuario

| Método                            | Descripción                                   |
| --------------------------------- | --------------------------------------------- |
| `me()`                            | Obtiene datos completos del perfil.           |
| `edit(data)`                      | Edita nombre, apellidos, dirección, etc.      |
| `mobileServices()`                | Lista de servicios móviles asociados.         |
| `landlineServices()`              | Servicios de telefonía fija.                  |
| `nautaHogar()`                    | Datos de Nauta Hogar.                         |
| `cashiersIds()`                   | IDs de cajeros disponibles.                   |
| `ownCard()`                       | Tarjeta propia asociada.                      |
| `verifyUser(id, tipo, usuario)`   | Verifica si un número/correo está disponible. |
| `generateCode(tipo, usuario)`     | Genera código para añadir servicio.           |
| `verifyCode(usuario, code, tipo)` | Verifica código para añadir servicio.         |

---

### 📱 `client.mobile` – Servicios móviles

| Método             | Descripción                                 |
| ------------------ | ------------------------------------------- |
| `status(request?)` | Obtiene estado (saldo, paquetes, voz, SMS). |

**Uso:** Si no pasas parámetros, usa el primer servicio móvil del perfil.  
Puedes pasar `{ service, ci, typeci, sendSms }` para consultar una línea específica.

```typescript
// Usar el primer servicio del perfil
const estado = await client.mobile.status();

// Consultar línea específica
const estado2 = await client.mobile.status({
  service: '+53 55555555',
  sendSms: false,
});
```

---

### 🗺️ `client.nom` – Nomencladores

| Método                       | Descripción                        |
| ---------------------------- | ---------------------------------- |
| `provinces()`                | Lista de provincias.               |
| `municipalities(provinceId)` | Municipios de una provincia.       |
| `nautaInterruptions()`       | Interrupciones del servicio Nauta. |
| `stbInterruptions()`         | Interrupciones de STB.             |

---

### 🌐 `client.page` – Datos públicos

| Método              | Descripción                                                   |
| ------------------- | ------------------------------------------------------------- |
| `home()`            | Datos de la página principal (banners, productos destacados). |
| `packages()`        | Paquetes de datos disponibles.                                |
| `plans()`           | Planes de telefonía.                                          |
| `bags()`            | Bolsas de datos.                                              |
| `bag()`             | Detalles de una bolsa específica.                             |
| `specialPlans()`    | Planes especiales.                                            |
| `additionalPlans()` | Planes adicionales.                                           |
| `offers()`          | Ofertas y promociones.                                        |
| `faq()`             | Preguntas frecuentes.                                         |

---

## Manejo de errores

Todos los errores de API lanzan una instancia de `EtecsaApiError`:

```typescript
import { EtecsaClient, EtecsaApiError } from 'etecsa-client';

const client = new EtecsaClient();
await client.init();

try {
  await client.auth.login({ user: 'invalido', pass: 'xxx' });
} catch (error) {
  if (error instanceof EtecsaApiError) {
    console.error(`Error ${error.status}: ${error.message}`);
    console.error('Detalles:', error.details);
  }
}
```

**Códigos de error comunes:**

- `203` – Usuario o contraseña incorrectos
- `226` – Límite de intentos excedido o ya registrado
- `403` – Sesión expirada
- `204` – Usuario no encontrado
- `423` – Servicio no disponible

---

## Persistencia de sesión

Puedes guardar las cookies después de `login()` y restaurarlas en otra instancia:

```typescript
const client = new EtecsaClient();
await client.init();
await client.auth.login({ user: 'x', pass: 'y' });

// Guardar después de login
const cookiesGuardadas = client.auth.save();

// En otra ejecución
const newClient = new EtecsaClient();
await newClient.init();
await newClient.auth.load(cookiesGuardadas);
// Ahora la sesión sigue activa
```

---

## Múltiples instancias

Puedes crear múltiples clientes independientes para manejar diferentes cuentas:

```typescript
const client1 = new EtecsaClient();
const client2 = new EtecsaClient();

await Promise.all([client1.init(), client2.init()]);

await client1.auth.login({ user: 'usuario1@nauta.cu', pass: '***' });
await client2.auth.login({ user: 'usuario2@nauta.cu', pass: '***' });

// Cada cliente tiene su propia sesión
const perfil1 = await client1.profile.me();
const perfil2 = await client2.profile.me();
```
