import { DOMWindow, JSDOM, VirtualConsole } from 'jsdom';
import express from 'express';
import path from 'path';
import { Server } from 'http';
import { setTimeout } from 'timers/promises';
import { LIB_FOLDER } from '../consts';

/**
 *
 */
export const loadVirtualDOM = async () => {
  // create virtual console
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (err) => {
    console.error('JSDOM Error:', err.message);
  });

  // serve offline scripts
  const server = await new Promise<Server>((resolve) => {
    const app = express();

    app.use(express.static(path.join(LIB_FOLDER, 'raw')));

    const server = app.listen(3256, () => {
      resolve(server);
    });
  });

  // load virtual dom
  const dom = await JSDOM.fromFile(path.join(LIB_FOLDER, 'raw/index.html'), {
    resources: 'usable',
    url: 'https://www.tienda.etecsa.cu/visitantes/home',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
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

  return dom;
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
  Object.defineProperty(window, 'scrollTo', {
    value: () => {},
  });
  Object.defineProperty(window, 'requestAnimationFrame', {
    value: (cb: FrameRequestCallback) => {
      setTimeout(16).then(() => cb(Date.now()));
    },
  });
  Object.defineProperty(window, 'cancelAnimationFrame', {
    value: (id: number) => clearTimeout(id),
  });
};
