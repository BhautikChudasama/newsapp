import React, { Component } from 'react';
import Header from "./header/header";
import News from "./news/news"
import './App.css';
import menu from "./images/baseline-menu-24px.svg";
import homeIcon from "./images/round-home-24px.svg";
import savedIcon from "./images/round-favorite-24px.svg";
import saveDataIcon from "./images/round-flash_on-24px.svg";
import notificationIcon from "./images/round-notifications-24px.svg";
import homeScreenIcon from "./images/round-add_to_home_screen-24px.svg";
import doneIcon from "./images/round-done_outline-24px.svg";
import reloadIcon from "./images/round-autorenew-24px.svg";
import Hammer from "hammerjs";
import NewsDescription from "./newsDescription/newsDescription";
import { Router, Route, Link } from 'react-router-dom'
import history from "./history.js";
import Saved from './Saved/saved';
import gIcon from "./images/g.svg";
import * as firebase from "firebase";
import 'firebase/auth';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      dataSaver: null,
      notificationEnable: false,
      uptodate: false,
      isAuth: false,
      isDesc: null,
      waitAuth: false,
      user: null,
      dn: false,
    }
  }
  
  r;
  componentDidMount() {
    var config = {
      apiKey: "AIzaSyB1d-dYpNywbFpFeASO_2NXpu-1JWN3RUU",
      authDomain: "firetestondiwali.firebaseapp.com",
      databaseURL: "https://firetestondiwali.firebaseio.com",
      projectId: "firetestondiwali",
      storageBucket: "firetestondiwali.appspot.com",
      messagingSenderId: "480687354738"
    };
    firebase.initializeApp(config);
    this.setState({
      waitAuth: true
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({user: user, isAuth: true, waitAuth: false});
      } else {
        this.setState({waitAuth: false});
      }
    });

    var explore = document.querySelector(".explore");
    var manager = new Hammer(explore);
    manager.on("panup", (e)=> {
      console.log("top" + e.center.y)
     explore.style = `transform: translateY(-${e.center.y});`;
    })
    manager.on("pandown", (e) => {
      console.log(e);
      console.log("bottom" + e.center.y)
      if(e.center.y==0) {
        this.closeMenu();
      }
      else {
     explore.style = `transform: translateY(${e.center.y});`;
     this.closeMenu();
      }
    })
     if ('serviceWorker' in navigator) {
       window.addEventListener('load', () => {
         navigator.serviceWorker.register('/sw.js')
           .then(registration => {
             if (registration.waiting) {
               // waiting 
               this.r = registration;

              this.setState({uptodate: false});

             } else {
               this.setState({
                 uptodate: true
               });
               console.log(`Service Worker registered! Scope: ${registration.scope}`);
             }
           })
           .catch(err => {
             console.log(`Service Worker registration failed: ${err}`);
           });
       });
       if(localStorage.getItem("ne")=="true") {
         this.setState({"notificationEnable": true})
       }
       else if (localStorage.getItem("ne") == "d") {
           this.setState({
             "notificationEnable": false,
             dn: true
           })
       }
     }
  
    window.addEventListener("scroll", this.handleScroll.bind(this));
    if (localStorage.getItem("dsm") == "true") {
      this.setState({ "dataSaver": true })
    }
      if(window.location.pathname == "/") {
      this.setState({
        isDesc: false
      }) }
      else {
       this.setState({
        isDesc: true
      });
    }
  }

  handleUpdate = () => {
        //       registration.waiting.postMessage('skipWaiting');
        if(this.r) {
          this.r.waiting.postMessage('skipWaiting');
        }
      
      window.location.reload();
  }

  prevStatus = 0;

  handleScroll = (e) => {
      //...
      setTimeout(()=> {
          this.prevStatus = window.scrollY;
      }, 250)
      
      if (this.prevStatus < 72) {
          if(window.location.pathname=="/") {
            document.querySelector(".headerMain").style = "position: relative";
          }
         
      }
      else {
        if (this.prevStatus > window.scrollY) {
          if(window.location.pathname=="/") {
            document.querySelector(".headerMain").style = `position: sticky;top:0;animation: scroll 250ms;`;
          }
          
        }
        else {
          if(window.location.pathname=="/") {
            document.querySelector(".headerMain").style = "display: none";
          }
          else {
            document.querySelector(".header").style="display:  flex;"
          }
        }

      }
  }
  closeMenu = () => {
    if(this.state.menuOpen) {
      this.setState({ menuOpen: false });
      document.body.style = "overflow-y: scroll";
      // document.querySelector(".newsMain").style = "position: relative;top: 0px;"
      
    }
  }
  openMenu = () => {
    this.setState({ menuOpen: true });
    document.body.style = "overflow: hidden";
    // document.querySelector(".newsMain").style = "position: relative;"
  }
  saveData = () => {
    let dsmStatus = localStorage.getItem("dsm");
    // get data saver
    if(dsmStatus==null) {
      // first time
      localStorage.setItem("dsm", true)
      this.setState({"dataSaver": true});
    }
    else {
      // if already
     if(localStorage.getItem("dsm")=="true") {
      localStorage.setItem("dsm", false)
      this.setState({"dataSaver": false});
     }
     else {
       // not true
      localStorage.setItem("dsm", true)
      this.setState({"dataSaver": true});
     }
    }
  }
  askPermission = () => {
    return new Promise((res, reject)=>{
      Notification.requestPermission()
      .then((r)=> {
        res(r)
      })
      .catch((e)=> {
        reject("reject")
      })
    })
  }
  
  handleNotification = () => {
    if(this.state.notificationEnable) {
      // send req to server to remove push key.
      localStorage.setItem("ne", false);
      this.setState({notificationEnable: false});
    }
    else {
    this.askPermission()
    .then((r)=>{
      if(localStorage.getItem("ne")=="true") {
        localStorage.setItem("ne", false);
        this.setState({ notificationEnable: false });
        console.log("ENABLE");
      }
      else {
        localStorage.setItem("ne", "d");
        this.setState({ notificationEnable: false });
         this.setState({
           dn: true
         });
      }
    })
    .catch((e)=>{
     
      localStorage.setItem("ne", false);
    })
    }
  }
  
  letSign() {
    this.setState({waitAuth: true});
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then((result) => {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // ...
      }
      // The signed-in user info.
      var user = result.user;
      this.setState({waitAuth: false});
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      this.setState({
        waitAuth: false
      });
    });
  }
  logOut() {
    this.setState({
      waitAuth: true,
      isAuth: true
    });
    firebase.auth().signOut().then(()=> {
     this.setState({
       waitAuth: false,
       isAuth: false
     });
    },  ()=> {
      this.setState({
        waitAuth: false,
        isAuth: true
      });
    });
  }
  render() {
   
    const backMenu = {
      transform: "translateY(100%)"
    }
    const forwardMenu = {
      transform: "translateY(0)"
    }
    const none = {
      display: "none"
    }
    const fix = {
      position: "absolute",
      overflow: "hidden"
    }
    const headMove = {
      position: "relative",
      left: "11px",
      background: "#1565C0"
    }
    const pathMove = {
      background: "#95baf8"
    }
   
    return (
      <>
      <div className="app" style={this.state.menuOpen ? fix : null}>
      <div className="exploreBackground" onClick={()=>this.closeMenu()} style={this.state.menuOpen?null:none}></div>
          <Router history={history}>
            <div>
            <Route path="/" component={News} exact></Route>
            <Route path="/:headline/e/:id" component={NewsDescription}></Route>
            <Route path="/saved" component={Saved}></Route>
            </div>
          </Router>
        
          <button className="menuButton" onClick={() => this.openMenu()} style={this.state.menuOpen ? none : null}><img src={menu} alt="menu" alt="menu"/><span>Explore</span></button>
        <div className="explore" style={this.state.menuOpen?forwardMenu:backMenu}>
          <div className="exploreInner">
            <div className="exploreList">
            {
              this.state.waitAuth?<div className="progress" style={{right: "8px"}}>
                  <div className="indeterminate"></div>
              </div>
              : null
            }
              <div className="exploreProfile">
                {
                  this.state.isAuth?<div className="signed"><div><img className="profileImage" style={{border: "2px solid blue"}} src={this.state.user.photoURL}></img><div style={{paddingLeft: "12px"}}>{this.state.user.displayName}</div></div><button className="signOut" style={{marginRight: "17px"}} onClick={(e)=> this.logOut()}>Logout</button></div>
                  : 
                      <div className="notSignin" onClick={(e)=>this.letSign()}><img style={{background: "transparent"}} src={gIcon} className="profileImage notSign" alt="profile photo"></img> <div style={{ paddingLeft: "12px" }}>Signin with Google</div></div>
                }
                </div>
                <Router history={history}><Link to="/" className="othermenubutton"><span className="menuIcon" style={{padding: "0 6px"}}><img src={homeIcon} alt="Home"></img></span><span style={{ paddingLeft: "16px" }}>Home</span></Link></Router>
                <Router history={history}><Link to = "/saved" menu={(e)=>this.closeMenu()} className="othermenubutton" style={{padding: "0 6px"}}><span className="menuIcon"><img src={savedIcon} alt="offline"></img></span><span style={{ paddingLeft: "16px" }}>Saved</span></Link></Router>
                <button className="othermenubutton bb notPlusIcon" onClick={() => this.saveData()}><div><span className="menuIcon"><img src={saveDataIcon} alt="Data saving"></img></span><span style={{ paddingLeft: "16px" }}>Data Saving mode</span></div><div className="switch"><div className="switchHead" style={this.state.dataSaver ? headMove : null}></div><div className="switchPath" style={this.state.dataSaver ? pathMove : null}></div></div></button>
                <button className="othermenubutton notPlusIcon" onClick={() => this.handleNotification()}><div><span className="menuIcon"><img src={notificationIcon} alt="Notification"></img></span><span style={{ paddingLeft: "16px" }}>Allow Notifications</span></div><div className="switch"><div className="switchHead" style={this.state.notificationEnable ? headMove : null}></div><div className="switchPath" style={this.state.notificationEnable ? pathMove : null}></div></div></button>
                {
                  this.state.dn?<div class="disableNotification">Please unblock notifications from browser settings</div>: null
                }
                <button className="othermenubutton bb" onClick={()=>this.handleUpdate()}><span className="menuIcon"><img src={this.state.uptodate?doneIcon:reloadIcon} alt="Reaload"></img></span><span style={{ paddingLeft: "16px" }}>{this.state.uptodate ? "Version 2.2.0": "Reload to Update"}</span></button>
                <button className="othermenubutton"><span className="menuIcon"></span><span style={{ paddingLeft: "16px" }}>Your credentials will be deleted after 24 hours.</span></button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default App;
