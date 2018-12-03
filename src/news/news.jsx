import React, {Component} from "react";
import HomeSkeleton from "../skeletons/home";
import "./news.css";
import noData from "../images/undraw_before_dawn_bqrj.svg";
import { Link } from "react-router-dom";
export default class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            news: [],
            error: false,
            load: false,
            reload: false
        }
       
    }
    
    handleObserver = () => {
        fetch("https://newsap-frtstondwali.glitch.me/news")
            .then((res) => res.json())
            .then((json) => {
                this.setState({ news: [...this.state.news, ...json], loaded: true });
                console.log(this.state.news.length);
            })
            .catch((err) => this.setState({ loaded: true, error: true}));
    }
    componentDidMount() {       
        fetch("https://newsap-frtstondwali.glitch.me/news")
        .then((res)=>res.json())
        .then((json)=>{
            this.setState({news: json, loaded: true});
        })
        .catch((err)=> {
            document.querySelector(".loading").style = "display: none";
            this.setState({loaded: true, error: true, reload: true})
        });

        var io = new IntersectionObserver(entries => {
            /* ... */
            this.handleObserver();
        }, {
                root: null,
                rootMargin: "0px",
                threshold: 1.0
            });
        io.observe(this.refs.loading);
    }
    reload = () => {
        window.location.reload();
    }
    render() {
        return (
            <div ref="newsMain" className="newsMain">
            {
                this.state.loaded ? null : <HomeSkeleton />
            }
            {
                    this.state.news.length > 0 ? this.state.news.map((n, i) => {
                        return (
                            <Link to={"/"+n.title+"/e/"+i}>
                            <div id={i} className="news">
                                <div className="newsInner">
                                    <img src="https://img1a.flixcart.com/www/linchpin/batman-returns/images/fk-default-image-75ff34.png" class="newsImage"></img>
                                    <div>
                                    <div className="newsTitle">{n.title}</div>
                                    <div className="newsDesc">{n.desc}</div>
                                </div>
                                </div>
                            </div>
                            </Link>
                        )
                    }) : null
            }
            {
                this.state.error ?
                    <div className="offline">
                        <div>
                        <img src={noData} className="nodataimage"></img>
                        </div>
                        There Is No Internet Connection!
                    </div>
                :null
            }
                    <div ref="loading" className="loading">
                        <div className="loader"></div>
                    </div>
                    {
                        this.state.reload?
                        <div className="reloadArea">
                        <div>
                            <ul>
                                <li>Checking the network cables, modem and router</li>
                                <li>Reconnecting to Wi-Fi</li>
                            </ul>
                            </div>
                        <button className="reload" onClick={(e)=>this.reload()}>
                        RETRY
                        </button>
                        </div>: null
                    }
            </div>
        );
    }
}