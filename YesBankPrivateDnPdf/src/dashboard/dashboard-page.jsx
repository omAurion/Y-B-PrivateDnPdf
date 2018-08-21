import _ from "lodash";
import React from "react";
import $ from "jquery";
import Griddle from 'griddle-react';
import NumberColumn from "../number-column.jsx";
import numeral from "numeral";

import {controller} from "smartobjects";

import {RouteHandler} from "react-router";

import cx from "classnames";
import config from "../util/config";
import content from "../content";
import conn from "../conn";

let endpoint = config.serverURL + '/callback'
var uagent = navigator.userAgent.toLowerCase();
var earned = "Points Earned :";
var orgFlag = "F2CFA8794F185CDA";
var yesTouchNo = "1800 121 4444"; //yprosp- 1800 103 1212 and yf- 1800 103 6000 yPrivate- 1800 121 4444
var sType = 204;
var adBanner = "";
var styles = {
    padding: "4px 10px"
};
export default class DashboardPage extends React.Component {

    constructor(props, context) {
        super(props);
        let customer = content.CUSTOMER;
        if(customer.hasOwnProperty("statementType")){
            sType = customer.statementType;
        }
        if(sType == 103 || sType == 104)
        {
            earned = "Cashback Earned :";
        }
        else
        {
            earned = "Points Earned :";
        }
    }

    orgPromo()
    {
        var url = window.location.href; //window.location.href;
        var resUrl = url.match(/p1/g);
        
        let customer = content.CUSTOMER;
        if(customer.hasOwnProperty("overViewPage")) {
            let overViewData = customer.overViewPage;
            if(overViewData.hasOwnProperty("summaryBanner")) {
                let summaryBanner = overViewData.summaryBanner;
                if (summaryBanner.hasOwnProperty("link")) {
                    adBanner = summaryBanner.link;
                }
            }
        }
        
        if(resUrl != null){
            orgFlag = (/p1=([^&]+)/.exec(url)[1]);
        }

        if(orgFlag === "F2CFA8794F185CDA")
        {
            return (
                <div className="containerAlign">
                    <div className="footerAd"><img width="100%" src={adBanner}/></div>
                </div>
            );
        }
        else
        {
            return null;
        }
    }

    formatCurrency(nStr)
    {
        //return numeral(val).format("0,00,   000.00");
        if(nStr != null && nStr != "" && (typeof(nStr)!="object")){
            nStr += '';
            var x = nStr.split('.');
            var x1 = (x[0]=='')?'0':x[0];
            var x2 = x.length > 1 ? ('.' + x[1]) : '';
            if
            (
                x2.length == 0) {
                x2 = '.00';
            }
            else if
            (
                x2.length == 2) {
                x2 = '.' + x[1] + '0';
            }

            var rgx = /(\d+)(\d{3})/;
            var z = 0;
            var len = String(x1).length;
            var num = parseInt((len / 2) - 1);

            while (rgx.test(x1)) {
                if (z > 0) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                else {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                    rgx = /(\d+)(\d{2})/;
                }
                z++;
                num--;

                if (num == 0) {
                    break;
                }
            }
            return x1 + x2;
        }
        else {
            return "0.00"
        }
    }

    render() {
        let dashboard = this.props.data;
        let customer = content.CUSTOMER;
        //let overViewData = content.CUSTOMER.overViewPage;
        //let MyCardPage = content.CUSTOMER.myCardPage;
        var name = "";
        var employername = "";
        var address1 = "";
        var address2 = "";
        var address3 = "";
        var address4 = "";
        var addresscity = "";
        var contactNo = "";
        var emailId = "";
        var cardNumber = "";
        var statementPeriod = "";
        var statementDate = "";
        var totalDues = 0.00;
        var pastDues = 0;
        var minAmtDue = 0.00;
        var paymentDueDate = "";
        var creditLimit = 0.00;
        var availableCreditLimit = 0.00;
        var cashLimit = 0.00;
        var availableCashLimit = 0.00;
        var lastpaymnetRecive = 0.00;
        var priviousBalance = 0.00;
        var currentPurchase = 0.00;
        var currentCash = 0.00;
        var ptEarned = 0;
        var ptRedeemed = 0;
        var ptAvailable = 0;


        if(customer.hasOwnProperty("overViewPage")) {
            let overViewData = customer.overViewPage;
            if(overViewData.hasOwnProperty("previousMonthSummary"))
            {
                let previousMonthData = overViewData.previousMonthSummary;
                if(previousMonthData.hasOwnProperty("lastpaymnetRecive"))
                {
                    lastpaymnetRecive = (previousMonthData.lastpaymnetRecive);
                    lastpaymnetRecive = this.formatCurrency(lastpaymnetRecive);
                }
                if(previousMonthData.hasOwnProperty("previousBalance"))
                {
                    priviousBalance = (previousMonthData.previousBalance);
                    priviousBalance = this.formatCurrency(priviousBalance);
                }
                if(previousMonthData.hasOwnProperty("currentPurchase"))
                {
                    currentPurchase = (previousMonthData.currentPurchase);
                    currentPurchase = this.formatCurrency(currentPurchase);
                }
                if(previousMonthData.hasOwnProperty("currentCashAdvance"))
                {
                    currentCash = (previousMonthData.currentCashAdvance);
                    currentCash = this.formatCurrency(currentCash);
                }

                if(sType == 101 || sType == 102 || sType == 201 || sType == 202 || sType == 203 || sType == 204 || sType == 208 || sType == 105 || sType == 205 || sType == 206 || sType == 207 || sType == 209)
                {
                    if(previousMonthData.hasOwnProperty("cashbackEarned"))
                    {
                        ptEarned = previousMonthData.cashbackEarned;
                    }
                }
                if(previousMonthData.hasOwnProperty("TOT_CTD_DISB"))
                {
                    ptRedeemed = (previousMonthData.TOT_CTD_DISB);
                }
                if(previousMonthData.hasOwnProperty("TOT_CTD_ADJ"))
                {
                    ptAvailable = (previousMonthData.TOT_CTD_ADJ);
                }
            }
            
            if(overViewData.hasOwnProperty("customerInfo"))
            {
                let customerInfo = overViewData.customerInfo;
                if(customerInfo.hasOwnProperty("name"))
                {
                    name = customerInfo.name;
                }
                if(customerInfo.hasOwnProperty("employername"))
                {
                    employername = customerInfo.employername;
                }
                if(customerInfo.hasOwnProperty("address1"))
                {
                    address1 = customerInfo.address1;
                }
                if(customerInfo.hasOwnProperty("address2"))
                {
                    address2 = customerInfo.address2;
                }
                if(customerInfo.hasOwnProperty("address3"))
                {
                    address3 = customerInfo.address3;
                }
                if(customerInfo.hasOwnProperty("address4"))
                {
                    address4 = customerInfo.address4;
                }
                if(customerInfo.hasOwnProperty("addresscity"))
                {
                    addresscity = customerInfo.addresscity;
                }
                if(customerInfo.hasOwnProperty("contactNumber"))
                {
                    contactNo = customerInfo.contactNumber;
                    /*let contactNoTemp = customerInfo.contactNumber;
                     if((typeof contactNoTemp)== "number"){
                     contactNoTemp = "+"+contactNoTemp;
                     }
                     let cont1 = contactNoTemp.substr(0,5);
                     let cont2 = contactNoTemp.substr(5,5);
                     cont2 = "XXXXX"
                     let cont3 = contactNoTemp.substr(10,contactNoTemp.length);
                     contactNo = cont1+cont2+cont3;*/
                }
                if(customerInfo.hasOwnProperty("emailId"))
                {
                    //emailId = customerInfo.emailId;
                    let emailIdTemp = customerInfo.emailId;
                    if(emailIdTemp !=null && emailIdTemp!=''){
                        let emailArr = emailIdTemp.split("@");
                        let em1 = emailArr[0];
                        let em2 = emailArr[1];
                        let em1Sub1 = em1.substr(0,em1.length-3);
                        let em1Sub2 = em1.substr(em1.length-3,3);
                        em1Sub2 = "XXX";
                        em1 = em1Sub1+em1Sub2;
                        let em2Sub1 = em2.substr(0,3);
                        em2Sub1 = "XXX";
                        let em2Sub2 = em2.substr(3,em2.length);
                        em2 = em2Sub1+em2Sub2;
                        emailId = em1+"@"+em2;
                    }
                }
            }

            if(overViewData.hasOwnProperty("creditCardSummary"))
            {
                let creditCardSummary = overViewData.creditCardSummary;
                if(creditCardSummary.hasOwnProperty("cardNumber"))
                {
                    cardNumber = creditCardSummary.cardNumber;
                }
                if(creditCardSummary.hasOwnProperty("statementPeriod"))
                {
                    statementPeriod = creditCardSummary.statementPeriod;
                    let dateArr = statementPeriod.split("To");
                    let fromDate = dateArr[0];
                    let toDate = dateArr[1];
                    fromDate = fromDate.split("-").join("/");
                    toDate = toDate.split("-").join("/");
                    statementPeriod = fromDate+" To "+toDate;
                    //console.log("date format==>"+fromDate);
                }
                if(creditCardSummary.hasOwnProperty("statementDate"))
                {
                    statementDate = creditCardSummary.statementDate;
                    statementDate = statementDate.split("-").join("/");
                }
                if(creditCardSummary.hasOwnProperty("totalDues"))
                {
                    totalDues = creditCardSummary.totalDues;
                    if(totalDues.length > 15)
                    {
                        totalDues = totalDues.substring(0,15)
                    }
                    totalDues = parseFloat(totalDues);
                    if(totalDues > 0){
                        totalDues = this.formatCurrency(totalDues);
                    }else if(totalDues < 0){
                        totalDues = totalDues * -1;
                        totalDues = this.formatCurrency(totalDues);
                        totalDues = totalDues +" Cr";
                    }else{
                        totalDues = '0.00'
                    }
                }
                if(creditCardSummary.hasOwnProperty("minAmtDue"))
                {
                    minAmtDue = (creditCardSummary.minAmtDue);
                    minAmtDue = this.formatCurrency(minAmtDue);
                }
                if(creditCardSummary.hasOwnProperty("pastDues"))
                {
                    pastDues = creditCardSummary.pastDues;
                }
                if(creditCardSummary.hasOwnProperty("paymentDueDate"))
                {
                    paymentDueDate = creditCardSummary.paymentDueDate;
                    let totalDues1 = creditCardSummary.totalDues;
                    totalDues1 = parseFloat(totalDues1);
                    if(totalDues1 > 0){
                        if(pastDues>0){
                            paymentDueDate = "IMMEDIATE";
                        }else{
                            paymentDueDate = paymentDueDate.split("-").join("/");
                        }
                    }else if(totalDues1 <= 0){
                        paymentDueDate = "NO PYMT REQD";
                    }
                }
                if(creditCardSummary.hasOwnProperty("creditLimit"))
                {
                    creditLimit = (creditCardSummary.creditLimit);
                    creditLimit = this.formatCurrency(creditLimit);
                }
                if(creditCardSummary.hasOwnProperty("availableCreditLimit"))
                {
                    availableCreditLimit = (creditCardSummary.availableCreditLimit);
                    availableCreditLimit = this.formatCurrency(availableCreditLimit);
                }
                if(creditCardSummary.hasOwnProperty("cashLimit"))
                {
                    cashLimit = (creditCardSummary.cashLimit);
                    cashLimit = this.formatCurrency(cashLimit);
                }
                if(creditCardSummary.hasOwnProperty("availableCashLimit"))
                {
                    availableCashLimit = (creditCardSummary.availableCashLimit);
                    availableCashLimit = this.formatCurrency(availableCashLimit);
                }
            }
        }

        if(customer.hasOwnProperty("myCardPage")) {
            let MyCardPage = customer.myCardPage;
            if(MyCardPage.hasOwnProperty("rewardSummary")) {
                let rewSummary = MyCardPage.rewardSummary;
                if(rewSummary.hasOwnProperty("closingBalance")) {
                    if(sType == 103 || sType == 104)
                    {
                        ptEarned = (rewSummary.closingBalance==0)?"Rs. 0.00":"Rs. "+(this.formatCurrency(rewSummary.closingBalance));
                    }
                }
            }
        }
        let emailIdstyle = {
            wordWrap: 'break-word'
        };

        return (
            <div className="pageStyle">
                <div className="row">
                    <div className="col-xs-12 col-md-6 col-sm-6">
                        <div className="homeRcornerBorder">
                            <div className="rCornerHeaderStyle">Your Name & Address</div>
                            <div className="custNameStyle">
                                <h4>{name}</h4>
                                <div>{employername}</div>
                                <div>{address1}</div>
                                <div>{address2}</div>
                                <div>{address3}</div>
                                <div>{address4}</div>
                                <div>{addresscity}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-sm-6">
                       <div className="home1RcornerBorder">
                            <div className="rCornerHeaderStyle">Registered Mobile Number</div>
                            <div className="infoAlign">{contactNo}</div>
                        </div>
                        <div className="home1RcornerBorder">
                            <div className="rCornerHeaderStyle">Registered Email Id</div>
                            <div className="infoAlign" style={emailIdstyle}>{emailId}</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="leftRightMargin">
                        <div className="col-xs-12 col-md-8 col-sm-8">
                            <div className="overviewRcornerBorder">
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 col-sm-12 overviewStyle">
                                        <p>Overview</p>
                                        <div><h5><b>Statement for YES BANK Card Number  {cardNumber}</b></h5></div>
                                    </div>
                                </div>
                                <div className="row blue-background">
                                    <div className="col-xs-12 col-md-6 col-sm-6 custom-border-right">
                                        <div className="panel panel-default transparent-panel">
                                            <div className="panel-body">
                                                <div><b>Statement Period:</b></div>
                                                <div>{statementPeriod}</div>
                                                <div className="hrStyle"/>
                                                <div><b>Statement Date: </b>{statementDate}</div>
                                                <div className="hrStyle"/>
                                                <div><b>Total Amount Due:</b></div>
                                                <div>Rs. {totalDues}</div>
                                                <div className="hrStyle"/>
                                                <div><b>Minimum Amount Due:</b></div>
                                                <div>Rs. {minAmtDue}</div>
                                                <div className="hrStyle"/>
                                                <div><b>Due Date: </b>{paymentDueDate}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-md-6 col-sm-6 custom-border">
                                        <div className="panel panel-default transparent-panel">
                                            <div className="panel-body blueTxtStyle">
                                                <div><b>Credit Limit:</b></div>
                                                <div>Rs. {creditLimit}</div>
                                                <div className="hrStyle"/>
                                                <div><b>Available Credit Limit:</b></div>
                                                <div>Rs. {availableCreditLimit}</div>
                                                <div className="hrStyle"/>
                                                <div><b>Cash Limit:</b></div>
                                                <div>Rs. {cashLimit}</div>
                                                <div className="hrStyle"/>
                                                <div><b>Available Cash Limit:</b></div>
                                                <div>Rs. {availableCashLimit}</div>
                                                {/*<hr className="hrStyle"/>
                                                <div><b>Make Payment:</b></div>
                                                <div className="linkDiv">
                                                    <button className="buttonPrint"> <a href="https://www.yesbank.in" target="_blank">YES BANK NetBanking</a></button>
                                                    <button className="buttonPrint"> <a href="https://pgi.billdesk.com/pgidsk/pgmerc/ybkcard/index.jsp" target="_blank">Other Bank</a></button>
                                                </div>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*<div className="row">
                                    <div className="col-xs-12 col-md-12 col-sm-12 paymentReceiveStyle">
                                        <div><strong>Payments And Credit Received : {lastpaymnetRecive}</strong></div>
                                    </div>
                                </div>*/}
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-4 col-xs-12">
                            <div className="prevRcornerBorder">
                                <p>Statement Summary</p>
                                <div className="monthSummaryDiv">
                                    <div><strong>Previous balance:</strong></div>
                                    <div>Rs. {priviousBalance}</div>
                                </div>
                                <div className="monthSummaryDiv">
                                    <div><strong>Current Purchases & Other Charges:</strong></div>
                                    <div>Rs. {currentPurchase}</div>
                                </div>
                                {/* <div className="monthSummaryDiv">
                                    <div><strong>Current Cash Advance:</strong></div>
                                    <div>Rs. {currentCash}</div>
                                </div>*/}
                                <div className="monthSummaryDiv">
                                    <div><strong>Payments And Credit Received:</strong></div>
                                    <div>Rs. {lastpaymnetRecive}</div>
                                </div>
                            </div>
                            <div className="prevRcornerBorder">
                                <p>Reward Point Summary</p>
                                <div className="monthSummaryDiv"><b>Points Earned :</b> {ptEarned}</div>
                                <div className="monthSummaryDiv"><b>Points Redeemed :</b> {ptRedeemed}</div>
                                <div className="monthSummaryDiv"><b>Available for Redemption :</b> {ptAvailable}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {this.orgPromo()}
                </div>
                <div className="row">
                    <div className="containerAlign">
                        <div className="sqBorderStyle blueTxtStyle1">
                            <div><b>Important information:</b></div>
                            <div>Please pay the total outstanding mentioned in your credit card statement, in full, by the payment due date to avoid interest charges.</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
DashboardPage.contextTypes = {
    db: React.PropTypes.object
};

