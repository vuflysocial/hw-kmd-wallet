import React from 'react';
import Modal from './Modal';
import './SettingsModal.scss';
import {
  setLocalStoragePW,
  decodeStoredData,
  resetLocalStorage,
} from './lib/localstorage-util';
import {isElectron} from './Electron';

class LoginModal extends React.Component {
  state = this.initialState;
  
  get initialState() {
    this.updateInput = this.updateInput.bind(this);
    this.close = this.close.bind(this);
    this.reset = this.reset.bind(this);
    
    return {
      isClosed: false,
      password: null,
      error: false,
    };
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });

    /*setTimeout(() => {
      console.warn('this.state', this.state);
    }, 100);*/
  }

  close() {
    setLocalStoragePW(this.state.password);
    
    if (!localStorage.getItem('hw-wallet')) {
      this.props.closeLoginModal(this.state.password);
      
      this.setState({
        password: null,
      });
    } else {
      decodeStoredData().then((res) => {
        if (res) {
          this.props.closeLoginModal(this.state.password);
          
          this.setState({
            password: null,
          });
        } else {
          this.setState({
            error: true,
          });
        }
      });
    }
  }

  reset() {
    this.setState({
      password: null,
    });

    resetLocalStorage();
  }

  render() {
    return (
      <React.Fragment>
        <Modal
          title={!localStorage.getItem('hw-wallet') ? 'Create password' :  'Authorization'}
          show={this.props.isClosed === false}
          isCloseable={false}
          className="settings-modal">
          Password <input
            style={{'marginLeft': '10px','padding': '5px', 'width': 'calc(100% - 100px)'}}
            type="password"
            className="form-control edit"
            name="password"
            onChange={this.updateInput}
            value={this.state.password}
            placeholder={!localStorage.getItem('hw-wallet') ? 'Create a password to encrypt app data' : 'Enter a password to unlock the app'}
            autoComplete="off"
            required />
          <p style={{'paddingTop': '20px'}}>Password is required in order to safely store and recover sensitive data such as XPUB keys, cached address transactions and balances.</p>
          {this.state.error &&
            <React.Fragment>
              <p className="login-error">Unable to decrypt, please try again or reset password.</p>
              <p>
                <strong>Warning:</strong> "Reset password" button will delete all cached data so you will have to go through KMD HW Wallet setup again!
              </p>
            </React.Fragment>
          }
          <div className="modal-action-block left">
            <button
              className="button is-primary"
              onClick={this.close}>
              OK
            </button>
            {this.state.error &&
              <button
                style={{'float': 'right'}}
                className="button del-btn"
                onClick={this.reset}>
                Reset password <i className="fa fa-trash"></i>
              </button>
            }
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default LoginModal;