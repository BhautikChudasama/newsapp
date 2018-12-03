import React from "react";
import "./header.css";
import History from "../history";
import closeIcon from "../images/round-close-24px (1).svg";
import unfillheart from "../images/round-favorite_border-24px.svg";
import filledHeart from "../images/liked.svg";
import { Router, Route, Link } from 'react-router-dom';
class Header extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            shadow: 0,
            position: "relative",
            top: 0,
            isDesc: false,
            hasLike: false,
            show: false
        }
    }
    
    componentWillMount() {
        // call every 100ms
        setInterval(()=> {
            if (window.location.pathname == "/") {
                this.setState({ isDesc: false })
            }
            else {
                this.setState({ isDesc: true })
            }
        }, 100);
    }
    async r() {
       await this.setState({ shadow: "0px 2px 5px 0 rgba(0,0,0,0.5);", position: "sticky", top: 0 })
    }
    handleShadow() {
        console.log("call");
        this.r();
    }
    componentDidMount() {
        var io = new IntersectionObserver((entities)=> {
            this.handleShadow();
        },
        {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        });
        if(!(this.state.isDesc)) {
            io.observe(this.refs.header);
        }
    }
    showSB() {
        this.setState({show: true});
        setTimeout(()=> {
            this.setState({ show: false }); 
        }, 2000)
    }
    saveToOffline() {
        // URL...
        // params...
        if(this.state.hasLike) {
            this.setState({ hasLike: false });
        }
        else {
            this.setState({ hasLike: true }); 
            this.showSB();
        }
    }
    backToHome = () => {
        
    }
    render() {
      return (
          <>
            <div className="snackbar" ref="sb" style={this.state.show?{display: "flex"}:{display: "none"}}>
                Saved offline successfully
            </div>
          <div className={this.state.isDesc?"header":"headerMain"} ref={this.state.isDesc?null:"header"} >
            {
                  this.state.isDesc ?
                  <>
                              <Router history={History}> 
                              
                                  <div><Link to="/"><button className="closeButton" title="Close" ><img src={closeIcon} alt="" srcset="" /></button></Link></div>
                                      
                                     
                                  </Router>
                          <button className="closeButton" title="Save to offline" onClick={(e) => this.saveToOffline()}><img src={this.state.hasLike ? filledHeart : unfillheart} alt="like" className="like" /></button>   
                    
                       
                    
                     
                      </>
                  : <div>
                      newapp
            </div>
            }
            
        </div>
        </>
    )
      }
};

export default Header;