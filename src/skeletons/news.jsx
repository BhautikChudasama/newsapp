import React from "react";
import "./skeletons.css";

const ExploreNewsSkeleton = (props) => {
    return (
        <>
            <div className="progress">
                <div className="indeterminate"></div>
            </div>
            <div className="newsDescS">
                <div className="newsImageS">
                    <div className="dataSaver">
                        <svg width="81px" height="81px" viewBox="0 0 64 64" fill="red"><path fill="grey" d="M61,1H3C1.895,1,1,1.895,1,3v58c0,1.105,0.895,2,2,2h58c1.105,0,2-0.895,2-2V3C63,1.895,62.105,1,61,1z M24,13c3.314,0,6,2.686,6,6s-2.686,6-6,6s-6-2.686-6-6S20.686,13,24,13z M55.875,50.485C55.698,50.803,55.364,51,55,51H9 c-0.364,0-0.698-0.197-0.875-0.515s-0.166-0.707,0.026-1.015l10-16c0.156-0.25,0.415-0.418,0.706-0.46 c0.289-0.042,0.586,0.046,0.807,0.242l8.188,7.278L39.2,25.4c0.198-0.264,0.515-0.414,0.842-0.399 c0.33,0.014,0.631,0.189,0.806,0.469l15,24C56.041,49.778,56.051,50.167,55.875,50.485z"></path>
                        </svg>
                    </div>
                </div>
                <div className="newsS"></div>
               
            </div>
        </>
    )
}

export default ExploreNewsSkeleton;