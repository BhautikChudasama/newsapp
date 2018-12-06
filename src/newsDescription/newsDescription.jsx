import React, {Component} from "react";
import ExploreNewsSkeleton from "../skeletons/news";
import "./newsDescription.css";
class NewsDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            dataSavingMode: true
        }
    }
    componentDidMount() {
        /*
             GET PATH
             LAST index of /
        */
    }
    render() {
        return (
            this.state.loaded ? 
            <div className="newsDescContainer">
                {
                    this.state.dataSavingMode ? <div className="savermode"><svg width="81px" height="81px" viewBox="0 0 64 64" fill="red"><path fill="grey" d="M61,1H3C1.895,1,1,1.895,1,3v58c0,1.105,0.895,2,2,2h58c1.105,0,2-0.895,2-2V3C63,1.895,62.105,1,61,1z M24,13c3.314,0,6,2.686,6,6s-2.686,6-6,6s-6-2.686-6-6S20.686,13,24,13z M55.875,50.485C55.698,50.803,55.364,51,55,51H9 c-0.364,0-0.698-0.197-0.875-0.515s-0.166-0.707,0.026-1.015l10-16c0.156-0.25,0.415-0.418,0.706-0.46 c0.289-0.042,0.586,0.046,0.807,0.242l8.188,7.278L39.2,25.4c0.198-0.264,0.515-0.414,0.842-0.399 c0.33,0.014,0.631,0.189,0.806,0.469l15,24C56.041,49.778,56.051,50.167,55.875,50.485z"></path></svg></div>: <img src="" alt="" srcset=""/>
                }
                <div className="mainNews">
                    <div className="innerContainer">
                        <div className="headline">From April, home loans will be decided by markets: RBI</div>
                        <div className="otherNews">
                            The RBI said on Wednesday that from April 2019, it will be mandatory for banks to link all floating rate loans, which are extended to individuals and small business, to an external benchmark. This benchmark can be the RBI’s repo rate, yield on the 91-day or 181-day treasury bill, or any other yardstick produced by the Financial Benchmarks of India.
                            The RBI said on Wednesday that from April 2019, it will be mandatory for banks to link all floating rate loans, which are extended to individuals and small business, to an external benchmark. This benchmark can be the RBI’s repo rate, yield on the 91-day or 181-day treasury bill, or any other yardstick produced by the Financial Benchmarks of India.
                            The RBI said on Wednesday that from April 2019, it will be mandatory for banks to link all floating rate loans, which are extended to individuals and small business, to an external benchmark. This benchmark can be the RBI’s repo rate, yield on the 91-day or 181-day treasury bill, or any other yardstick produced by the Financial Benchmarks of India.
                            The RBI said on Wednesday that from April 2019, it will be mandatory for banks to link all floating rate loans, which are extended to individuals and small business, to an external benchmark. This benchmark can be the RBI’s repo rate, yield on the 91-day or 181-day treasury bill, or any other yardstick produced by the Financial Benchmarks of India.
                        </div>
                    </div>
                </div>
            </div> : <ExploreNewsSkeleton />
        )
    }
}

export default NewsDescription;
