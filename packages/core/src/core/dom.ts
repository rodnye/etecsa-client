import { JSDOM, VirtualConsole, CookieJar } from 'jsdom';
import express from 'express';
import path from 'path';
import { Server } from 'http';
import { setTimeout } from 'timers/promises';
import { readFileSync } from 'fs';
import { DOMWindow } from 'jsdom';
import { LIB_FOLDER } from '../consts.ts';
import { AddressInfo } from 'node:net';

const RAW_DIR = path.join(LIB_FOLDER, '../raw');

/**
 *
 */
export const loadVirtualDOM = async (): Promise<{
  window: JSDOM['window'];
  cookieJar: CookieJar;
}> => {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (err) => {
    console.error('JSDOM Error:', err.message);
  });

  // Start express server on a random port
  const app = express();
  app.use(express.static(RAW_DIR));
  const server = await new Promise<Server>((resolve) => {
    const srv = app.listen(0, () => resolve(srv));
  });
  const port = (server.address() as AddressInfo).port;

  let htmlContent = readFileSync(path.join(RAW_DIR, 'index.html'), 'utf-8');
  htmlContent = htmlContent.replace(/localhost:3256/g, `localhost:${port}`);

  const dom = new JSDOM(htmlContent, {
    resources: 'usable',
    url: 'https://www.tienda.etecsa.cu/visitantes/home',
    runScripts: 'dangerously',
    virtualConsole,
    beforeParse: beforeParseForReact,
  });

  // wait for the latest div (wait for React hydrate/render)
  let loaded = false;
  while (!loaded) {
    loaded = !!dom.window.document.querySelector('div[data-test=sentinelEnd]');
    await setTimeout(1000);
  }

  // stop server
  await new Promise((resolve) => server.close(resolve));

  return { window: dom.window, cookieJar: dom.cookieJar };
};

/**
 *
 */
const beforeParseForReact = (window: DOMWindow) => {
  Object.defineProperty(window, 'alert', { value: console.log });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  Object.defineProperty(window, 'scrollTo', { value: () => {} });
  Object.defineProperty(window, 'requestAnimationFrame', {
    value: (cb: FrameRequestCallback) => {
      setTimeout(16).then(() => cb(Date.now()));
    },
  });
  Object.defineProperty(window, 'cancelAnimationFrame', {
    value: (id: number) => clearTimeout(id),
  });
};
