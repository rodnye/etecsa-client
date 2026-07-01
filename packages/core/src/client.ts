import { loadVirtualDOM } from './core/dom.ts';
import { AxiosInstance } from 'axios';
import type { CookieJar } from 'jsdom';
import { createAuthApi } from './api/auth';
import { createProfileApi } from './api/profile';
import { createMobileApi } from './api/mobile';
import { createNomenclatorsApi } from './api/nomenclators';
import { createPageApi } from './api/page';

export interface EtecsaClientContext {
  axios: AxiosInstance;
  encryptPayload: (data: object) => { datos: [string, string] };
  href: string;
  cookiesJar: CookieJar;
  ensureInit: () => Promise<void>;
}

export class EtecsaClient implements EtecsaClientContext {
  axios!: AxiosInstance;
  encryptPayload!: (data: object) => { datos: [string, string] };
  href!: string;
  cookiesJar!: CookieJar;

  private _initPromise: Promise<void> | null = null;
  private _ready = false;

  public auth!: ReturnType<typeof createAuthApi>;
  public profile!: ReturnType<typeof createProfileApi>;
  public mobile!: ReturnType<typeof createMobileApi>;
  public nom!: ReturnType<typeof createNomenclatorsApi>;
  public page!: ReturnType<typeof createPageApi>;

  async init(): Promise<void> {
    if (this._initPromise) {
      return this._initPromise;
    }
    this._initPromise = this._doInit();
    return this._initPromise;
  }

  async ensureInit(): Promise<void> {
    if (!this._initPromise) {
      throw new Error('EtecsaClient not initialized. Call init() first.');
    }
    await this._initPromise;
    if (!this._ready) {
      throw new Error('Initialization failed.');
    }
  }

  private async _doInit(): Promise<void> {
    const { window: jsdomWindow, cookieJar } = await loadVirtualDOM();
    const extracted = (jsdomWindow as any).extracted;
    if (!extracted) {
      throw new Error('Failed to extract ETECSA API methods from virtual DOM');
    }

    this.axios = extracted.axios;
    this.encryptPayload = extracted.encryptPayload;
    this.href = extracted.href;
    this.cookiesJar = cookieJar;
    this._ready = true;

    // Create API sub‑objects bound to this instance’s context
    this.auth = createAuthApi(this);
    this.profile = createProfileApi(this);
    this.mobile = createMobileApi(this);
    this.nom = createNomenclatorsApi(this);
    this.page = createPageApi(this);
  }
}

export default EtecsaClient;
