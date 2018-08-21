import React from "react";

let InfoLine = (props)=>(
    <div className="info-line">
        <div className="title">{props.title}</div>
        <div className="value">{props.value}</div>
    </div>
);
export default InfoLine;