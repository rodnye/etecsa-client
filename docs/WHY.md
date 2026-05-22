# Why etecsa-client?

- ETECSA no ofrece una API pública oficial para desarrolladores. Su plataforma web es la única vía para consultar saldos, recargar servicios o gestionar cuentas Nauta. Hasta ahora solo es posible vía Android/IOS haciendo uso de una tarjeta SIM y códigos USSD ya conocidos (`*222#`, `*133#`)
- `etecsa-client` **reutiliza el propio código de ETECSA** para cifrar/descifrar datos. No hay ingeniería inversa.
- Es actualmente la **única solución práctica** para integrar servicios ETECSA en aplicaciones automatizadas.

**Perfecto para:** bots, automatizaciones, dashboards, monitoreo, respaldos y aplicaciones de terceros.

**No recomendado para:** alto volumen de requests, frontend web o aplicaciones críticas que requieran SLA garantizado.

---

## Posibles usos

### 1. Bot de Telegram para consultar saldo

```typescript
// Bot de Telegram (Node.js)
bot.command('saldo', async (ctx) => {
  await etecsa.init();
  await etecsa.auth.login({
    user: process.env.NAUTA_USER,
    pass: process.env.NAUTA_PASS,
  });

  const estado = await etecsa.mobile.status();
  await ctx.reply(
    `📱 Tu saldo actual: ${estado.balance} CUP\n📦 Paquete 4G: ${estado.paquete4g}`,
  );
});
```

### 2. Dashboard de análisis de consumo

```typescript
// Dashboard con actualización diaria
async function generarReporteDiario() {
  await etecsa.init();
  await etecsa.auth.login({ user: 'empresa@nauta.cu', pass: '***' });

  const servicios = await etecsa.profile.mobileServices();

  const reporte = await Promise.all(
    servicios.map(async (s) => {
      const estado = await etecsa.mobile.status({
        service: s.service,
        ci: s.ci,
        typeci: s.typeci,
      });

      return {
        numero: s.service,
        saldo: estado.balance,
        datosRestantes: estado.datos || estado.paquete4g,
        vozRestante: estado.voz,
      };
    }),
  );

  await guardarEnGoogleSheets(reporte);
  console.log('📊 Reporte actualizado');
}
```

### 3. Desarrollo de aplicaciones de terceros

Si queremos crear una app "Mi Saldo" con funciones que ETECSA no ofrece (historial de consumo, alertas personalizadas, múltiples cuentas).

```typescript
class MiNautaAPI {
  private clients = new Map();

  async agregarCuenta(usuario: string, pass: string, userId: string) {
    const client = { ...etecsa };
    await client.init();
    await client.auth.login({ user: usuario, pass });

    // Guardar cookies para no volver a loguear
    const cookies = client.auth.save();
    this.clients.set(userId, { client, cookies });

    return { success: true };
  }

  async getDashboard(userId: string) {
    const { client, cookies } = this.clients.get(userId);
    await client.auth.load(cookies);

    const [perfil, servicios, ofertas] = await Promise.all([
      client.profile.me(),
      client.profile.mobileServices(),
      client.page.offers(),
    ]);

    return { perfil, servicios, ofertas };
  }
}
```
