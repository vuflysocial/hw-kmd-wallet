import React, {useState} from 'react';
import Modal from './Modal';
import './SettingsModal.scss';
import {
  getLocalStorageVar,
  setLocalStorageVar,
} from './lib/localstorage-util';
import {SETTINGS, VENDOR} from './constants';
import apiEndpoints from './lib/coins';
import {setConfigVar, clearPubkeysCache} from './lib/account-discovery';
import {isElectron} from './Electron';
import {writeLog} from './Debug';

// TODO: individual settings for each coin

const SettingsModal = props => {
  const initialState = {
    isClosed: true,
    theme: getLocalStorageVar('settings').theme,
    discoveryGapLimit: getLocalStorageVar('settings').discoveryGapLimit,
    discoveryAddressConcurrency: getLocalStorageVar('settings').discoveryAddressConcurrency,
    accountIndex: getLocalStorageVar('settings').accountIndex,
    explorerEndpoint: 'default',
    fwCheck: getLocalStorageVar('settings').fwCheck,
    enableDebugTools: getLocalStorageVar('settings').enableDebugTools,
    vendor: getLocalStorageVar('settings').vendor,
    sidebarSize: getLocalStorageVar('settings').sidebarSize,
    autolock: getLocalStorageVar('settings').autolock && Number(getLocalStorageVar('settings').autolock),      
    historyLength: getLocalStorageVar('settings').historyLength && Number(getLocalStorageVar('settings').historyLength),
    resetAppData: false,
    enableImportAppData: false,
    importAppDataStr: null,
    importAppDataError: false,
  };
  const [state, setState] = useState(initialState);

  const setAutoLock = e => {
    setLocalStorageVar('settings', {autolock: Number(e.target.value)});
    setState(prevState => ({
      ...prevState,
      [e.target.name]: Number(e.target.value),
    }));
  }

  const setDiscoveryConfigVar = (e, name) => {
    setState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    if (name !== 'historyLength') {
      setConfigVar(e.target.name, Number(e.target.value));
    }
    setLocalStorageVar('settings', {[e.target.name]: Number(e.target.value)});
  }

  const setVendor = e => {
    setState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    props.setVendor(e.target.value);
  }

  const setFwCheck = () => {
    setLocalStorageVar('settings', {fwCheck: !state.fwCheck});
    setState(prevState => ({
      ...prevState,
      fwCheck: !state.fwCheck,
    }));
  }

  const setEnableDebugTools = () => {
    setLocalStorageVar('settings', {enableDebugTools: !state.enableDebugTools});
    setState(prevState => ({
      ...prevState,
      enableDebugTools: !state.enableDebugTools,
    }));
  }

  const setExplorerEndpoint = e => {
    setState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    props.updateExplorerEndpoint(e);
  }

  /*const setTheme = name => {
    document.getElementById('body').className = name;
    setLocalStorageVar('settings', {theme: name});
    setState(prevState => ({
      ...prevState,
      theme: name,
    }));
  }*/

  const setSidebarSize = e => {
    setLocalStorageVar('settings', {sidebarSize: e.target.value});
    setState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    props.triggerSidebarSizeChange();
  }

  const triggerModal = () => {
    if (state.resetAppData) {
      clearPubkeysCache();
      localStorage.setItem('hw-wallet', null);
      props.resetState(true);
    }

    setState(prevState => ({
      ...prevState,
      isClosed: !state.isClosed,
      explorerEndpoint: props.explorerEndpoint,
      resetAppData: false,
      enableImportAppData: false,
      importAppDataStr: null,
      importAppDataError: false,
    }));

    props.triggerSidebarSizeChange();
  }

  const setResetAppData = () => {
    setState(prevState => ({
      ...prevState,
      resetAppData: !state.resetAppData,
    }));
  }

  const setImportAppData = () => {
    setState(prevState => ({
      ...prevState,
      enableImportAppData: !state.enableImportAppData,
    }));
  }

  const importAppData = () => {
    const checkImportFormat = state.importAppDataStr.indexOf('$250000$cbc') > -1;

    setState(prevState => ({
      ...prevState,
      importAppDataError: checkImportFormat ? false : true,
    }));

    if (checkImportFormat) {
      localStorage.setItem('hw-wallet', state.importAppDataStr);
      props.resetState('logout');
      triggerModal();
    }
  }

  const exportAppData = () => {
    const a = document.getElementById('saveModalImage');
    const appData = localStorage.getItem('hw-wallet');

    a.href = 'data:text/plain;charset=UTF-8;base64,' + btoa(appData);
    a.download = 'hw-kmd-wallet-export-app-data';
  }

  const updateInput = e => {
    setState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  const render = () => {
    const {coin, isAuth} = props;
    writeLog(coin);

    return (
      <React.Fragment>
        <div
          className="settings-modal-trigger-block"
          onClick={triggerModal}>
          <i className="fa fa-cogs"></i>
          {props.sidebarSize === 'full' &&
            <span className="sidebar-item-title">Settings</span>
          }
        </div>
        <Modal
          title="Settings"
          show={state.isClosed === false}
          handleClose={triggerModal}
          isCloseable={true}
          className="settings-modal">
          <ul>
            {isAuth &&
              <li>
                Sidebar
                <select
                  name="sidebarSize"
                  className="explorer-selector minimal"
                  value={state.sidebarSize}
                  onChange={(event) => setSidebarSize(event)}>
                  {Object.keys(SETTINGS.SIDEBAR).map((item, index) => (
                    <option
                      key={`sidebar-size-${item}`}
                      value={item}>
                      {SETTINGS.SIDEBAR[item]}
                    </option>
                  ))}
                </select>
              </li>
            }
            {isAuth &&
              <li>
                Auto-lock
                <select
                  name="autolock"
                  className="explorer-selector minimal"
                  value={state.autolock}
                  onChange={(event) => setAutoLock(event)}>
                  {Object.keys(SETTINGS.AUTOLOCK).map((item, index) => (
                    <option
                      key={`autolock-timeout-${item}`}
                      value={item}>
                      {SETTINGS.AUTOLOCK[item]}
                    </option>
                  ))}
                </select>
              </li>
            }
            {!isElectron &&
              <li>
                <span className="slider-text">Always check firmware version</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="fwCheck"
                    value={state.fwCheck}
                    checked={state.fwCheck}
                    readOnly />
                  <span
                    className="slider round"
                    onClick={setFwCheck}></span>
                </label>
              </li>
            }
            <li>
              Vendor
              <select
                name="vendor"
                className="explorer-selector minimal"
                value={state.vendor}
                onChange={(event) => setVendor(event)}>
                {Object.keys(VENDOR).map((item, index) => (
                  <option
                    key={`vendor-${item}`}
                    value={item}>
                    {VENDOR[item]}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <span className="slider-text">Enable debug controls (display xpub, raw tx hex)</span>
              <label className="switch">
                <input
                  type="checkbox"
                  name="enableDebugTools"
                  value={state.enableDebugTools}
                  checked={state.enableDebugTools}
                  readOnly />
                <span
                  className="slider round"
                  onClick={setEnableDebugTools}></span>
              </label>
            </li>
            <li>
              Address discovery gap limit
              <select
                name="discoveryGapLimit"
                className="explorer-selector minimal"
                value={state.discoveryGapLimit}
                onChange={(event) => setDiscoveryConfigVar(event, 'discoveryGapLimit')}>
                {[...Array(SETTINGS.DISCOVERY_GAP_LIMIT / 5).keys()].splice(1, SETTINGS.DISCOVERY_GAP_LIMIT / 5).map((item, index) => (
                  <option
                    key={`discovery-account-index-${index}`}
                    value={(index + 2) * 5}>
                    {index === 0 ? (index + 2) * 5 + ' (default)' : (index + 2) * 5}
                  </option>
                ))}
              </select>
            </li>
            <li>
              Address discovery concurrency limit
              <select
                name="discoveryAddressConcurrency"
                className="explorer-selector minimal"
                value={state.discoveryAddressConcurrency}
                onChange={(event) => setDiscoveryConfigVar(event, 'discoveryAddressConcurrency')}>
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
                className="explorer-selector minimal"
                value={state.accountIndex}
                onChange={(event) => setDiscoveryConfigVar(event, 'accountIndex')}>
                {[...Array(SETTINGS.ACCOUNT_INDEX_LIMIT).keys()].map((item, index) => (
                  <option
                    key={`discovery-account-index-${item}`}
                    value={index}>
                    {index === 0 ? index + ' (default)' : index}
                  </option>
                ))}
              </select>
            </li>
            <li>
              Account history max length
              <select
                name="historyLength"
                className="explorer-selector minimal"
                value={state.historyLength}
                onChange={(event) => setDiscoveryConfigVar(event, 'historyLength')}>
                {[...Array(SETTINGS.HISTORY_LENGTH_LIMIT / 10).keys()].map((item, index) => (
                  <option
                    key={`discovery-account-history-length-${index}`}
                    value={(index + 1) * 10}>
                    {index === 0 ? (index + 1) * 10 + ' (default)' : (index + 1) * 10}
                  </option>
                ))}
              </select>
            </li>
            {apiEndpoints[coin].api.length > 1 &&
              <li>
                Explorer API end point
                <select
                  className="explorer-selector minimal"
                  name="explorerEndpoint"
                  value={state.explorerEndpoint}
                  onChange={(event) => setExplorerEndpoint(event)}>
                  {apiEndpoints[coin].api.map((val, index) => (
                    <option
                      key={`explorer-selector-${val}`}
                      value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </li>
            }
            <li>
              <span className="slider-text" style={{'paddingRight': '20px'}}>Reset app data</span>
              <label className="switch">
                <input
                  type="checkbox"
                  name="resetAppData"
                  value={state.resetAppData}
                  checked={state.resetAppData}
                  readOnly />
                <span
                  className="slider round"
                  onClick={setResetAppData}></span>
              </label>
              {state.resetAppData &&
                <p>
                  <small>
                    <strong>Warning:</strong> "Reset app data" will delete all cached data so you will have to go through KMD HW Wallet setup again!
                  </small>
                </p>
              }
            </li>
            <li>
              <span className="slider-text" style={{'paddingRight': '20px'}}>Import app data</span>
              <label className="switch">
                <input
                  type="checkbox"
                  name="enableImportAppData"
                  value={state.enableImportAppData}
                  checked={state.enableImportAppData}
                  readOnly />
                <span
                  className="slider round"
                  onClick={setImportAppData}></span>
              </label>
              {state.enableImportAppData &&
                <React.Fragment>
                  <textarea
                    className="settings-modal-import-area"
                    rows="5"
                    cols="33"
                    name="importAppDataStr"
                    placeholder="Paste import data here"
                    value={state.importAppDataStr}
                    onChange={updateInput}></textarea>
                  <p>
                    <small>
                      <strong>Warning:</strong> pressing on "Import app data" button will override all cached data!
                    </small>
                  </p>
                  {state.importAppDataError &&
                    <p>
                      <small>
                        <strong>Error:</strong> app data import format is wrong!
                      </small>
                    </p>
                  }
                  <button
                    className="button"
                    onClick={importAppData}
                    disabled={!state.importAppDataStr}>
                    Import app data
                  </button>
                </React.Fragment>
              }
            </li>
            {!state.enableImportAppData &&
              <li>
                <a
                  href="!#"
                  id="saveModalImage"
                  onClick={exportAppData}>
                  <button className="button">
                    Export app data
                  </button>
                </a>
              </li>
            }
          </ul>
          <div className="modal-action-block right">
            <button
              onClick={triggerModal}
              className="button is-primary">
              OK
            </button>
          </div>
        </Modal>
      </React.Fragment>
    );
  }

  return render();
}

export default SettingsModal;