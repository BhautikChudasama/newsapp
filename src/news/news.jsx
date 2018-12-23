import React, {Component} from "react";
import HomeSkeleton from "../skeletons/home";
import "./news.css";
import noData from "../images/undraw_before_dawn_bqrj.svg";
import { Link } from "react-router-dom";
import Header from "../header/header";
import Newsplaceholder from "../images/newsplaceholder.png";
export default class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            news: [],
            error: false,
            load: false,
            reload: false,
            IsDataSaver: false,
            end: false,
            processing: true
        }
       
    }
    lts;
    handleObserver = () => {
        if(this.state.processing) {   
            return ;
        }     
        else {
        if (localStorage.getItem("dsm") == "true") {
            this.setState({ IsDataSaver: true });
        }
        else {
            this.setState({ IsDataSaver: false });
        }
        if(this.lts==0) {
            return ;
        }
        else {
            fetch(`https://newsap-frtstondwali.glitch.me/fetch/?lts=${this.lts}`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({processing: false})
                    if(json.length==0) {
                    this.setState({end: true});
                    document.querySelector(".loading").style = "display: none";
                    }
                    else {
                        this.lts = json[json.length - 1].data.ts;
                        this.setState({ news: [...this.state.news, ...json], loaded: true });
                    }
                })
                .catch((err) => {console.log(err);this.setState({ loaded: true, error: true})});
            }
        }
    }
    componentDidMount() {   
        if(localStorage.getItem("dsm")=="true") {
            this.setState({IsDataSaver: true});
        }    
        else {
            this.setState({ IsDataSaver: false });
        }
        fetch("https://newsap-frtstondwali.glitch.me/fetch/?lts")
            .then((res) => res.json())
            .then((json) =>{
             this.lts = json[json.length-1].data.ts;
             this.setState({processing: false});
             this.setState({news: [...this.state.news, ...json], loaded: true})
            })

        .catch((err)=> {
            document.querySelector(".loading").style = "display: none";
            this.setState({loaded: true, error: true, reload: true})
        });

        var io = new IntersectionObserver(entries => {
           
        this.handleObserver();
        },
        {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        });
            
        io.observe(this.refs.loading); 

        //...
        setInterval(() => {
            if (localStorage.getItem("dsm") == "true") {
                this.setState({ IsDataSaver: true });
            }
            else {
                this.setState({ IsDataSaver: false });
            }
        }, 1000);

    }
    reload = () => {
        window.location.reload();
    }
    render() {
        return (
            <div ref="newsMain" className="newsMain">
            <Header  now={this.state.isDesc?"/o":"/"}/>
            {
                this.state.loaded ? null : <HomeSkeleton />
            }
            {
                    this.state.news.length > 0 ? this.state.news.map((n, i) => {
                        return (
                            <Link to={"/"+n.data.title+"/e/"+n.id} key={`${n.id}`}>
                            <div id={n.id} className="news">
                                <div className="newsInner">
                                        <img src={this.state.IsDataSaver == false ? n.data.uri[0].uri : Newsplaceholder} className="newsImage" id={`sid${n.id}`} onLoad={() => { document.querySelector(`#is${n.id}`).style = "display: none"; document.querySelector(`#sid${n.id}`).style = "display: block" }} alt="Image"></img>
                                        <img src={Newsplaceholder} className={"imageSkeleton"} id={`is${n.id}`}></img>
                                    <div>
                                    <div className="newsTitle">{n.data.title}</div>
                                    <div className="newsDesc">{n.data.s}</div>
                                </div>
                                </div>
                            </div>
                            </Link>
                        )
                    }) : null
            }
            {
                this.state.end?
                <div className="ad">
                    Advertisement
                </div>
                :null
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