import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { NavLanding } from './Nav.js'
import { Link } from 'react-router-dom'
import "./Login.css";
import firebase, { auth, provider } from './firebase.js';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      company: "",
      error: false, //extra 2 variables for handling & passing error's state and message
      errorMsg: ""
      // db: ""
    };

    this.googleLogin = this.googleLogin.bind(this);
  }

  componendDidMount() {
    // changes title of browser tab
    document.title = "Huddle Register";
  }

  // Checks if all Components are filled with something
  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0 /*&& this.state.company.length > 0*/;
  }

  // Handles a State Change upon a user's input */}
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  //If there is error during login/register, pull out the error inside render
  validateErrorForm() {
    return this.state.error;
  }

  // Don't Refresh the page upon each state change
  handleSubmit = event => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((user) => {
      //console.log("Register console log:");
      this.setState({user:user, error: false}); //set the "user" state after successfully log in. No errors.
      user.updateProfile({'displayName': document.getElementById("name").value});
      // console.log(user);

      var databaseCentral = firebase.database().ref('listOfUsers/'+this.state.user.uid)
      // Pushing user to database
      //console.log(this.state.user.uid)
      const userList = {
        user: this.state.user.uid,
        userEmail: this.state.user.email
      }

      databaseCentral.set(userList);

      this.props.history.push('/dashboard');//redirecting the user to the dashboard
    })
    .catch(e => {
      this.setState({error: true});
      this.setState({errorMsg: "Error code: " + e})
    });
  }

  // Functions for logging in through Google account
  googleLogin() {
    auth.signInWithPopup(provider)
    .then((result) => {
      this.setState({user:result.user, error: false}); //set the "user" state after successfully log in. No errors.

      //-------------If user has never login before aka register---------------
      var databaseCentral = firebase.database().ref('listOfUsers/'+this.state.user.uid)
      // Pushing user to database
      //console.log(this.state.user.uid)
      const userList = {
        user: this.state.user.uid,
        userEmail: this.state.user.email
      }

      databaseCentral.update(userList);
      //------------------------------
      this.props.history.push('/dashboard');//redirecting the user to the dashboard
      //!!!!!! need to save the user's token HERE !!!!!!
    })
    .catch(e => {
      this.setState({error: true});
      if(e.code==="auth/wrong-password") this.setState({errorMsg: "Wrong password!"})
      else if(e.code==="auth/user-not-found") this.setState({errorMsg: "Email is not found!"})
      else this.setState({errorMsg: "Error code: "+e.code})
    })
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
        <div id="particles-js"></div>
        <NavLanding />
        <br /><br />

        <form onSubmit={this.handleSubmit}>
		<ControlLabel><b>Wanna test Huddle?</b> Use guest login!</ControlLabel><br />
		<ControlLabel>Email login: <b>guest@guest.com</b></ControlLabel><br />
		<ControlLabel>Password: <b>helloguest</b></ControlLabel><br /><br />
          <FormGroup controlId="name" bsSize="large">
            <ControlLabel>Display Name</ControlLabel>
            <FormControl
              autoFocus
              type="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
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
          <FormGroup controlId="company" bsSize="large">
            <ControlLabel>Company</ControlLabel>
            <FormControl
              value={this.state.company}
              onChange={this.handleChange}
              type="company"
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
            Register
          </Button>

          <Button
          block
          bsSize="large"
          className="GoogleLogin"
          onClick={this.googleLogin}
         >Login with Google account</Button>

          <Link to='/login' id="LoginFooter">Login here!</Link>
        </form>
      </div>
    );
  }
}

export { Register }
