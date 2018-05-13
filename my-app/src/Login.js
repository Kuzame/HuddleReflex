import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { NavLanding } from './Nav.js'
import { Link } from 'react-router-dom'
import "./Login.css";
import firebase, { auth, provider } from './firebase.js';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      email: "",
      password: "",
      company: "",
      error: false, //extra 2 variables for handling & passing error's state and message
      errorMsg: "",
    };

    this.googleLogin = this.googleLogin.bind(this);
  }

  componendDidMount() {
    // changes title of browser tab
    document.title = "Huddle Login";
  }

  // Checks if all Components are filled with something
  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  // Handles a State Change upon a user's input
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  //If there is error during login/register, pull out the error inside render
  validateErrorForm() {
    return this.state.error;
  }

  //If the user has logged in successfully. Will be called by either Google login or regular login
  successfulLogin(result) {
      this.setState({user:result.user, error: false}); //set the "user" state after successfully log in. No errors.
  }

  //If an error is caught during the login process. Will be called by either Google login or regular login
  errorLogin(e) {
    this.setState({error: true}); //There's an error, this will make the "error etc" text visible on render
    if(e.code==="auth/wrong-password") this.setState({errorMsg: "Invalid password"})
    else if(e.code==="auth/user-not-found") this.setState({errorMsg: "Email is not found. Click \"Register here\" to register."})
    else this.setState({errorMsg: "Error code: "+e.code})
  }

  // Functions for logging in through Google account
  googleLogin() {
    auth.signInWithPopup(provider) //Calls google login's API
    .then((result) => {
      this.successfulLogin(result);
      //-------------If user has never login before aka register---------------
      var databaseCentral = firebase.database().ref('listOfUsers/'+this.state.user.uid)
      // Pushing user to database
      //console.log(this.state.user.uid)
      const userList = {
        user: this.state.user.uid,
        userEmail: this.state.user.email
      }

      databaseCentral.update(userList);
      this.props.history.push('/dashboard');//redirecting the user to the dashboard

      //------------------------------
    })
    .catch(e => {
      this.errorLogin(e);
    });
  }

  // Don't Refresh the page upon each state change <--- basically the normalLogin, but will be executed from whoever specify type=submit
  handleSubmit = event => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(this.state.email, this.state.password) //Passes the email & password to be verified by Firebase
    .then((result) => {
      this.successfulLogin(result);
      this.props.history.push('/dashboard');//redirecting the user to the dashboard

    })
    .catch(e => {
      this.errorLogin(e);
    });
  }

  //----------Checks if the user is previously logged in
  componentWillMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({user});
        this.props.history.push('/dashboard');//redirecting the user to the dashboard
      }
    });
  }

  render() {
    return (
      <div className="Login">
        <NavLanding />
        <br /><br />

        <form onSubmit={this.handleSubmit}>
		<ControlLabel><b>Wanna test Huddle?</b> Use guest login!</ControlLabel><br />
		<ControlLabel>Email login: <b>guest@guest.com</b></ControlLabel><br />
		<ControlLabel>Password: <b>helloguest</b></ControlLabel><br /><br />
          <FormGroup controlId="email" bsSize="large">
			
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>

          {/*-- If there is any error message during the log in process, this will pop up */}
          { this.validateErrorForm() && <span style={{color: "red", fontSize: "0.8rem", marginBottom: "12px"}}>{this.state.errorMsg}</span> }

          <Button
            block
            bsSize="large"
            className="Submit"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
          <Button
            block
            bsSize="large"
            className="GoogleLogin"
            onClick={this.googleLogin}
	         >Login with Google account</Button>
          <Link to='/register' id="LoginFooter">Register here!</Link>
        </form>


</div>
    );
  }
}

export { Login }
