window.jQuery = require("jquery");
require("bootstrap");
import $ from "jquery";
import _ from "lodash";
import React from 'react';
import {render} from 'react-dom';
import Moment from 'moment';
var momentLocalizer = require('react-widgets/lib/localizers/moment')
momentLocalizer(Moment);
import {Route, NotFoundRoute, DefaultRoute, RouteHandler, Link} from "react-router";
import Router from "react-router";
import Login from "./login-form.jsx";
import Dashboard from "./dashboard";
import CreditForm from "./credit";
import OffersForm from "./offers";
import printProsp from "./printProsp"
import printFirst from "./printFirst"
import printPrivate from "./printPrivate"
import TermsForm from "./terms";
import content, {loadContent} from "./content.js";
var MediaQuery = require('react-responsive');
window.urlResult = "org";
var earned = "Points Earned :";
var sType = 204;
var menuIcon = "";
var pdfDownloadLink = "";
var PDFDocument = require ("jspdf");
var PDFTable = require ("jspdf-autotable");

var fdStatementTablePrint =  [
    {
        "transactionDate": "",
        "description": "",
        "amount": "",
        "transactionCode": ""
    }
];

var Search = React.createClass({
    getInitialState: function() {
        return { childVisible: false };
    },
    onClick: function() {
        this.setState({childVisible: !this.state.childVisible});
    },

    componentDidMount()
    {
        var url = window.location.href;//"file:///D:/facebook/YesBank/build/index.html?p1=dup&p2=ib#/" //or window.location.href for current url
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
            window.urlResult = "ib";
        }
        else if(capturedP1 === "DFD344B10466D628")
        {
            window.urlResult = "dup"
        }
        else
        {
            window.urlResult = "org"
        }

    },
    formatCurrency(nStr)
    {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? ('.' + x[1]): '';
        if
        (
            x2.length == 0)
        {
            x2 = '.00';
        }
        else if
        (
            x2.length == 2)
        {
            x2 = '.' + x[1] + '0';
        }

        var rgx = /(\d+)(\d{3})/;
        var z = 0;
        var len = String(x1).length;
        var num = parseInt((len/2)-1);

        while (rgx.test(x1))
        {
            if(z > 0)
            {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            else
            {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
                rgx = /(\d+)(\d{2})/;
            }
            z++;
            num--;

            if(num == 0)
            {
                break;
            }
        }
        return x1+x2;
    },

    isPromom(){

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
                link3 = offerImg.link3;
            }
            if(offerImg.hasOwnProperty("link1m"))
            {
                menuIcon = offerImg.link1m;
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

        if(link1 == "" && link2=="" && link3 =="")
        {
            isOrgOffer = "false";
        }
        else{
            isOrgOffer = "true";
        }

        if(text1 == "" && text2=="" && text3 =="")
        {
            isDupText = "false";
        }
        else{
            isDupText = "true";
        }

        if(window.urlResult === "org")
        {
            if(isOrgOffer == "true")
            {
                return (
                    <li  id="offersTab" role="presentation">
                        <Link to="offers" className="linkAnchorM"><p onClick={this.onClick}>YES PRIVILEGES</p></Link>
                    </li>
                );
            }
            else{
                return null;
            }
        }
        else if(window.urlResult === "dup")
        {
            if(isDupText == "true")
            {
                return (
                    <li  id="offersTab" role="presentation">
                        <Link to="offers" className="linkAnchorM"><p onClick={this.onClick}>YES PRIVILEGES</p></Link>
                    </li>
                );
            }
            else{
                return null;
            }
        }
        else{
            return null;
        }
    },

    onPrintm() {
        let customer = content.CUSTOMER;
        if(customer.hasOwnProperty("statementType")){
            sType = customer.statementType;
        }

        var statementtable = [];
        if(customer.hasOwnProperty("myCardPage")){
            var MyCardPage = content.CUSTOMER.myCardPage;
            if(MyCardPage.hasOwnProperty("TransactionsInfo")) {
                let TransactionsInfo = MyCardPage.TransactionsInfo
                if (TransactionsInfo.hasOwnProperty("transaction")) {
                    let tempStatementtable = TransactionsInfo.transaction;
                    let newTransactionData = [];
                    if(tempStatementtable.length > 1)
                    {
                        for(var sdate in tempStatementtable)
                        {
                            let zTransaction = tempStatementtable[sdate];
                            let zdate = zTransaction.transactionDate;
                            zdate = (zdate).split("-");
                            zdate = zdate[2]+zdate[1]+zdate[0];
                            newTransactionData.push({
                                sortDate:(zTransaction.amount==0)?"":zdate,
                                transactionDate:zTransaction.transactionDate,
                                transactionCode:zTransaction.transactionCode,
                                description:zTransaction.description+' – Ref No: '+zTransaction.referenceCode,
                                CardSequenceNumber:zTransaction.CardSequenceNumber,
                                amount:(zTransaction.amount==0)?"":zTransaction.amount,
                                transactionType:zTransaction.transactionType
                            })
                        }
                    }
                    else{
                        let zTransaction = tempStatementtable;
                        let zdate = zTransaction.transactionDate;
                        zdate = (zdate).split("-");
                        zdate = zdate[2]+zdate[1]+zdate[0];
                        newTransactionData.push({
                            sortDate:(zTransaction.amount==0)?"":zdate,
                            transactionDate:zTransaction.transactionDate,
                            transactionCode:zTransaction.transactionCode,
                            description:zTransaction.description+' – Ref No: '+zTransaction.referenceCode,
                            CardSequenceNumber:zTransaction.CardSequenceNumber,
                            amount:(zTransaction.amount==0)?"":zTransaction.amount,
                            transactionType:zTransaction.transactionType
                        })
                    }
                    statementtable = newTransactionData;
                }
                else
                {
                    statementtable = fdStatementTablePrint;
                }
            }
            else
            {
                statementtable = fdStatementTablePrint;
            }
        }

        let homePageData = content.CUSTOMER;
        printPrivate(statementtable,homePageData,earned,window.urlResult);
        /*
         For First pr
         printFirst(stattementtable,homePageData,earned,urlResult);

         For Prosperity Print
         printProsp(statementtable,homePageData,earned,urlResult);

         For Prosperity Print
         printPrivate(statementtable,homePageData,earned,urlResult);
         */
    },

    render: function() {
        var customer = content.CUSTOMER;
        if(customer.hasOwnProperty("printpath"))
        {
            let printpath = customer.printpath;
            if(printpath.hasOwnProperty("printpathlocation"))
            {
                pdfDownloadLink = "D:/prints/"+printpath.printpathlocation;
            }
        }
        return (
            <div className="row rightAlignStyle1">
                <span className="printIcon" onClick={this.onPrintm.bind(this)}></span>
                <label className="navMIconStyle" onClick={this.onClick}></label>
                {
                    this.state.childVisible
                        ? (
                        <ul className="navMobile">
                            <li id="overviewTab"  role="presentation">
                                <Link to="dashboard" className="linkAnchorM"><p onClick={this.onClick}>SUMMARY</p></Link>
                            </li>
                            <li  id="myCardTab" role="presentation">
                                <Link to="credit" className="linkAnchorM"><p onClick={this.onClick}>STATEMENT DETAILS</p></Link>
                            </li>
                            {/*this.isPromom()*/}
                            <li  id="termsTab"  role="presentation">
                                <Link to="terms" className="linkAnchorM"><p onClick={this.onClick}>TERMS &amp; CONDITIONS</p></Link>
                            </li>
                        </ul>
                    )
                        : null
                }
            </div>
        );
    }
});

var PromoLi = React.createClass({
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

        if(link1 == "" && link2=="" && link3 =="")
        {
            isOrgOffer = "false";
        }
        else{
            isOrgOffer = "true";
        }

        if(text1 == "" && text2=="" && text3 =="")
        {
            isDupText = "false";
        }
        else{
            isDupText = "true";
        }

        if(window.urlResult === "org")
        {
            if(isOrgOffer == "true")
            {
                return (
                    <li  id="offersTab" role="presentation">
                        <Link to="offers" className="linkAnchor">YES PRIVILEGES</Link>
                    </li>
                );
            }
            else{
                return null;
            }
        }
        else if(window.urlResult === "dup")
        {
            if(isDupText == "true")
            {
                return (
                    <li  id="offersTab" role="presentation">
                        <Link to="offers" className="linkAnchor">YES PRIVILEGES</Link>
                    </li>
                );
            }
            else{
                return null;
            }
        }
        else{
            return null;
        }
        
    }
});
var DupWaterMark = React.createClass({
    render: function() {
        let dupImg = content.CUSTOMER.offers;
        if(dupImg.hasOwnProperty("dupWatermark"))
        {
            return (
                <div className="watermarkStyle"><img width="100%" height="100%" src={dupImg.dupWatermark}/></div>
            );
        }
        else {
            return null;
        }

    }
});

var columns = [
    {title: "Date", dataKey: "transactionDate"},
    {title: "Transaction Description", dataKey: "description"},
    {title: "Amount (INR)", dataKey: "amount"},
    {title: "Cr/Dr", dataKey: "transactionType"}
];
var addonColumns = [];
var fdCashback =  [
    {
        "openingBalance": 0.00,
        "earned": 0.00,
        "disbursed": 0.00,
        "adjusted": 0.00,
        "closingBalance": 0.00
    }
];
var fdRewards =  [
    {
        "TOT_CTD_EARNED": 0,
        "TOT_YTD_EARNED": 0,
        "TOT_CTD_DISB": 0,
        "TOT_CTD_ADJ": 0
    }
];

let AddOnTable = ({items, card, id})=>(
    <table id={id} style={{display: 'none'}}>
        <thead>
        <tr>
            <th>Date</th>
            <th>Transaction Description</th>
            <th>Amount(INR)</th>
            <th>Cr/Dr</th>
        </tr>
        </thead>
        <tbody>
        {_.map(items ,(it)=><tr>
            <th>{it.date}</th>
            <th>{it.transactionDetails}</th>
            <th>{it.amount}</th>
            <th>{it.transactionType}</th>
        </tr>)}
        </tbody>
    </table>
)

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        //this is for debug only, skip login dialog and goes to first tab immediately
        setTimeout(()=> {
            this.decodeData("qwe", "qweqwe");
        }, 10);
    }

    dynFooter(){
        let customer = content.CUSTOMER;
        if(customer.hasOwnProperty("statementType")){
            sType = customer.statementType;
        }
        if(sType==101 || sType==102 || sType==103 || sType==104 || sType==201 || sType==105 || sType==206 || sType==301){
            return "footerProspStyle";
        }
        else if(sType==204){
            return "footerPrivateStyle";
        }
        else{
            return "footerFirstStyle";
        }
    }

    componentDidMount()
    {
        $("#popUp").hide();
        $("#embedPdf").hide();
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
            window.urlResult = "ib";
        }
        else if(capturedP1 === "DFD344B10466D628")
        {
            window.urlResult = "dup"
        }
        else
        {
            window.urlResult = "org"
        }
    }

    isPromo(){
        if(window.urlResult === "org")
        {
            return <PromoLi/>;
        }
        else if(window.urlResult === "dup")
        {
            return null
        }
        else{
            return null;
        }
    }

    isDuplicate(){
        if(window.urlResult === "dup")
        {
            return <DupWaterMark/>;
        }
        else{
            return null;
        }
    }


    decodeData(username, password) {
        if (loadContent(username, password)) {
            this.setState({error: null, data: content});
            this.context.router.transitionTo("dashboard");
        } else {
            console.log("!!");
            this.setState({error: "Username or password mismatch", data: null});
        }
    }

    mainContainerDyn() {
        if (navigator.userAgent.match(/iPhone/i)) {
            return "containerPaddingm"
        }
        else  if (navigator.userAgent.match(/Android/i))
        {
            return "containerPaddingm"
        }
        else  if (navigator.userAgent.match(/BlackBerry/i)) {
            return "containerPaddingm"
        }
        else if (navigator.userAgent.match(/webOS/i)) {
            return "containerPaddingm"
        }
        else {
            return "containerPadding"
        }
    }

    navViewDyn() {
        if (navigator.userAgent.match(/iPhone/i)) {
            return "navMobIcon"
        }
        else  if (navigator.userAgent.match(/Android/i))
        {
            return "navMobIcon"
        }
        else  if (navigator.userAgent.match(/BlackBerry/i)) {
            return "navMobIcon"
        }
        else if (navigator.userAgent.match(/webOS/i)) {
            return "navMobIcon"
        }
        else {
            return "nav nav-tabs"
        }
    }

    formatCurrency(nStr)
    {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? ('.' + x[1]): '';
        if
        (
            x2.length == 0)
        {
            x2 = '.00';
        }
        else if
        (
            x2.length == 2)
        {
            x2 = '.' + x[1] + '0';
        }

        var rgx = /(\d+)(\d{3})/;
        var z = 0;
        var len = String(x1).length;
        var num = parseInt((len/2)-1);

        while (rgx.test(x1))
        {
            if(z > 0)
            {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            else
            {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
                rgx = /(\d+)(\d{2})/;
            }
            z++;
            num--;

            if(num == 0)
            {
                break;
            }
        }
        return x1+x2;
    }


    onPrint() {
        $("#popUp").hide();
        let customer = content.CUSTOMER;
        if(customer.hasOwnProperty("statementType")){
            sType = customer.statementType;
        }

        var statementtable = [];
        if(customer.hasOwnProperty("myCardPage")){
            var MyCardPage = content.CUSTOMER.myCardPage;
            if(MyCardPage.hasOwnProperty("TransactionsInfo")) {
                let TransactionsInfo = MyCardPage.TransactionsInfo
                if (TransactionsInfo.hasOwnProperty("transaction")) {
                    let tempStatementtable = TransactionsInfo.transaction;
                    let newTransactionData = [];
                    if(tempStatementtable.length > 1)
                    {
                        for(var sdate in tempStatementtable)
                        {
                            let zTransaction = tempStatementtable[sdate];
                            let zdate = zTransaction.transactionDate;
                            zdate = (zdate).split("-");
                            zdate = zdate[2]+zdate[1]+zdate[0];
                            newTransactionData.push({
                                sortDate:(zTransaction.amount==0)?"":zdate,
                                transactionDate:zTransaction.transactionDate,
                                transactionCode:zTransaction.transactionCode,
                                description:zTransaction.description+' – Ref No: '+zTransaction.referenceCode,
                                CardSequenceNumber:zTransaction.CardSequenceNumber,
                                amount:(zTransaction.amount==0)?"":zTransaction.amount,
                                transactionType:zTransaction.transactionType
                            })
                        }
                    }
                    else{
                        let zTransaction = tempStatementtable;
                        let zdate = zTransaction.transactionDate;
                        zdate = (zdate).split("-");
                        zdate = zdate[2]+zdate[1]+zdate[0];
                        newTransactionData.push({
                            sortDate:(zTransaction.amount==0)?"":zdate,
                            transactionDate:zTransaction.transactionDate,
                            transactionCode:zTransaction.transactionCode,
                            description:zTransaction.description+' – Ref No: '+zTransaction.referenceCode,
                            CardSequenceNumber:zTransaction.CardSequenceNumber,
                            amount:(zTransaction.amount==0)?"":zTransaction.amount,
                            transactionType:zTransaction.transactionType
                        })
                    }
                    statementtable = newTransactionData;
                }
                else
                {
                    statementtable = fdStatementTablePrint;
                }
            }
            else
            {
                statementtable = fdStatementTablePrint;
            }
        }

        let homePageData = content.CUSTOMER;
        printPrivate(statementtable,homePageData,earned,window.urlResult);
        /*
        For First Print
         printFirst(statementtable,homePageData,earned,urlResult);

        For Prosperity Print
         printProsp(statementtable,homePageData,earned,urlResult);

         For Prosperity Print
         printPrivate(statementtable,homePageData,earned,urlResult);
        */
    }

    onDownload(){
         $("#popUp").show();
    }

    onCancel(){
        $("#popUp").hide();
        $("#embedPdf").hide();
    }

    render() {
        if (this.state.data) {

            var route = this.context.router.getCurrentRoutes()[1];
            var name = route.name;
            var customer = content.CUSTOMER;
            var headerImg = "";
            var logo = "";
            var ad1Img = "";
            var offer1Img = "";
            var offer2Img = "";
            if(customer.hasOwnProperty("bannersImg"))
            {
                headerImg = customer.bannersImg;
                if(headerImg.hasOwnProperty("logo"))
                {
                    logo = headerImg.logo;
                }
            }
            if(customer.hasOwnProperty("printpath"))
            {
                let printpath = customer.printpath;
                if(printpath.hasOwnProperty("printpathlocation"))
                {
                    pdfDownloadLink = printpath.printpathlocation;
                }
            }

            let statementtable = [];
            var addOns = [];
            var rewards = [];
            var rewardArr = [];
            if(customer.hasOwnProperty("myCardPage")) {
                let MyCardPage = customer.myCardPage;
                if(MyCardPage.hasOwnProperty("rewardSummary")) {
                    let rewSummary = MyCardPage.rewardSummary;
                    rewardArr.push(rewSummary);
                    let newRewardsData = [];
                    for(var sdate in rewardArr)
                    {
                        let zTransaction = rewardArr[sdate];
                        newRewardsData.push({
                            openingBalance:(zTransaction.openingBalance==0)?"0.00":zTransaction.openingBalance,
                            earned:(zTransaction.earned==0)?"0.00":zTransaction.earned,
                            disbursed:(zTransaction.disbursed==0)?"0.00":zTransaction.disbursed,
                            adjusted:(zTransaction.adjusted==0)?"0.00":zTransaction.adjusted,
                            closingBalance:(zTransaction.closingBalance==0)?"0.00":zTransaction.closingBalance
                        })
                    }
                    rewardArr = newRewardsData;
                }else{
                    rewardArr.push(fdCashback);
                }

                if(MyCardPage.hasOwnProperty("TransactionsInfo")) {
                    let TransactionsInfo = MyCardPage.TransactionsInfo
                    if (TransactionsInfo.hasOwnProperty("transaction")) {
                        let tempStatementtable = TransactionsInfo.transaction;
                        let newTransactionData = [];
                        if(tempStatementtable.length > 1)
                        {
                            for(var sdate in tempStatementtable)
                            {
                                let zTransaction = tempStatementtable[sdate];
                                let zdate = zTransaction.transactionDate;
                                zdate = (zdate).split("-");
                                zdate = zdate[2]+zdate[1]+zdate[0];
                                newTransactionData.push({
                                    sortDate:(zTransaction.amount==0)?"":zdate,
                                    transactionDate:zTransaction.transactionDate,
                                    transactionCode:zTransaction.transactionCode,
                                    description:zTransaction.description+' – Ref No: '+zTransaction.referenceCode,
                                    CardSequenceNumber:zTransaction.CardSequenceNumber,
                                    amount:(zTransaction.amount==0)?"":zTransaction.amount,
                                    transactionType:zTransaction.transactionType,
                                    details:zTransaction.narration+' – Ref No: '+zTransaction.referenceCode
                                })
                            }
                        }
                        else{
                            let zTransaction = tempStatementtable;
                            let zdate = zTransaction.transactionDate;
                            zdate = (zdate).split("-");
                            zdate = zdate[2]+zdate[1]+zdate[0];
                            newTransactionData.push({
                                sortDate:(zTransaction.amount==0)?"":zdate,
                                transactionDate:zTransaction.transactionDate,
                                transactionCode:zTransaction.transactionCode,
                                description:zTransaction.description+' – Ref No: '+zTransaction.referenceCode,
                                CardSequenceNumber:zTransaction.CardSequenceNumber,
                                amount:(zTransaction.amount==0)?"":zTransaction.amount,
                                transactionType:zTransaction.transactionType,
                                details:zTransaction.narration+' – Ref No: '+zTransaction.referenceCode
                            })
                        }
                        statementtable = newTransactionData;
                    }
                    else
                    {
                        statementtable = fdStatementTablePrint;
                    }
                }
                else
                {
                    statementtable = fdStatementTablePrint;
                }

                if(MyCardPage.hasOwnProperty("AddOnsInfo"))
                {
                    let AddOnsInfo = MyCardPage.AddOnsInfo;
                    if(AddOnsInfo.hasOwnProperty("addOns"))
                    {
                        //adonsFilter = true;
                        let addOnsTemp =  AddOnsInfo.addOns;
                        if(addOnsTemp.length > 1) {
                            addOns = addOnsTemp;
                        }
                        else {
                            addOns.push(addOnsTemp);
                        }

                        let newTransactionData = [];
                        for(var sdate in addOns)
                        {
                            let zTransaction = addOns[sdate];
                            let zdate = zTransaction.date;
                            zdate = (zdate).split("-");
                            zdate = zdate[2]+zdate[1]+zdate[0];
                            newTransactionData.push({
                                addoncardnumber:zTransaction.addoncardnumber,
                                sortDate:(zTransaction.amount==0)?"":zdate,
                                date:zTransaction.date,
                                transactionDetails:zTransaction.transactionDetails+' – Ref No: '+zTransaction.referenceCode,
                                transactionType:zTransaction.transactionType,
                                amount:(zTransaction.amount==0)?"":zTransaction.amount
                            })
                        }
                        addOns = newTransactionData;
                        addonColumns = _(addOns).map('addoncardnumber').uniq().value();
                    }
                }
            }

            if(customer.hasOwnProperty("overViewPage")) {
                let OverViewPage = customer.overViewPage;
                if(OverViewPage.hasOwnProperty("previousMonthSummary")) {
                    let tempStatementtable = OverViewPage.previousMonthSummary;
                    rewards.push(tempStatementtable);
                    let newRewardsData = [];
                    for(var sdate in rewards) {
                        let zTransaction = rewards[sdate];
                        newRewardsData.push({
                            TOT_CTD_EARNED:zTransaction.TOT_CTD_EARNED,
                            TOT_YTD_EARNED:zTransaction.TOT_YTD_EARNED,
                            TOT_CTD_DISB:zTransaction.TOT_CTD_DISB,
                            TOT_CTD_ADJ:zTransaction.TOT_CTD_ADJ
                        })
                    }
                    rewards = newRewardsData;
                }
                else{
                    rewards.push(fdRewards);
                }

                if(OverViewPage.hasOwnProperty("summaryBanner"))
                {
                    let sumBanner = OverViewPage.summaryBanner;
                    if(sumBanner.hasOwnProperty("link"))
                    {
                        ad1Img = sumBanner.link;
                    }
                }
            }

            if(customer.hasOwnProperty("offers"))
            {
                let offerBanner = customer.offers;
                if(offerBanner.hasOwnProperty("link1"))
                {
                    offer1Img = offerBanner.link1;
                }
                if(offerBanner.hasOwnProperty("link3"))
                {
                    offer2Img = offerBanner.link3;
                }
            }

            return (
                <div className="containerPadding">
                    <div className="innerMainContainer frameStyle">
                        {/*<div className="row">
                            <div className="tabNavMargin"><img width="100%" src={logo}/></div>
                        </div>
                        <br/>*/}
                        <div className="containerleft">
                            <div className="navMenuMob">
                                <Search/>
                            </div>
                            <div className="row navMenuWeb">
                                <div className="col-md-10 col-sm-10">
                                    <ul className="customNavtab">
                                        <li id="overviewTab"  role="presentation">
                                            <Link to="dashboard" className="linkAnchor">SUMMARY</Link>
                                        </li>
                                        <li  id="myCardTab" role="presentation">
                                            <Link to="credit" className="linkAnchor">STATEMENT DETAILS</Link>
                                        </li>
                                        {/*<PromoLi/>*/}
                                        <li  id="termsTab"  role="presentation">
                                            <Link to="terms" className="linkAnchor">TERMS &amp; CONDITIONS</Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-1 col-sm-1">
                                    <div className="printIcon" onClick={this.onDownload.bind(this)}></div>
                                </div>
                                <div className="col-md-1 col-sm-1">
                                    {/*<div className="downloadIcon" onClick={this.onDownload.bind(this)}></div>*/}
                                </div>
                                <div id="popUp" className="popOverStyle">
                                    <div>To save print file on Firefox and IE, you need to <a href="http://download.dopdf.com/download/setup/dopdf-full.exe" target="_blank">Download doPdf</a></div>
                                    <button id="print" type="button" className="buttonPrint" onClick={this.onPrint.bind(this)}>Continue to Print</button>
                                    &nbsp;&nbsp;
                                    <button id="cancel" type="button" className="buttonPrint" onClick={this.onCancel.bind(this)}>Cancel</button>
                                </div>
                            </div>
                            <div id="tabContentContainer" className="row">
                                <RouteHandler data={this.state.data}/>
                                {this.isDuplicate()}
                            </div>
                        </div>
                        <div className="footerPrivateStyle">
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <div className="footerAddress">YES BANK Limited</div>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12">
                                <div className="row">
                                    <a href="https://www.facebook.com/YESBANK/" target="_blank"><button className="fbIcon"></button></a>
                                    <a href="https://www.twitter.com/yesbank" target="_blank"><button className="twitterIcon"></button></a>
                                    <a href="https://www.instagram.com/yes_bank" target="_blank"><button className="instaIcon"></button></a>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12"></div>
                        </div>
                    </div>
                    <table id="transactionTable" style={{display: 'none'}}>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Transaction Description</th>
                            <th>Amount(INR)</th>
                            <th>Cr/Dr</th>
                        </tr>
                        </thead>
                        <tbody>
                        {_.map(statementtable,st=><tr>
                            <td>{st.transactionDate}</td>
                            <td>{st.description}</td>
                            <td style={{align:'right'}}>{st.amount}</td>
                            <td>{st.transactionType}</td>
                        </tr>)
                        }
                        </tbody>
                    </table>
                    <table id="tncProspTable" style={{display: 'none'}}>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Transaction</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>2nd June</td>
                            <td>Purchase of Apparel</td>
                            <td>Rs. 5,000</td>
                        </tr>
                        <tr>
                            <td>14th June</td>
                            <td>Purchase of Grocery</td>
                            <td>Rs. 1,000</td>
                        </tr>
                        <tr>
                            <td>20th June</td>
                            <td>Statement date</td>
                            <td>Total Amount Due = Rs 6,000 Minimum Amount Due = Rs 300</td>
                        </tr>
                        <tr>
                            <td>10th July</td>
                            <td>Payment realised on the card account</td>
                            <td>Rs 1,000 (Credit)</td>
                        </tr>
                        <tr>
                            <td>14th July</td>
                            <td>Purchase of groceries</td>
                            <td>Rs. 1,000</td>
                        </tr>
                        <tr>
                            <td>20th July</td>
                            <td>Statement date</td>
                            <td>Total Amount Due = Rs 6,338.43 Minimum Amount Due = Rs 316.92</td>
                        </tr>
                        </tbody>
                    </table>

                    {_.map(addonColumns, (c)=><AddOnTable items={addOns.filter(function(addonData) {
                    return (addonData.addoncardnumber == c)})} card={c} id={'addOnsTable'+_.indexOf(addonColumns, c)}/>)}

                    <table id="rewardsTable" style={{display: 'none'}}>
                        <thead>
                        <tr>
                            <th>Points earned so far</th>
                            <th>Points earned this month</th>
                            <th>Points redeemed this month</th>
                            <th>Points available for redemption</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{rewards[0].TOT_CTD_EARNED}</td>
                            <td>{rewards[0].TOT_YTD_EARNED}</td>
                            <td>{rewards[0].TOT_CTD_DISB}</td>
                            <td>{rewards[0].TOT_CTD_ADJ}</td>
                        </tr>
                        </tbody>
                    </table>
                    <table id="cashbackTable" style={{display: 'none'}}>
                        <thead>
                        <tr>
                            <th>Cashback on Movie Spends</th>
                            <th>Cashback on Grocery Spends</th>
                            <th>Cashback on Bill Payment</th>
                            <th>Cashback on Others Spends</th>
                            <th>Total Cashback for the month</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{rewardArr[0].openingBalance}</td>
                            <td>{rewardArr[0].earned}</td>
                            <td>{rewardArr[0].disbursed}</td>
                            <td>{rewardArr[0].adjusted}</td>
                            <td>{rewardArr[0].closingBalance}</td>
                        </tr>
                        </tbody>
                    </table>
                    <img style={{display: 'none'}} id="ad1ImgId" width="100%" src={ad1Img}/>
                    <img style={{display: 'none'}} id="offer1ImgId" crossorigin="anonymous" width="100%" src={offer1Img}/>
                    <img style={{display: 'none'}} id="offer2ImgId" crossorigin="anonymous" width="100%" src={offer2Img}/>
                </div>
            );
        } else {
            return <Login onLogin={this.decodeData.bind(this)} error={this.state.error}/>
        }
    }
}

App.contextTypes = {
    router: React.PropTypes.func
};

var routes = (
    <Route handler={App} path="/">
        <DefaultRoute name="dashboard" handler={Dashboard}/>
        <Route name="credit" handler={CreditForm}>
            <DefaultRoute name="credit-transaction" handler={CreditForm.CraditT}/>
            <Route name="my_reward" handler={CreditForm.MyReward}/>
        </Route>
        <Route name="offers" handler={OffersForm}/>
        <Route name="terms" handler={TermsForm}/>

    </Route>
);

//var HashLocation = require("./PatchedRouterHashLocation");
Router.run(routes, function (Handler) {
    let appHost = document.getElementById('app');
    render(<Handler/>, appHost);
});