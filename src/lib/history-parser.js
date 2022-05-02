import {secondsToString} from './time';
import {sortTransactions} from './sort';
import compose from './compose';
import {writeLog} from '../Debug';

const parse = ([txs, addr, options]) => {
  let txHistory = [];
  let addresses = [];

  if (options && options.hasOwnProperty('debug')) {
    writeLog('parsehistory txs', txs);
  }
  
  for (let i = 0; i < txs.length; i++) {
    let tx = {};
    let myOutAddress = false, myInAddress = false;
    let vinSum = 0, voutSum = 0, txVin = 0, txVout = 0;

    if (options && options.hasOwnProperty('debug')) {
      writeLog('--- vin -->');
      writeLog(txs[i].vin);
      writeLog('--- vout -->');
      writeLog(txs[i].vout);
    }
    
    for (let j = 0; j < txs[i].vin.length; j++) {
      if (txs[i].vin[j].value) txVin += Number(txs[i].vin[j].value);

      if (addresses.indexOf(txs[i].vin[j].addr) === -1) {
        addresses.push(txs[i].vin[j].addr);
      }

      if (addr.indexOf(txs[i].vin[j].addr) > -1) {
        vinSum += Number(txs[i].vin[j].value);
        myInAddress = true;
      }
    }

    for (let j = 0; j < txs[i].vout.length; j++) {
      if (txs[i].vout[j].value) txVout += Number(txs[i].vout[j].value);

      if (addresses.indexOf(txs[i].vout[j].scriptPubKey.addresses[0]) === -1) {
        addresses.push(txs[i].vout[j].scriptPubKey.addresses[0]);
      }

      if (addr.indexOf(txs[i].vout[j].scriptPubKey.addresses[0]) > -1) {
        voutSum += Number(txs[i].vout[j].value);
        writeLog('vout', JSON.stringify(txs[i].vout[j]));
        myOutAddress = true;
      }
    }
  
    if (options && options.hasOwnProperty('debug')) {
      writeLog(`vinsum: ${vinSum}`);
      writeLog(`voutSum: ${voutSum}`);
    }

    const amount = Math.abs(Number(Number(Math.abs(vinSum) - Math.abs(voutSum)).toFixed(8)));
    tx = {
      type: 'sent',
      amount: Math.abs(amount - 0.0001) === 0 ? Number(Number(txs[i].vout[0].value).toFixed(8)) : amount,
      timestamp: txs[i].height === -1 ? Math.floor(Date.now() / 1000) : txs[i].blocktime || 'pending',
      date: txs[i].blocktime ? secondsToString(txs[i].blocktime) : 'pending',
      txid: txs[i].txid || 'unknown',
      height: txs[i].height === -1 ? 0 : txs[i].height || 'unknown',
      confirmations: txs[i].confirmations || 0,
    };

    // TODO: detect send to self txs
    if (options &&
        options.coin &&
        options.coin.toUpperCase() === 'KMD' &&
        (Number(txVin - txVout) < 0) &&
        myOutAddress && myInAddress) {
      tx.type = 'rewards';
    } else if (vinSum && !voutSum) {
      tx.type = 'sent';
    } else if (!vinSum && voutSum) {
      tx.type = 'received';
    }

    txHistory.push(tx);
  }

  return txHistory;
};

const sort = txHistory => {
  if (txHistory.length && !txHistory.txid) {
    txHistory[0] = sortTransactions(txHistory[0], 'timestamp');

    return txHistory;
  }

  return sortTransactions(txHistory, 'timestamp');
};

const limit = txHistory => {
  if (txHistory.length && !txHistory.txid) {
    txHistory[0] = txHistory[0].slice(0, 10);

    return txHistory;
  }

  if (txHistory.length > 10) {
    txHistory = txHistory.slice(0, 10);
  }

  return txHistory;
};

const parsehistory = (txs, addr, options) => {
  return compose(limit, sort, parse)([txs, addr, options]);
};

export default parsehistory;