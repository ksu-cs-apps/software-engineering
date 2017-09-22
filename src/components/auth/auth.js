import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import * as firebase from 'firebase';

/** @class Auth
  * Auth tool for logging users into the app
  * through GitHub, and saves the GitHub auth
  * token in the sessionStorage as 'GitHubToken'
  */
export default class Auth extends Component {
  /** @constructor
    * Builds a new instance of Auth.
    */
  constructor(props) {
    super(props);
    this.state = {
      user: firebase.auth().currentUser,
      token: sessionStorage.getItem('GitHubToken')
    }
    this.handleSignin = this.handleSignin.bind(this);
    this.handleSignout = this.handleSignout.bind(this);
  }
  /** @method handleSignin
    * Signs the user in with GitHub Oauth,
    * and saves the token to sessionStorage
    * as 'GitHubToken'.
    */
  handleSignin() {
    // Using a redirect.
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        console.log(result.crediential)
        // This gives you a GitHub Access Token.
        var token = result.credential.accessToken;
        // Save the GitHub Access Token in the session store
        sessionStorage.setItem('GitHubToken', token);
        // Save the user to the state
        this.setState({user: result.user});
      }
      var user = result.user;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have signed up with a different provider for that email.');
        // Handle linking here if your app allows it.
      } else {
        console.error(error);
      }
    });

    // Start a sign in process for an unauthenticated user.
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('repo');
    firebase.auth().signInWithPopup(provider).then((result) => {
       // This gives you a GitHub Access Token.
       var token = result.credential.accessToken;
       sessionStorage.setItem('GitHubToken', token);
       // The signed-in user info.
       var user = result.user;
       this.setState({
         user: user,
         token: token
       });
       window.location.reload();
     }).catch(function(error) {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       // The email of the user's account used.
       var email = error.email;
       // The firebase.auth.AuthCredential type that was used.
       var credential = error.credential;
       if (errorCode === 'auth/account-exists-with-different-credential') {
         alert('You have signed up with a different provider for that email.');
         // Handle linking here if your app allows it.
       } else {
         console.error(error);
       }
     });
  }
  /** @method handleSignout
    * Signs the user out of Firebase and GitHub
    */
  handleSignout() {
    sessionStorage.clear();
    firebase.auth().signOut();
    this.setState({user: null, token: null});
    window.location.reload();
  }
  /** @method render
    * Renders a login/logout icon.
    */
  render() {
    if(this.state.token) {
      return (
        <button className="btn" onClick={this.handleSignout}>
          Sign Out
          <FontAwesome name="sign-out" />
        </button>
      );
    } else {
      return (
        <button className="btn" onClick={this.handleSignin}>
          Sign In
          <FontAwesome name="sign-in" />
        </button>
      );
    }
  }
}
