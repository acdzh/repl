// assets
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.webp';
declare module '*.txt';
declare module '*.worker.js';
declare module '*.raw.*';

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
