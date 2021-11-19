import {
  isElectron,
  appData,
} from './Electron';

export let isDev = false;

if (window.location.href.indexOf('devmode') > -1) {
  isDev = true;
}

if (isElectron &&
    appData.isDev) {
  isDev = false;
}

export const writeLog = isDev ? console.warn : () => {};