import {KOMODO} from './../constants';
import p2pkh from '@trezor/utxo-lib/src/payments/p2pkh';

const getAddress = publicKey => p2pkh({
  pubkey: publicKey,
  network: KOMODO
}).address;

export default getAddress;