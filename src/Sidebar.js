import React from 'react';
import AboutModal from './AboutModal';

class Sidebar extends React.Component {
  state = this.initialState;
  
  get initialState() {
    return {
    };
  };

  render() {
    console.warn(this.props);
    
    return (
      <div className="sidebar-right">
        <ul>
          <li>
            <a href="https://github.com/pbca26/hw-kmd-wallet/issues/new"><i className="fa fa-life-ring"></i></a>
          </li>
          <AboutModal />
        </ul>
      </div>
    );
  }
}

export default Sidebar;