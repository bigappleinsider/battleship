import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Link } from 'react-router';

class Header extends Component {
  renderMainNavLinks() {
    if(this.props.authenticated) {
      return (
        <ul className="nav navbar-nav">
          <li><Link to="/questionaire">Questionaires</Link></li>
        </ul>
      );
    }
  }
  renderAuthLinks() {
    if (this.props.authenticated) {
      return (
        <li className="nav-item">
          <Link className="nav-link" to="/signout">Sign out</Link>
        </li>
      );
    } else {
      return [
        <li className="nav-item" key={1}>
          <Link className="nav-link" to="/signin">Sign in</Link>
        </li>,
        <li className="nav-item" key={2}>
          <Link className="nav-link" to="/signup">Sign up</Link>
        </li>
      ];
    }
  }
  render() {
    console.log("navbar", this.props);
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">

          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Survey Master</a>
          </div>

          <div id="navbar" className="collapse navbar-collapse">
            {this.renderMainNavLinks()}
            <ul className="nav navbar-nav navbar-right">
              {this.renderAuthLinks()}
            </ul>
          </div>

        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  console.log("nav mapStateToProps", state);
  return {
    authenticated: state.auth.authenticated,
    user: state.user
  };
}

export default connect(mapStateToProps)(Header);
