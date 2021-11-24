import {createAdapter} from 'iocane';
import {writeLog} from '../Debug';
import {isElectron, helpers} from '../Electron';

const rootVar = 'hw-wallet';
let localStorageCache = {};
let pw;

if (!localStorage.getItem(rootVar)) {
  localStorage.setItem(rootVar, '');
}

export const resetLocalStorage = () => {
  pw = null;

  localStorage.setItem(rootVar, '');
};

export const setLocalStoragePW = (_pw) => {
  pw = _pw;

  //writeLog('localStorage pw set to: ', pw);
};

export const decodeStoredData = () => {
  if (!isElectron) {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(rootVar).length) {
        createAdapter()
        .decrypt(localStorage.getItem(rootVar), pw)
        .catch((err) => {
          resolve(false);
        })
        .then(decryptedString => {
          //writeLog('decryptedString', decryptedString);
          
          localStorageCache = decryptedString ? JSON.parse(decryptedString) : {};
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  } else {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(rootVar).length) {
        helpers.decodeStoredData(localStorage.getItem(rootVar), pw)
        .catch((err) => {
          resolve(false);
        })
        .then(decryptedString => {
          //writeLog('decryptedString', decryptedString);
          
          localStorageCache = decryptedString ? JSON.parse(decryptedString) : {};
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  }
};

export const encodeStoredData = (str) => {
  if (!isElectron) {
    createAdapter()
    .encrypt(str, pw)
    .catch((err) => {
      writeLog('encodeStoredData error', err);
    })
    .then(encryptedString => {
      localStorage.setItem(rootVar, encryptedString);
    });
  } else {
    helpers.encodeStoredData(str, pw)
    .catch((err) => {
      resolve(false);
    })
    .then(encryptedString => {
      //writeLog('encryptedString', encryptedString);
      localStorage.setItem(rootVar, encryptedString);
    });
  }
};

export const setLocalStorageVar = (name, json) => {
  return new Promise((resolve, reject) => {
    let _var = {};
    
    try {
      _var = localStorageCache[name] || {};
    } catch (e) {
      writeLog(e);
    }

    for (let key in json) {
      _var[key] = json[key];
    }

    //writeLog('_var', _var);

    localStorageCache[name] = json;

    encodeStoredData(JSON.stringify(localStorageCache));
    resolve(true);
  });
};

export const getLocalStorageVar = (name) => {
  return localStorageCache[name] ? localStorageCache[name] : {};
};