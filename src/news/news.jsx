import React, {Component} from "react";
import HomeSkeleton from "../skeletons/home";
import "./news.css";
export default class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            news: [],
            error: false,
            load: false
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
                                <div className="newsInner">
                                    <img src="https://img1a.flixcart.com/www/linchpin/batman-returns/images/fk-default-image-75ff34.png" class="newsImage"></img>
                                    <div>
                                    <div className="newsTitle">{n.title}</div>
                                    <div className="newsDesc">{n.desc}</div>
                                </div>
                                </div>
                            </div>
                        )
                    }) : null
            }
            {
                this.state.error ?
                    <div className="offline">
                        There no internet connection!
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