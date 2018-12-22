import React, {Component} from "react";
import ExploreNewsSkeleton from "../skeletons/news";
import "./newsDescription.css";
import closeIcon from "../images/round-close-24px (1).svg";
import unfillheart from "../images/round-favorite_border-24px.svg";
import filledHeart from "../images/liked.svg";
import { Router, Route, Link } from 'react-router-dom';
import History from "../history";
import { parse } from "path";
class NewsDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            dataSavingMode: false,
            hasLike: false,
            data: null,
            datermine: false,
            uc: false,
        }
    }

    toBlob(url) {
        const request = new Request(url[0], { mode: 'no-cors' });
        return fetch(request, {
            mode: "no-cors", cache: "no-cache", headers: {
                Accept: 'image/webp',
            },})
        .then((response) => {
            caches.open("img")
            .then((cache)=> {
                cache.put(request, response);
            })
        })
        
    }

    saveToOffline() {
        // URL...
        // params...
        const URL = window.location.href;
        const revURL = this.reverseString(URL);
        const URLbeforeLoc = revURL.search("/e");
        const inRev = URLbeforeLoc;
        const revId = revURL.substr(0, inRev);
        const id = this.reverseString(revId);
        if (this.state.hasLike) {
            var request = window.indexedDB.open("newsapp", 1);
            request.onsuccess = (e) => {
                var db = e.target.result;
                var wishlistTransaction = db.transaction("wishlisted", "readwrite");
                var wishlistStore = wishlistTransaction.objectStore("wishlisted");
                var res = wishlistStore.delete(id)
                res.onsuccess = () => {
                  caches.open("img")
                  .then((cache)=> {
                      // storing cache
                      cache.delete(this.state.data.imgs.si)
                      cache.delete(this.state.data.imgs.bi)
                  })
                }
               
            }
            request.onerror = (e) => {}
            this.setState({ hasLike: false });
        }
        else {
            var request = window.indexedDB.open("newsapp", 1);
            request.onsuccess = (e) => {
                var db = e.target.result;
                // Small image and Big image
                if(!this.state.uc) {
                    var si = [this.state.data.uri[0].uri];
                    var bi = [this.state.data.uri[1].uri];
                    this.toBlob(si)
                    .then((smallRes)=> {
                        this.toBlob(bi)
                        .then((bigRes)=> {
                            var data = {
                                id: id,
                                title: this.state.data.title,
                                desc: this.state.data.desc,
                                source: this.state.data.s,
                                imgs: {
                                    si: this.state.data.uri[0].uri,
                                    bi: this.state.data.uri[1].uri,
                                },
                                timestamp: new Date().getTime(),
                            }
                            var wishlistTransaction = db.transaction("wishlisted", "readwrite");
                            wishlistTransaction.onerror = (e) => { }
                            var wishlistStore = wishlistTransaction.objectStore("wishlisted");
                            wishlistStore.add(data);
                        })
                    })
                }
                else {
                    /* */
                    this.toBlob(this.state.data.imgs.si)
                        .then((smallRes) => {
                            this.toBlob(this.state.data.imgs.bi)
                                .then((bigRes) => {
                                    var data = this.state.data
                                    var wishlistTransaction = db.transaction("wishlisted", "readwrite");
                                    wishlistTransaction.onerror = (e) => { }
                                    var wishlistStore = wishlistTransaction.objectStore("wishlisted");
                                    wishlistStore.add(data);
                                })
                        })
                    /* */
                }
            } 
            request.onerror = () => {}
            this.setState({ hasLike: true });
            this.showSB();
        }
    }
    reverseString(string) {
    var reversedString = "";
    var stringLength = string.length - 1;
    for (var i = stringLength; i >= 0; i--) {
        reversedString += string[i];
    }
    return reversedString;
    }
    componentDidMount() {

        if (localStorage.getItem("dsm") == "true") {
            this.setState({ dataSavingMode: true });
        }
        else {
            this.setState({ dataSavingMode: false });
        }

        setInterval(()=> {
            if (localStorage.getItem("dsm") == "true") {
                this.setState({ dataSavingMode: true });
            }
            else {
                this.setState({ dataSavingMode: false });
            }
        }, 1000);
        

        window.scrollTo(0, 0);
        // Same as URL
        const URL = window.location.href;
        const revURL = this.reverseString(URL);
        const URLbeforeLoc = revURL.search("/e");
        const inRev = URLbeforeLoc;
        const revId = revURL.substr(0, inRev);
        const id = this.reverseString(revId);

        // fetch from indexDB
        if(window.indexedDB) {
            var request = window.indexedDB.open("newsapp", 1);
            request.onsuccess = (e)=>{
                // opened
                var db = e.target.result;
                var wishlistTransaction = db.transaction("wishlisted");
                var wishlistStore = wishlistTransaction.objectStore("wishlisted");
                var reqest = wishlistStore.get(id);
                reqest.onsuccess = (e) => {
                      if(e.target.result===undefined) {
                          this.setState({ datermine: true, hasLike: false });
                          fetch(`https://newsap-frtstondwali.glitch.me/pn/?i=${id}`)
                              .then((res) => {
                                  console.log(res);
                                  res.json()
                                      .then((json) => {
                                          this.setState({ data: json, loaded: true })
                                      })
                                })
                                .catch((err) => {
                                    // error occur
                                })
                      }
                      else {
                        this.setState({uc: true, data: e.target.result, loaded: true, datermine: true, hasLike: true});
                      }
                   
                }
                reqest.onerror = function(e) {
                    console.log(e);
                }
            }
            request.onerror = function(e) {
                // error occur
            }
            request.onupgradeneeded = function(e) {
                // update
                var db = e.target.result;
                db.createObjectStore("wishlisted", { keyPath: "id" });
            }
        }
        else {
            alert("Update your browser!");
        }
    }
    showSB() {
        this.setState({ show: true });
        setTimeout(() => {
            this.setState({ show: false });
        }, 2000)
    }
    render() {
        return (
            <>
            <div className="snackbar" ref="sb" style={this.state.show ? { display: "flex" } : { display: "none" }}>
                    Saved offline successfully
            </div>
             <div className="header">
                <Router history={History} > 
                            <div>
                                <Link to="/"><button className="closeButton" title="Close" ><img src={closeIcon} alt="" srcset="" /></button></Link>
                            </div>
                </Router>
                {   
                        
                        this.state.datermine==true ?
                        <button className="closeButton" title="Save to offline" onClick={(e) => this.saveToOffline()}><img src={this.state.hasLike ? filledHeart : unfillheart} alt="like" className="like" /></button>
                        : <div ref="hasLike" className="loading" style={{width: "auto", marginRight: "12px"}}>
                            <div className="loader" style={{width: "18px", height:"18px"}}></div>
                        </div>
                        
                }   
             </div>

            <div className="newsDescContainer">
                {
                    this.state.loaded?
                <div className="mainNews">
                      {
                                    
                         <> 
                            {
                                this.state.uc?
                                <>
                                 <img src={this.state.data.imgs.bi} alt="Image" srcset="" style={{maxWidth: "100%"}} className="ni" onLoad={(e)=> {document.querySelector(".ip").style="display: none"}}/>
                                 <div className="savermode ip"><svg width="81px" height="81px" viewBox="0 0 64 64" fill="red"><path fill="grey" d="M61,1H3C1.895,1,1,1.895,1,3v58c0,1.105,0.895,2,2,2h58c1.105,0,2-0.895,2-2V3C63,1.895,62.105,1,61,1z M24,13c3.314,0,6,2.686,6,6s-2.686,6-6,6s-6-2.686-6-6S20.686,13,24,13z M55.875,50.485C55.698,50.803,55.364,51,55,51H9 c-0.364,0-0.698-0.197-0.875-0.515s-0.166-0.707,0.026-1.015l10-16c0.156-0.25,0.415-0.418,0.706-0.46 c0.289-0.042,0.586,0.046,0.807,0.242l8.188,7.278L39.2,25.4c0.198-0.264,0.515-0.414,0.842-0.399 c0.33,0.014,0.631,0.189,0.806,0.469l15,24C56.041,49.778,56.051,50.167,55.875,50.485z"></path></svg></div>
                                </>
                                :
                                <>
                                 {this.state.dataSavingMode ? <div className="savermode"><svg width="81px" height="81px" viewBox="0 0 64 64" fill="red"><path fill="grey" d="M61,1H3C1.895,1,1,1.895,1,3v58c0,1.105,0.895,2,2,2h58c1.105,0,2-0.895,2-2V3C63,1.895,62.105,1,61,1z M24,13c3.314,0,6,2.686,6,6s-2.686,6-6,6s-6-2.686-6-6S20.686,13,24,13z M55.875,50.485C55.698,50.803,55.364,51,55,51H9 c-0.364,0-0.698-0.197-0.875-0.515s-0.166-0.707,0.026-1.015l10-16c0.156-0.25,0.415-0.418,0.706-0.46 c0.289-0.042,0.586,0.046,0.807,0.242l8.188,7.278L39.2,25.4c0.198-0.264,0.515-0.414,0.842-0.399 c0.33,0.014,0.631,0.189,0.806,0.469l15,24C56.041,49.778,56.051,50.167,55.875,50.485z"></path></svg></div> : <img src={this.state.data.uri[1].uri} alt="Image" srcset="" style={{maxWidth: "100%"}} className="ni" onLoad={(e)=> {document.querySelector(".ip").style="display: none"}}/> }
                                 {this.state.dataSavingMode ?null:<div className="savermode ip"><svg width="81px" height="81px" viewBox="0 0 64 64" fill="red"><path fill="grey" d="M61,1H3C1.895,1,1,1.895,1,3v58c0,1.105,0.895,2,2,2h58c1.105,0,2-0.895,2-2V3C63,1.895,62.105,1,61,1z M24,13c3.314,0,6,2.686,6,6s-2.686,6-6,6s-6-2.686-6-6S20.686,13,24,13z M55.875,50.485C55.698,50.803,55.364,51,55,51H9 c-0.364,0-0.698-0.197-0.875-0.515s-0.166-0.707,0.026-1.015l10-16c0.156-0.25,0.415-0.418,0.706-0.46 c0.289-0.042,0.586,0.046,0.807,0.242l8.188,7.278L39.2,25.4c0.198-0.264,0.515-0.414,0.842-0.399 c0.33,0.014,0.631,0.189,0.806,0.469l15,24C56.041,49.778,56.051,50.167,55.875,50.485z"></path></svg></div>}
                                </>
                             }                                         
                        </>
                      }
                    <div className="innerContainer">
                        <div className="headline">{this.state.data.title}</div>
                        <div className="otherNews">
                            {this.state.data.desc}
                        </div>
                        <div className="ad">
                            Advertisement
                        </div> 
                        <div className="ad">
                            Advertisement
                        </div>
                    </div>
                </div>: <ExploreNewsSkeleton />
                }
            </div>
        </>
        )
    }
}

export default NewsDescription;
