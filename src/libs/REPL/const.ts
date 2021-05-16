/* eslint-disable import/prefer-default-export */
export const BASE_PATH = window.location.origin;

export const SANDBOX_HTML_SRC = `${BASE_PATH}/sandbox.html`;

declare global {
  interface Window {
    __SCRIPT_MAP__: {
      [property: string]: {
        name: string,
        fullname: string;
        src: string;
        ext: string;
      }
    };
  }
}

// eslint-disable-next-line no-underscore-dangle
export const scriptMap = window.__SCRIPT_MAP__;

export const workerSupported = !!window.Worker;
