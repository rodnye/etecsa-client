## 🤔 ¿Cómo funciona?

La tienda virtual de ETECSA es una **Single Page Application (SPA)** construida con React que utiliza:

- **Cifrado personalizado** en las peticiones (no es un simple JSON).
- **Cookies de sesión** con tokens CSRF.
- **JavaScript pesado** que se ejecuta en el navegador para generar los payloads cifrados.

No se puede simplemente llamar a sus endpoints con `fetch` o `axios` porque:

1. Las peticiones requieren un formato de cifrado específico.
2. Las claves de cifrado se generan dinámicamente en el cliente.
3. Los tokens CSRF cambian en cada sesión.

### La solución de etecsa-client

Este cliente **emula un navegador real** usando:

#### 1. **JSDOM** – Cargar todo el javascript de la página

```typescript
// Carga el HTML y ejecuta todo el JavaScript de ETECSA
const dom = await JSDOM.fromFile('index.html', {
  resources: 'usable', // Carga CSS, JS, etc.
  runScripts: 'dangerously', // Ejecuta React y la lógica de ETECSA
  url: 'https://www.tienda.etecsa.cu/visitantes/home',
});
```

#### 2. **Extracción de funciones internas**

Una vez que React se monta en el DOM virtual, el cliente "obtiene" las funciones internas que ETECSA usa para cifrar datos:

```typescript
// Se fuerza exponer globalmente estas funciones en el navegador
window.extracted = {
  axios, // Instancia de Axios configurada
  encryptPayload, // Función de cifrado que usa internamente
  CryptoJS, // Librería de cifrado
  href, // URL base
};
```

#### 3. **Reutilización de la lógica oficial**

En lugar de re-implementar el cifrado (complejo y propenso a errores), `etecsa-client` **usa las mismas funciones**:

```typescript
// Lo que hace ETECSA internamente:
const datosCifrados = window.encryptPayload({
  usuario: 'ejemplo@nauta.cu',
  contrasenna: 'miPassword',
});

// El cliente usa EXACTAMENTE la misma función
const response = await ETECSA.axios.post('/api/login', datosCifrados);
```

#### 4. **Manejo de cookies**

Las cookies se mantienen en un `CookieJar` que persiste entre peticiones:

```typescript
// El cliente mantiene el contexto de sesión automáticamente
await etecsa.auth.login({ user: 'x', pass: 'y' });
// Las cookies csrftoken y sessionid se guardan automáticamente

// Siguiente petición ya envía las cookies automáticamente
const perfil = await etecsa.profile.me(); // Autenticado
```

### Flujo completo de una petición

1. Tu código llama a `etecsa.mobile.status()`
2. `ensureInit()` verifica que el DOM virtual esté listo
3. La función prepara los datos según el endpoint
4. `ETECSA.encryptPayload()` (original de ETECSA) cifra los datos
5. `ETECSA.axios()` (configuración original) envía la petición
6. La cookie jar maneja automáticamente csrftoken y sessionid
7. ETECSA responde → el cliente descifra → tu código recibe JSON

### ¿Por qué este enfoque?

| Enfoque tradicional                           | Enfoque de etecsa-client                    |
| --------------------------------------------- | ------------------------------------------- |
| ❌ Reimplementar cifrado (propenso a errores) | ✅ Usa el cifrado REAL de ETECSA            |
| ❌ Rompe cuando ETECSA actualiza su frontend  | ✅ Sigue funcionando (usa su propia lógica) |
| ❌ Difícil manejar tokens CSRF                | ✅ Las cookies se manejan automáticamente   |
| ❌ Requiere ingeniería inversa constante      | ✅ Solo extrae lo que ya existe             |

### Limitaciones técnicas

- **Tiempo de arranque**: La primera inicialización tarda ~2-3 segundos (carga React).
- **Node.js exclusivo**: No funciona en navegadores (usa `fs`, `http`, `jsdom`).

### Rendimiento

Una vez inicializado, cada petición es rápida (~100-300ms) porque:

- Ya no se ejecuta React de nuevo.
- Las funciones cifradoras ya están en memoria.
- Solo se hacen los requests HTTP necesarios.
