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
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      dataSaver: null,
      notificationEnable: false,
      uptodate: false
    }
  }
  r;
  componentDidMount() {
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
     }
  
    window.addEventListener("scroll", this.handleScroll.bind(this));
    if (localStorage.getItem("dsm") == "true") {
      this.setState({ "dataSaver": true })
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
 
      setTimeout(()=> {
          this.prevStatus = window.scrollY;
      }, 250)
      
      if (this.prevStatus < 72) {
          document.querySelector(".header").style = "position: relative";
      }
      else {
        if (this.prevStatus > window.scrollY) {
          document.querySelector(".header").style = `position: sticky;top:0;animation: scroll 250ms;`;
        }
        else {
          document.querySelector(".header").style = "display: none";
        }

      }
  }
  closeMenu = () => {
    if(this.state.menuOpen) {
      document.body.style = "overflow: scroll";
      document.querySelector(".newsMain").style = "position: relative;top: 0px;"
      this.setState({ menuOpen: false });
    }
  }
  openMenu = () => {
    document.body.style = "overflow: hidden";
    document.querySelector(".newsMain").style = "position: relative;"
    this.setState({ menuOpen: true });
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
      }
      else {
        localStorage.setItem("ne", true);
        this.setState({ notificationEnable: true });
      }
    })
    .catch((e)=>{
      localStorage.setItem("ne", false);
    })
    }
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
        <Header />
        <News />
          <button className="menuButton" onClick={() => this.openMenu()} style={this.state.menuOpen ? none : null}><img src={menu} /><span>Explore</span></button>
        <div className="explore" style={this.state.menuOpen?forwardMenu:backMenu}>
          <div className="exploreInner">
            <div className="exploreList">
              <div className="exploreProfile">
                <div className="profileImage"></div><div style={{paddingLeft: "12px"}}>Bhautik Chudasama</div>
              </div>
                <button className="othermenubutton"><span className="menuIcon"><img src={homeIcon}></img></span><span style={{ paddingLeft: "16px" }}>Home</span></button>
                <button className="othermenubutton"><span className="menuIcon"><img src={savedIcon}></img></span><span style={{ paddingLeft: "16px" }}>Saved</span></button>
                <button className="othermenubutton bb notPlusIcon" onClick={() => this.saveData()}><div><span className="menuIcon"><img src={saveDataIcon}></img></span><span style={{ paddingLeft: "16px" }}>Data Saving mode</span></div><div className="switch"><div className="switchHead" style={this.state.dataSaver ? headMove : null}></div><div className="switchPath" style={this.state.dataSaver ? pathMove : null}></div></div></button>
                <button className="othermenubutton notPlusIcon" onClick={() => this.handleNotification()}><div><span className="menuIcon"><img src={notificationIcon}></img></span><span style={{ paddingLeft: "16px" }}>Allow Notifications</span></div><div className="switch"><div className="switchHead" style={this.state.notificationEnable ? headMove : null}></div><div className="switchPath" style={this.state.notificationEnable ? pathMove : null}></div></div></button>
                <button className="othermenubutton bb"><span className="menuIcon"><img src={homeScreenIcon}></img></span><span style={{ paddingLeft: "16px" }}>Add to Homescreen</span></button>
                <button className="othermenubutton" onClick={()=>this.handleUpdate()}><span className="menuIcon"><img src={this.state.uptodate?doneIcon:reloadIcon}></img></span><span style={{ paddingLeft: "16px" }}>{this.state.uptodate ? "Version 2.2.0": "Reload to Update"}</span></button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default App;
