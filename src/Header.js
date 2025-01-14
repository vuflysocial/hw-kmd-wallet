import React from 'react';
import './Header.scss';

const Header = ({children, vendor}) => (
  <nav
    className={`Header navbar is-fixed-top${vendor ? ' transactions-view' : ''}`}
    aria-label="main navigation">
    <div className="container">
      {children}
    </div>
  </nav>
);

export default Header;
