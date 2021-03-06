import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase.js';
import Huddle from './img/logos/huddle_logo.png';

class NavBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: []
    };
  }

  loginOrLogout() {
    // returns links to login or logout based on user status
    if (this.state.user.length===0) { //if the user has NOT logged in before, this length should be 0 (empty). Will show: Login button
      return (
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <Link to="/about" class="nav-link">About</Link>
          </li>
          <li class="nav-item">
            <Link to="/team" class="nav-link">Team</Link>
          </li>
          <li class="nav-item">
            <Link to="/login" class="nav-link">Login</Link>
          </li>
        </ul>
      )
    }
    else { //if length is not empty, the user should have already logged in. Will show: Logout and Profile buttons
      return (
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <Link to="/about" class="nav-link">About</Link>
          </li>
          <li class="nav-item">
            <Link to="/team" class="nav-link">Team</Link>
          </li>
          <li class="nav-item">
            <Link to="/profile" class="nav-link">Profile</Link>
          </li>
          <li class="nav-item">
            <Link to="/" onClick={this.logoutUser} class="nav-link">Logout</Link>
          </li>
        </ul>
      )
    }
  }

  // tell firebase to log the user out
  logoutUser() {
    auth.signOut();
  }

  //Fetch "user" from firebase. Only needed so we may know whether the user has logged in or not
  componentDidMount() {
    auth.onAuthStateChanged((userAuth) => {
        if (userAuth) { //note that we cannot simply assign "user: userAuth" because object cannot be passed
          this.setState({user: userAuth});
          //console.log(this.state.user);
        }
    });
  }

  render() {
    return(
      <nav class="navbar navbar-expand-md navbar-dark" id="board-page-nav">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse collapse dual-collapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <Link to='/' class="nav-link">Home</Link>
            </li>
            <li class="nav-item">
              <Link to='/dashboard' class="nav-link">Dashboard</Link>
            </li>
          </ul>
        </div>
        <Link class="navbar-brand d-flex mx-auto " to="/">
          <img id="logo" src={Huddle} alt={"Huddle"} />
        </Link>
        <div class="navbar-collapse collapse dual-collapse">
          {/* returns a list of links based on whether the user is logged in or out
              refer to loginOrLogout function */}
          { this.loginOrLogout() }
        </div>
      </nav>
    )
  }
}

//created class for NavLanding instead of a simple const, so we have more options such as checking user's authentication
class NavLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    }
  }

  componentDidMount () {
    auth.onAuthStateChanged((user) => {
        if (user) {
        this.setState({isLoggedIn: true});
      }
    });
  }

  logoutUser() {
    window.location.reload(); //will need to reload the page, if not, the user will think he/she's not logged out yet.
    auth.signOut();
  }

  render() {
    return(
        <nav class="navbar navbar-expand-md navbar-dark" id="board-page-nav">
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="navbar-collapse collapse dual-collapse">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <Link to='/' class="nav-link">Home</Link>
              </li>
            </ul>
          </div>

          <Link class="navbar-brand d-flex mx-auto " to="/">
            <img id="logo" src={Huddle} alt={"Huddle"} />
          </Link>
          <div class="navbar-collapse collapse dual-collapse">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <Link to="/about" class="nav-link">About</Link>
              </li>
              <li class="nav-item">
                <Link to="/team" class="nav-link">Team</Link>
              </li>
              { this.state.isLoggedIn ?
                <li class="nav-item">
                  <Link to="/" onClick={this.logoutUser} class="nav-link">Logout</Link>
                </li>
                :
                <li class="nav-item">
                  <Link to="/login" class="nav-link">Login</Link>
                </li>
              }
            </ul>
          </div>
        </nav>
    )
  }
}

export { NavBoard, NavLanding };
