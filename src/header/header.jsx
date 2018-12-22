import React from "react";
import "./header.css";


import { Router, Route, Link } from 'react-router-dom';
class Header extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            shadow: 0,
            position: "relative",
            top: 0,
            isDesc: false,
            
            show: false
        }
    }
    
    async r() {
       await this.setState({ position: "sticky", top: 0 })
    }
    handleShadow() {
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
   
    
    backToHome = () => {
        
    }
    render() {
      return (
          <>
            
          <div className={this.state.isDesc?"header":"headerMain"} ref={this.state.isDesc?null:"header"} style={this.state.isDesc?{display: "flex", top: "0px"}:null}>
            <div>
                newapp
            </div> 
        </div>
        </>
    )
      }
};

export default Header;