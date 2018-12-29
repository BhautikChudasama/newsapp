import React from "react";
import "./saved.css";
import { Router, Link } from "react-router-dom";
import history from "../history";
import backIcon from "../images/outline-arrow_back-24px.svg";
import HomeSkeleton from "../skeletons/home";
import Newsplaceholder from "../images/newsplaceholder.png";
import noData from "../images/undraw_empty_xct9.svg";
class Saved extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            data : [],
            IsDataSaver: false,
        }
    }
    componentDidMount() {
        if (localStorage.getItem("dsm") == "true") {
            this.setState({ IsDataSaver: true });
        }
        else {
            this.setState({ IsDataSaver: false });
        }
      if(window.indexedDB) {
        var request = window.indexedDB.open("newsapp", 1);
        request.onsuccess = (e) => {
            var db = e.target.result;
            console.log(db);
            var trx = db.transaction("wishlisted");
            var store = trx.objectStore("wishlisted");
            var wcursor = store.openCursor();
            var data = [];
            wcursor.onsuccess = e => {
              var cursor = e.target.result;
              if (!cursor) {
              } 
              else {
                data.push(cursor.value);
                cursor.continue();
              }
              this.setState({data: data, loaded: true});
            };
        }
      }
      else {
          alert("Update your browser!");
      }
    }
    render() {
        return (
            <>
            <div className={"likeHeader header"}>
                <Router history={history}>
                    <Link to="/" className="backButton">
                        <img src={backIcon} alt="Go to Back" className="savetohome"/>
                    </Link>
                </Router>
                <div style={{paddingTop: "1px"}}>
                    Saved
                </div> 
            </div>
            <main>
                {
                this.state.loaded?
                this.state.data.length>0?
                <>
                {
                this.state.data.map((n, i) => {
                        return (
                            <Link to={"/"+n.title+"/e/"+n.id} key={`${n.id}`}>
                                <div id={n.id} className="news">
                                    <div className="newsInner">
                                        <img src={this.state.IsDataSaver == false ? n.imgs.bi : Newsplaceholder} className="newsImage" id={`sid${n.id}`} onLoad={() => { document.querySelector(`#is${n.id}`).style = "display: none"; document.querySelector(`#sid${n.id}`).style = "display: block" }} alt="Headline"></img>
                                        <img src={Newsplaceholder} className={"imageSkeleton"} id={`is${n.id}`}></img>
                                        <div>
                                            <div className="newsTitle">{n.title}</div>
                                            <div className="newsDesc">{n.source}</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                })
                }
                </>
                :
                <>
                <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                    <img src={noData} alt="No saved data" class="nosaved" />
                </div>
                <div className="noDataDesc">
                    <div style={{display: "block"}}>
                        <p className="maindescnodata">There are no saved data</p>
                        <div style={{width: "100%;", display: "flex", justifyContent: "center"}}>
                            <Router history={history}>
                                <Link to="/" className="contsread" role="Link">
                                    Continue Reading
                                </Link>
                            </Router>
                        </div>
                    </div>
                </div>
                </>
                : 
                    import ("../skeletons/home")
                    .then(ExploreSkeleton=><ExploreSkeleton/>)
                 
                }
            </main>
            </>
        )
    }
}

export default Saved;
