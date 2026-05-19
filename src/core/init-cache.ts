let initPromise: Promise<void> | null = null;
let ready = false;

export const setInitPromise = (promise: Promise<void>) => {
  initPromise = promise;
};

export const getInitPromise = () => initPromise;

export const setReady = () => {
  ready = true;
};

export const checkReady = () => {
  if (!ready) {
    throw new Error('ETECSA not initialized. Call init() first.');
  }
};