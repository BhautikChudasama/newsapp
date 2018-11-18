import React, {Component} from "react";
import HomeSkeleton from "../skeletons/home";
import "./news.css";
export default class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            news: [],
            error: false
        }
    }
    handleObserver = () => {
        fetch("https://orchid-brian.glitch.me/news")
            .then((res) => res.json())
            .then((json) => {
                this.setState({ news: [...this.state.news, ...json], loaded: true });
                console.log(this.state.news.length);
            })
            .catch((err) => this.setState({ loaded: true, error: true }));
    }
    componentDidMount() {        
        fetch("https://orchid-brian.glitch.me/news")
        .then((res)=>res.json())
        .then((json)=>{
            this.setState({news: json, loaded: true});
        })
        .catch((err)=> this.setState({loaded: true, error: true}));

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
    render() {
        return (
            <div ref="newsMain" className="newsMain">
            {
                this.state.loaded ? null : <HomeSkeleton />
            }
            {
                    this.state.news.length > 0 ? this.state.news.map((n, i) => {
                        return (
                            <div id={i} className="news">
                                <img src="https://loading.io/spinners/rolling/lg.curve-bars-loading-indicator.gif" class="newsImage"></img>
                                <div className="newsDesc">{n.title}</div>
                            </div>
                        )
                    }) : null
            }
            {
                this.state.error ?
                    <div className="offline">
                        ભાઈ ઇન્ટરનેટ ચાલુ કર!
                    </div>
                :null
            }
            <div ref="loading" className="loading">
                <div className="loader"></div>
            </div>
            </div>
        );
    }
}