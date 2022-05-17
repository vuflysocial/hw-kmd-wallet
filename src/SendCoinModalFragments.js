import React from 'react';
import copyToClipboard from './lib/copy-to-clipboard';
import TxidLink from './TxidLink';

export class SendCoinRawTxRender extends React.Component {
  render() {
    const {rawtx} = this.props;

    return(
      <React.Fragment>
        <span className="send-coin-modal-debug-style1">Raw transaction:</span>
        <span className="send-coin-modal-debug-style2">{rawtx}</span>
        <button
          className="button is-light copy-btn"
          onClick={() => copyToClipboard(rawtx)}>
          <i className="fa fa-copy"></i> <span className="copy-btn-text">Copy</span>
        </button>
      </React.Fragment>
    );
  }
}

export class SendCoinTxLink extends React.Component {
  render() {
    const {coin, txid} = this.props;

    return(
      <span className="wb-txid">
        Transaction ID: <TxidLink txid={txid} coin={coin} />
        <button
          className="button is-light copy-btn"
          onClick={() => copyToClipboard(txid)}>
          <i className="fa fa-copy"></i> <span className="copy-btn-text">Copy</span>
        </button>
      </span>
    );
  }
}