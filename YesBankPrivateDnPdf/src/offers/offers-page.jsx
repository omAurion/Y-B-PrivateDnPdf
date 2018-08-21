import _ from "lodash";
import React from "react";
import $ from "jquery";


import {controller} from "smartobjects";


import {RouteHandler} from "react-router";

import cx from "classnames";

import config from "../util/config";
import content from "../content";
import conn from "../conn";

var endpoint = config.serverURL + '/callback'
var urlResult = "org";

var CustomOfferPanel = React.createClass({
    render: function() {
        var customer = content.CUSTOMER;
        var offerImg;
        var link1 = "";
        var link2 = "";
        var link3 = "";
        var text1 = "";
        var text2 = "";
        var text3 = "";
        var isOrgOffer = "false";
        var isDupText = "false";
        /*<div className="footerAd">{(link1==""||link1==null)?"":<img width="100%" src={link1}/>}</div>*/
        if(customer.hasOwnProperty("offers"))
        {
            offerImg = customer.offers;
            if(offerImg.hasOwnProperty("link1"))
            {
                link1 = offerImg.link1;
            }
            if(offerImg.hasOwnProperty("link2"))
            {
                link2 = offerImg.link2;
            }
            if(offerImg.hasOwnProperty("link3"))
            {
                //for yes first
                //link3 = "https://ccstatement.yesbank.in/AppList/Common/Banner_Retail_YF.jpg";

                //for yes prosperity
                link3 = offerImg.link3;
            }
            if(offerImg.hasOwnProperty("text1"))
            {
                text1 = offerImg.text1;
            }
            if(offerImg.hasOwnProperty("text2"))
            {
                text2 = offerImg.text2;
            }
            if(offerImg.hasOwnProperty("text3"))
            {
                text3 = offerImg.text3;
            }
        }

        if(urlResult === "org")
        {
            return (
                <div>
                    <div className="footerAd">{(link3==""||link3==null)?"":<img width="100%" src={link3}/>}</div>
                </div>
            );

        }
        else if(urlResult === "dup")
        {
            return (
                <div>
                    <div className="footerAd">{text3}</div>
                </div>
            );

        }
        else{
            return null;
        }
    }
});

export default class OffersForm  extends React.Component {

    componentDidMount()
    {
        var url = window.location.href;//"file:///D:/facebook/YesBank/build/index.html?p1=dup&p2=ib#/"; // or window.location.href for current url
        var capturedP1 = "";
        var capturedP2 = "";
        var resCapturedP1 = url.match(/p1/g);
        var resCapturedP2 = url.match(/p2/g);

        if(resCapturedP1 != null){
            capturedP1 = /p1=([^&]+)/.exec(url)[1];
        }
        if(resCapturedP2 != null){
            capturedP2 = /p2=([^&]+)/.exec(url)[1];
        }

        if(capturedP2 === "AE4736231BB94A28#/")
        {
            urlResult = "ib";
        }
        else if(capturedP1 === "DFD344B10466D628")
        {
            urlResult = "dup"
        }
        else
        {
            urlResult = "org"
        }
    }

    render() {
        return (
            <div className="pageStyle">
                <div className="row">
                    <div className="mainHeadingStyle"><h3>Offers of the month</h3></div>
                    <CustomOfferPanel/>
                </div>
            </div>
        );
    }
}


//module.exports = CreditTransactionForm;


OffersForm .contextTypes = {
    router: React.PropTypes.func
};


