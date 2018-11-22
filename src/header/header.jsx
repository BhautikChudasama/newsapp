import React from "react";
import "./header.css";
import { relative } from "path";

class Header extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            shadow: 0,
            position: relative,
            top: 0
        }
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
        io.observe(this.refs.header);
    }
    render() {
      return (
          <div className="header" ref="header" style={{ boxShadow: this.state.shadow, position: this.state.position, top: this.state.top }}>
            <div>
                Newsapp
            </div>
        </div>
    )
      }
};

export default Header;