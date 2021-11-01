import React from 'react';
import Modal from './Modal';
import './SettingsModal.scss';
import {
  getLocalStorageVar,
  setLocalStorageVar,
} from './lib/localstorage-util';
import {SETTINGS} from './constants';
import apiEndpoints from './lib/coins';
import {setConfigVar} from './lib/account-discovery';
import {isElectron} from './Electron';

class SettingsModal extends React.Component {
  state = this.initialState;
  
  get initialState() {
    this.triggerModal = this.triggerModal.bind(this);
    this.setFwCheck = this.setFwCheck.bind(this);
    this.setEnableDebugTools = this.setEnableDebugTools.bind(this);
    
    return {
      isClosed: true,
      theme: getLocalStorageVar('settings').theme,
      discoveryGapLimit: getLocalStorageVar('settings').discoveryGapLimit,
      discoveryAddressConcurrency: getLocalStorageVar('settings').discoveryAddressConcurrency,
      accountIndex: getLocalStorageVar('settings').accountIndex,
      explorerEndpoint: 'default',
      fwCheck: getLocalStorageVar('settings').fwCheck,
      enableDebugTools: getLocalStorageVar('settings').enableDebugTools,
    };
  }

  setDiscoveryConfigVar(e, name) {
    this.setState({
      [e.target.name]: e.target.value,
    });

    setConfigVar(e.target.name, Number(e.target.value));
  }

  setFwCheck() {
    setLocalStorageVar('settings', {fwCheck: !this.state.fwCheck});
    this.setState({
      fwCheck: !this.state.fwCheck,
    });
  }

  setEnableDebugTools() {
    setLocalStorageVar('settings', {enableDebugTools: !this.state.enableDebugTools});
    this.setState({
      enableDebugTools: !this.state.enableDebugTools,
    });
  }

  setExplorerEndpoint(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });

    this.props.updateExplorerEndpoint(e);
  }

  setTheme(name) {
    document.getElementById('body').className = name;
    setLocalStorageVar('settings', {theme: name});
    this.setState({
      theme: name,
    });
  }

  triggerModal() {
    this.setState({
      isClosed: !this.state.isClosed,
      explorerEndpoint: this.props.explorerEndpoint,
    });
  }

  render() {
    return (
      <React.Fragment>
        <span className="explorer-selector-block">
          <i
            className="fa fa-cog"
            onClick={this.triggerModal}></i>
        </span>
        <Modal
          title="Settings"
          show={this.state.isClosed === false}
          handleClose={this.triggerModal}
          isCloseable={true}
          className="settings-modal">
          <ul>
            <li>
              <div className="theme-selector">
                Theme
                <div
                  onClick={() => this.setTheme('tdark')}
                  className={'item black' + (this.state.theme === 'tdark' ? ' active' : '')}></div>
                <div
                  onClick={() => this.setTheme('tlight')}
                  className={'item light' + (this.state.theme === 'tlight' ? ' active' : '')}></div>
              </div>
            </li>
            {!isElectron &&
              <li>
                <span className="slider-text">Always check firmware version</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="fwCheck"
                    value={this.state.fwCheck}
                    checked={this.state.fwCheck}
                    readOnly />
                  <span
                    className="slider round"
                    onClick={this.setFwCheck}></span>
                </label>
              </li>
            }
            <li>
              <span className="slider-text">Enable debug controls (display xpub, raw tx hex)</span>
              <label className="switch">
                <input
                  type="checkbox"
                  name="enableDebugTools"
                  value={this.state.enableDebugTools}
                  checked={this.state.enableDebugTools}
                  readOnly />
                <span
                  className="slider round"
                  onClick={this.setEnableDebugTools}></span>
              </label>
            </li>
            <li>
              Address discovery gap limit
              <select
                name="discoveryGapLimit"
                className="explorer-selector"
                value={this.state.discoveryGapLimit}
                onChange={(event) => this.setDiscoveryConfigVar(event, 'discoveryGapLimit')}>
                {Array.from({length: SETTINGS.DISCOVERY_GAP_LIMIT / 5}, (_, i) => i + 1).map((item, index) => (
                  <option
                    key={`discovery-account-index-${index}`}
                    value={(index + 1) * 5}>
                    {index === 3 ? (index + 1) * 5 + ' (default)' : (index + 1) * 5}
                  </option>
                ))}
              </select>
            </li>
            <li>
              Address discovery concurrency limit
              <select
                name="discoveryAddressConcurrency"
                className="explorer-selector"
                value={this.state.discoveryAddressConcurrency}
                onChange={(event) => this.setDiscoveryConfigVar(event, 'discoveryAddressConcurrency')}>
                {Object.keys(SETTINGS.DISCOVERY_ADDRESS_CONCURRENCY).map((item, index) => (
                  <option
                    key={`discovery-address-concurrency-${item}`}
                    value={index}>
                    {SETTINGS.DISCOVERY_ADDRESS_CONCURRENCY[item]}
                  </option>
                ))}
              </select>
            </li>
            <li>
              Account index
              <select
                name="accountIndex"
                className="explorer-selector"
                value={this.state.accountIndex}
                onChange={(event) => this.setDiscoveryConfigVar(event, 'accountIndex')}>
                {[...Array(SETTINGS.ACCOUNT_INDEX_LIMIT).keys()].map((item, index) => (
                  <option
                    key={`discovery-account-index-${item}`}
                    value={index}>
                    {index === 0 ? index + ' (default)' : index}
                  </option>
                ))}
              </select>
            </li>
            {apiEndpoints[this.props.coin].api.length > 1 &&
              <li>
                Explorer API end point
                <select
                  className="explorer-selector"
                  name="explorerEndpoint"
                  value={this.state.explorerEndpoint}
                  onChange={(event) => this.setExplorerEndpoint(event)}>
                  {apiEndpoints[this.props.coin].api.map((val, index) => (
                    <option
                      key={`explorer-selector-${val}`}
                      value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </li>
            }
          </ul>
        </Modal>
      </React.Fragment>
    );
  }
}

export default SettingsModal;