import {render} from "react-dom";
import React from 'react'
import {renderToString} from "react-dom/server";
require("bootstrap");
import _ from "lodash";
import Handlebars from "handlebars";
import numeral from "numeral";
import content from "./content";
import $ from "jquery";

<link rel="stylesheet" type="text/css" href="app.less" />

function generateStyleSheet(w, styleTag){
    var css = styleTag.innerHTML;
    var head = w.document.head || w.document.getElementsByTagName('head')[0];
    var style = w.document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(w.document.createTextNode(css));
    }
    head.appendChild(style);
}

function generateStyleLinks(w, link){
    var head = w.document.head || w.document.getElementsByTagName('head')[0];
    var styleLink = w.document.createElement('link');
    styleLink.setAttribute("rel", "stylesheet");
    styleLink.setAttribute("type", "text/css");
    styleLink.setAttribute("href", link);
    head.appendChild(styleLink);
}

export default function (data,homePageData,earned,urlResult) {

    var source = "<table cellspacing='0' style=\"width:100%;margin: 0 0 10px 0;font-family:Arial;font-size:12px;\" class=\"table\">" +
        "<thead style=\"margin:0px;padding:5px;height:15px;background-color:#cecece !important;border:1px solid #cecece;color:#212d3c;\"><td style=\"border:1px solid #cecece;padding:1px 5px;\">Date</td><td style=\"border:1px solid #cecece;padding:1px 5px;\">Transaction Description</td><td style=\"border:1px solid #cecece;padding:1px 5px;text-align: right;\">Amount(INR)</td><td style=\"border:1px solid #cecece;padding:1px 5px;\">Cr/Dr</td></thead>"+
        "<tbody style='border:1px solid #cecece;'>{{#each this}}"+
        "<tr style=\"background-color:#ebebeb !important;\">"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;\">{{this.transactionDate}}</td>"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;\">{{this.description}}</td>"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;text-align: right;\">{{this.amount}}</td>"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;\">{{this.transactionType}}</td>"+
        "</tr>{{/each}}"+
        "</tbody>"+
        "</table>";
    var template = Handlebars.compile(source);
    var result = template(data);
    /*var str = source.outerHTML;
    str = str.replace(/<TBODY>/i, "");
    str = str.replace(/<TR/i, "<THEAD style='height: 130px;display:table-header-group'><TR");
    str = str.replace(/<\/TR>/i, "</TR></THEAD><TBODY>");
    source.outerHTML = str;*/
    //var content = renderToString(component);
    //console.log(content);

    var w = window.open();
    var is_chrome = Boolean(w.chrome);

    var styleLinks = document.getElementsByTagName('link');
    for(let i=0; i<styleLinks.length;i++){
        let styleLink = styleLinks[i];
        generateStyleLinks(w, styleLink.href);
    }
    var styles = document.getElementsByTagName('style');
    for(let i=0; i<styles.length;i++){
        let style = styles[i];
        generateStyleSheet(w, style);
    }

    var overViewData = homePageData.overViewPage;
    var MyCardPage = homePageData.myCardPage;
    var sType = homePageData.statementType;
    var offers = homePageData.offers;
    var name = "";
    var address1 = "";
    var address2 = "";
    var address3 = "";
    var addresscity = "";
    var contactNo = "";
    var emailId = "";
    var cardNumber = "";
    var statementPeriod = "";
    var statementDate = "";
    var totalDues = 0;
    var minAmtDue = 0;
    var paymentDueDate = 0;
    var creditLimit = 0;
    var availableCreditLimit = 0;
    var cashLimit = 0;
    var availableCashLimit = 0;
    var priviousBalance = 0;
    var currentPurchase = 0;
    var currentCash = 0;
    var ptEarned = 0;
    var lastpaymnetRecive = 0;
    var adImgSrc = "";
    var addOns = [];
    var adonsFilter = false;
    var rewards = [];
    var rewardArr = [];
    var link1 = "";
    var link3 = "";
    var dupWatermarkSrc = "";

    function formatCurrency(nStr)
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

    if(overViewData.hasOwnProperty("summaryBanner")) {
        let summaryBanner = overViewData.summaryBanner;
        if(summaryBanner.hasOwnProperty("link"))
        {
            adImgSrc = summaryBanner.link;
        }
    }

    if(overViewData.hasOwnProperty("previousMonthSummary"))
    {
        let previousMonthData = overViewData.previousMonthSummary;

        rewards.push(previousMonthData);
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

        if(previousMonthData.hasOwnProperty("lastpaymnetRecive"))
        {
            lastpaymnetRecive = (previousMonthData.lastpaymnetRecive);
            lastpaymnetRecive = formatCurrency(lastpaymnetRecive);
        }
        if(previousMonthData.hasOwnProperty("previousBalance"))
        {
            priviousBalance = (previousMonthData.previousBalance);
            priviousBalance = formatCurrency(priviousBalance);
        }
        if(previousMonthData.hasOwnProperty("currentPurchase"))
        {
            currentPurchase = (previousMonthData.currentPurchase);
            currentPurchase = formatCurrency(currentPurchase);
        }
        if(previousMonthData.hasOwnProperty("currentCashAdvance"))
        {
            currentCash = (previousMonthData.currentCashAdvance);
            currentCash = formatCurrency(currentCash);
        }
        if(sType == 101 || sType == 102 || sType == 201 || sType == 202 || sType == 203)
        {
            if(previousMonthData.hasOwnProperty("cashbackEarned"))
            {
                ptEarned = previousMonthData.cashbackEarned;
            }
        }
    }

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
        if(rewSummary.hasOwnProperty("closingBalance")) {
            if(sType == 103 || sType == 104)
            {
                ptEarned = (rewSummary.closingBalance==0)?"Rs. 0.00":"Rs. "+formatCurrency(rewSummary.closingBalance);
            }
        }
    }

    if(overViewData.hasOwnProperty("customerInfo"))
    {
        let customerInfo = overViewData.customerInfo;
        if(customerInfo.hasOwnProperty("name"))
        {
            name = customerInfo.name;
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
        if(customerInfo.hasOwnProperty("addresscity"))
        {
            addresscity = customerInfo.addresscity;
        }
        if(customerInfo.hasOwnProperty("contactNumber"))
        {
            contactNo = customerInfo.contactNumber;
        }
        if(customerInfo.hasOwnProperty("emailId"))
        {
            //emailId = customerInfo.emailId;
            let emailIdTemp = customerInfo.emailId;
            if(emailIdTemp !=null && emailIdTemp!='') {
                let emailArr = emailIdTemp.split("@");
                let em1 = emailArr[0];
                let em2 = emailArr[1];
                let em1Sub1 = em1.substr(0, em1.length - 3);
                let em1Sub2 = em1.substr(em1.length - 3, 3);
                em1Sub2 = "XXX";
                em1 = em1Sub1 + em1Sub2;
                let em2Sub1 = em2.substr(0, 3);
                em2Sub1 = "XXX";
                let em2Sub2 = em2.substr(3, em2.length);
                em2 = em2Sub1 + em2Sub2;
                emailId = em1 + "@" + em2;
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
            totalDues = formatCurrency(totalDues);
        }
        if(creditCardSummary.hasOwnProperty("minAmtDue"))
        {
            minAmtDue = (creditCardSummary.minAmtDue);
            minAmtDue = formatCurrency(minAmtDue);
        }
        if(creditCardSummary.hasOwnProperty("paymentDueDate"))
        {
            paymentDueDate = creditCardSummary.paymentDueDate;
            paymentDueDate = paymentDueDate.split("-").join("/");
        }
        if(creditCardSummary.hasOwnProperty("creditLimit"))
        {
            creditLimit = (creditCardSummary.creditLimit);
            creditLimit = formatCurrency(creditLimit);
        }
        if(creditCardSummary.hasOwnProperty("availableCreditLimit"))
        {
            availableCreditLimit = (creditCardSummary.availableCreditLimit);
            availableCreditLimit = formatCurrency(availableCreditLimit);
        }
        if(creditCardSummary.hasOwnProperty("cashLimit"))
        {
            cashLimit = (creditCardSummary.cashLimit);
            cashLimit = formatCurrency(cashLimit);
        }
        if(creditCardSummary.hasOwnProperty("availableCashLimit"))
        {
            availableCashLimit = (creditCardSummary.availableCashLimit);
            availableCashLimit = formatCurrency(availableCashLimit);
        }
    };

    if(MyCardPage.hasOwnProperty("AddOnsInfo"))
    {
        let AddOnsInfo = MyCardPage.AddOnsInfo;
        if(AddOnsInfo.hasOwnProperty("addOns"))
        {
            adonsFilter = true;
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
                    transactionDetails:zTransaction.transactionDetails,
                    transactionType:zTransaction.transactionType,
                    amount:(zTransaction.amount==0)?"":zTransaction.amount
                })
            }
            addOns = newTransactionData;
            addonColumns = _(addOns).map('addoncardnumber').uniq().value();
        }
    }

    if(offers.hasOwnProperty("link1")){
        link1 = offers.link1;
    }
    if(offers.hasOwnProperty("dupWatermark")){
        dupWatermarkSrc = offers.dupWatermark;
    }

    var adOnsource = "<table cellspacing='0' style=\"width:100%;margin: 0 0 10px 0;font-family:Arial;font-size:12px;\" class=\"table\">" +
        "<thead style=\"margin:0px;padding:5px;height:15px;background-color:#cecece !important;border:1px solid #cecece;color:#212d3c;\"><td style=\"border:1px solid #cecece;padding:1px 5px;\">Date</td><td style=\"border:1px solid #cecece;padding:1px 5px;\">Transaction Details</td><td style=\"border:1px solid #cecece;padding:1px 5px;text-align:right;\">Amount(INR)</td><td style=\"border:1px solid #cecece;padding:1px 5px;\">Cr/Dr</td></thead>"+
        "<tbody style='border:1px solid #cecece;'>{{#each this}}"+
        "<tr style=\"background-color:#ebebeb !important;\">"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;\">{{this.date}}</td>"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;\">{{this.transactionDetails}}</td>"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;text-align: right;\">{{this.amount}}</td>"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;\">{{this.transactionType}}</td>"+
        "</tr>{{/each}}"+
        "</tbody>"+
        "</table>";

    var adOnTemplate = Handlebars.compile(adOnsource);
    //var result = adOnTemplate(data);
    var addonColumns = [];
    addonColumns = _(addOns).map('addoncardnumber').uniq().value();

    var rewardCashbackGrid;
    var tempRewardsGrid = "<table cellspacing='0' style=\"width:100%;margin: 0 0 10px 0;font-family:Arial;font-size:12px;\" class=\"table\">" +
        "<thead style=\"margin:0px;padding:5px;height:15px;background-color:#cecece !important;border:1px solid #cecece;color:#212d3c;\"><td style=\"border:1px solid #cecece;padding:1px 5px;\">Points earned so far</td><td style=\"border:1px solid #cecece;padding:1px 5px;\">Points earned this month</td><td style=\"border:1px solid #cecece;padding:1px 5px;\">Points redeemed this month</td><td style=\"border:1px solid #cecece;padding:1px 5px;\">Points available for redemption</td></thead>"+
        "<tbody style='border:1px solid #cecece;'>{{#each this}}"+
        "<tr style=\"background-color:#ebebeb !important;\">"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;\">{{this.TOT_CTD_EARNED}}</td>"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;\">{{this.TOT_YTD_EARNED}}</td>"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;\">{{this.TOT_CTD_DISB}}</td>"+
        "<td style=\"margin:0px;border:1px solid #cecece;padding:1px 5px;\">{{this.TOT_CTD_ADJ}}</td>"+
        "</tr>{{/each}}"+
        "</tbody>"+
        "</table>";

    var rewardsTemp = Handlebars.compile(tempRewardsGrid);
    rewardCashbackGrid = rewardsTemp(rewards);

    var offersImg = "<div style=\"width:100%;height:25px;font-size:16px;padding-top:5px;margin-top: 20px;font-family:Arial;\">Offers Of the Month</div>"+
                    "<div style=\"position: relative;top:0;width:100%;page-break-after:always;\">" +
                        "<img src=\""+link1+"\" style=\"width:100%;\"/>" +
                    "</div>";
    /*var custName = homePageData.overViewPage.customerInfo;
     var creditCardInfo = homePageData.overViewPage.creditCardSummary;
     var previousMonthSummary = homePageData.overViewPage.previousMonthSummary;*/
    var logoImg = homePageData.bannersImg.logo;
    var logo = "<div style=\"position: relative;top:0;width:100%;\"><img id=\"logoImgId\" src=\""+logoImg+"\" style=\"width:100%;\"/></div>"
    var adImg = "<div style=\"margin-top:0;width:100%;\"><img id=\"logoImgId\" src=\""+adImgSrc+"\" style=\"width:100%;\"/></div>"
    var dupWatermark = "<div style=\"margin-top:0;width:100%;position: fixed\"><img id=\"dupImgId\" src=\""+dupWatermarkSrc+"\" style=\"width:100%;\"/></div>";

    w.document.body.innerHTML= "<div style=\"width:750px;margin:0 auto;\">"+
        /*"<div class='no-print'>" +
            "<table style=\"width:100%;margin-bottom: 0;font-family:Arial;\">" +
                "<tr style=\"width:100%;height:50px;\">" +
                    "<td style=\"width:70%;height: 100%;font-size:18px;\">Print Preview</td>"+
                    "<td style=\"width:30%;height: 100%;\"><a href=\"javascript:void(window.open('http://www.htmltopdfconverter.net/?convert='+window.location))\">Convert To PDF</a></td>"+
                "</tr>"+
            "</table>"+
        "</div>"+*/
        logo+
        ((urlResult == 'dup')?dupWatermark:'')+
        "<table style=\"width:100%;height:150px;margin-top:10px;margin-bottom: 10px;font-family:Arial;font-size:13;\">" +
            "<tr>" +
                "<td style=\"width:48%;height: 100%;\">"+
                    "<div style=\"width:100%;height: 100%;border-radius: 10px; border: 2px solid #dcad67;\">"+
                    "<div style=\"background-color: #f7e8d4 !important;height: 22px;border-radius: 10px 10px 0 0;text-align: center;padding-top: 5px;font-family:Arial;\">Your Name & Address</div>"+
                    "<div style=\"width:100%;height: 130px;padding: 10px 20px;font-size:13px;\">"+
                    "<div>"+name+"</div>"+
                    "<div>"+address1+"</div>"+
                    "<div>"+address2+"</div>"+
                    "<div>"+address3+"</div>"+
                    "<div>"+addresscity+"</div>"+
                    "</div>"+
                    "</div>"+
                "</td>"+
                "<td style=\"width:4%;height: 100%;\"></td>"+
                "<td style=\"width:48%;height: 100%;\">"+
                    "<div style=\"margin-top:0;margin-bottom:10px;background-color: #f7e8d4 !important;height: 50px;border-radius: 10px;border: 2px solid #dcad67;text-align:center;font-size:13px;padding-top:6px;\">To update your email ID & Mobile number call us at <br/> YES touch customer care number 1800 103 6000</div>"+
                    "<div style=\"width:100%;height: 48px;border-radius: 10px; border: 2px solid #dcad67;margin-bottom:10px;\">"+
                    "<div style=\"background-color: #f7e8d4 !important;height: 20px;border-radius: 10px 10px 0 0;text-align: center;padding-top: 3px;\">Registered Mobile Number</div>"+
                    "<div style=\"width:100%;height: 40px;text-align: center;padding-top: 3;\">"+
                    "<h5 style=\"margin-top: 0;\">"+contactNo+"</h5>"+
                    "</div>"+
                    "</div>"+
                    "<div style=\"width:100%;height: 48px;border-radius: 10px; border: 2px solid #dcad67;\">"+
                    "<div style=\"background-color: #f7e8d4 !important;height: 20px;border-radius: 10px 10px 0 0;text-align: center;padding-top: 3px;\">Registered Email ID</div>"+
                    "<div style=\"width:100%;height: 40px;text-align: center;padding-top: 3;\">"+
                    "<h5 style=\"margin-top: 0;\">"+emailId+"</h5>"+
                    "</div>"+
                    "</div>"+
                "</td>" +
            "</tr>" +
        "</table>"+
        "<table style=\"width:100%;height:235px;margin-bottom: 0;font-family:Arial;\">" +
            "<tr style=\"width:100%;height:235px;\">" +
                "<td style=\"width:70%;height: 100%;\">"+
                    "<div style=\"margin-bottom: 5px;text-align: center;background-color: #f7e8d4 !important;height: 70px;border:1px solid #dcad67;\">"+
                        "<p style=\"font-weight: bold;font-size: 18px;text-align: center;padding-top: 5px;margin-bottom: 0;\">Overview</p>"+
                        "<p style=\"text-align: center;padding: 0;font-size: 14px;margin: 0;\">Statement for YES BANK Card Number "+cardNumber+"</p>"+
                    "</div>"+
                    "<table style=\"width:100%;height:160px;margin-bottom: 20px;font-family:Arial;text-align:right;font-size:13;\">" +
                        "<tr style=\"width:100%;height: 160px;margin: 0px;\">" +
                            "<td style=\"width:50%;height: 100%;padding: 20px 5px;background-color: #f7e8d4 !important;font-size: 13px;vertical-align: top;border:1px solid #dcad67;\">"+
                                "<div><b>Statement Period:</b></div>"+
                                "<div>"+statementPeriod+"</div>"+
                                "<hr style=\"text-align: center;margin: 6px 0;\"/>"+
                                "<div><b>Statement Date:</b><span>"+statementDate+"</span></div>"+
                                "<hr style=\"text-align: center;margin: 6px 0;\"/>"+
                                "<div><b>Total Amount Due:</b><div>Rs. "+totalDues+"</div>"+
                                "<hr style=\"text-align: center;margin: 6px 0;\"/>"+
                                "<div><b>Minimum Amount Due:</b></div>"+
                                "<div>Rs. "+minAmtDue+"</div>"+
                                "<hr style=\"text-align: center;margin: 6px 0;\"/>"+
                                "<div><b>Due Date:</b><span>"+paymentDueDate+"</span></div>"+
                            "</td>"+
                            "<td style=\"width:2%;height: 100%;\"/>"+
                            "<td style=\"width:48%;height: 100%;padding: 20px 5px;background-color: #f7e8d4 !important;font-size: 13px;vertical-align: top;border:1px solid #dcad67;\">"+
                                "<div><b>Credit Limit:</b></div>"+
                                "<div>Rs. "+creditLimit+"</div>"+
                                "<hr style=\"text-align: center;margin: 6px 0;\"/>"+
                                "<div><b>Available Credit Limit:</b></div>"+
                                "<div>Rs. "+availableCreditLimit+"</div>"+
                                "<hr style=\"text-align: center;margin: 6px 0;\"/>"+
                                "<div><b>Cash Limit:</b></div>"+
                                "<div>Rs. "+cashLimit+"</div>"+
                                "<hr style=\"text-align: center;margin: 6px 0;\"/>"+
                                "<div><b>Available Cash Limit:</b></div>"+
                                "<div>Rs. "+availableCashLimit+"</div>"+
                            "</td>"+
                        "</tr>"+
                    "</table>"+
                "</td>"+
                "<td style=\"width:1%;height: 100%;\"/>"+
                "<td style=\"width:29%;height: 100%;vertical-align: top;\">"+
                    "<div style=\"width:100%;height: 94.6%;font-size: 13px;border:1px solid black;padding-left:10px;\">"+
                    "<div><h4>Statement Summary</h4></div>"+
                    "<div style=\"margin-bottom: 7px;\">"+
                    "<div><b>Previous balance:</b></div>"+
                    "<div>Rs. "+priviousBalance+"</div>"+
                    "</div>"+
                    "<div style=\"margin-bottom: 7px;\">"+
                    "<div><b>Current Purchases / Cash Advance & Other Charges:</b></div>"+
                    "<div>Rs. "+currentPurchase+"</div>"+
                    "</div>"+
                    "<div style=\"margin-bottom: 7px;\">"+
                    "<div><b>"+earned+"</b></div>"+
                    "<div>"+ptEarned+"</div>"+
                    "</div>"+
                    "<div style=\"margin-bottom: 7px;\">"+
                    "<div><b>Payment & Credits Received:</b></div>"+
                    "<div>Rs. "+lastpaymnetRecive+"</div>"+
                    "</div>"+
                    "</div>"+
                "</td>"+
            "</tr>"+
        "</table>"+
        ((urlResult == 'dup' || urlResult == 'ib')?'':adImg)+
        /*"<div style=\"font-family:Arial;font-size:12px;margin:15px 0\">"+
            "<b>You can pay your YES BANK Credit Card Bill through YES BANK NetBanking, NEFT (IFSC Code : YESB0CMSNOC), Cheque Payment, Cash Payment across YES BANK Branches or from other Bank accounts through Billdesk Facility.</b>"+
        "</div>"+*/

        "<div style=\"background-color: #f7e8d4 !important;margin:0;padding: 15px;font-size: 13px;\">"+
        "<div style=\"font-family:Arial;\"><b>Important information:</b></div>"+
        "<div style=\"font-family:Arial;\">Please pay the total outstanding mentioned in your credit card statement, in full, by the payment due date to avoid interest charges.</div>"+
        "</div>"+
        "<table style=\"margin-top:0;width:100%;font-family:Arial;page-break-after:always;\">" +
        "<tr style=\"width:100%;\">" +
        "<td style=\"width:70%;height: 100%;padding: 5px;font-size: 17px;vertical-align: bottom;\"><h5>YES BANK Limited</h5></td>"+
        "<td style=\"width:30%;height: 100%;padding: 5px;font-size: 17px;vertical-align: bottom;\"><h6>Visit us at <b>www.yes.bank</b></h6></td>"+
        "</tr>"+
        "</table>"+
        "<div style=\"width:100%;height:35px;font-size:16px;padding-top:5px;font-family:Arial;\">Transaction Details</div>"+
        result+
        "<div style=\"width:100%;height:35px;font-size:16px;padding-top:5px;font-family:Arial;\">Other Cards</div>"+
        _.map(addonColumns, (c)=>("<div>Card Number : "+c+"</div>"+
        adOnTemplate(addOns.filter(function(addonData) {
            return (addonData.addoncardnumber == c)}))))+
        "<div style=\"width:100%;height:30px;font-size:16px;padding-top:5px;font-family:Arial;\">Your Reward Points Summary</div>"+
        rewardCashbackGrid+
        "<div style=\"width:100%;height:35px;font-size:14px;padding-top:5px;font-family:Arial;page-break-after:always;\">To redeem Your Reward points from a wide range of options, please visit www.yesrewardz.com/creditcard</div>"+
        ((urlResult == 'dup'|| urlResult == 'ib')?'':offersImg)+
        "<div style=\"width:100%;height:25px;font-size:16px;font-family:Arial;text-align:center;margin-top:20px;\"><u>Terms and Conditions</u></div>"+
        "<table style=\"width:100%;margin-bottom: 0;font-family:Arial;font-size:10px;\">"+
            "<tr style=\"width:100%;\">"+
                "<td valign='top'; style=\"width:49%;height: 100%;\">"+
                    "<div><strong>A. FINANCE CHARGES</strong></div>"+
                    "<ul style=\"padding-left:13px\">"+
                        "<li>Finance charges are payable at the monthly percentage rate on all transactions from the date of transaction in the event of the Cardmember choosing not to pay his balance in full, and on all cash advances taken by the Cardmember, till they are paid back.</li>"+
                        "<li><strong>Finance charges, if payable, are debited to Cardmember’s account till the outstanding on the Card is paid in full.</strong></li>"+
                        "<li>Finance charges on cash advances are applicable from the date of transaction until the payment is made in full.</li>"+
                        "<li>When the Cardmember carries forward any outstanding amount or avails any cash advance, a finance charge calculated by average ‘Daily Balance Method’, will apply to balances carried forward and to fresh billings, till such time the previous outstanding amounts are repaid in full.</li>"+
                        "<li>Please note that the Finance charges and other charges are subject to change at the discretion of YES BANK Limited(\"<strong>YES BANK</strong>\").</li>"+
                        "<li><strong>Making only the minimum payment every month would result in the repayment stretching over years with consequent interest payment on your outstanding balance.</strong></li>"+
                    "</ul>"+
                    "<div><strong>Please refer to following illustration for understanding the calculation of finance charges on revolving credit.</strong></div>"+
                    "<table cellspacing='0' style=\"width:100%;margin: 0 0 10px 0;font-family:Arial;font-size:10px;\">"+
                        "<thead style=\"margin:0px;padding:5px;height:15px;border:1px solid #cecece;border:1px solid #cecece;color:#212d3c;\">"+
                            "<th width='50px' style='border:1px solid #cecece;padding:1px 5px;'>Date</th>"+
                            "<th style='border:1px solid #cecece;padding:1px 5px;'>Transaction</th>"+
                            "<th style='border:1px solid #cecece;padding:1px 5px;'>Amount</th>"+
                        "</thead>"+
                        "<tbody style='border:1px solid #cecece;'>"+
                            "<tr>"+
                                "<td width='60px' style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">2nd June</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Purchase of Apparel</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Rs. 5,000</td>"+
                            "</tr>"+
                            "<tr>"+
                                "<td width='60px' style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">14th June</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Purchase of Grocery</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Rs. 1,000</td>"+
                            "</tr>"+
                            "<tr>"+
                                "<td width='60px' style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">20th June</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Statement date</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Total Amount Due = Rs 6,000 Minimum Amount Due = Rs 300</td>"+
                            "</tr>"+
                            "<tr>"+
                                "<td width='60px' style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">10th July</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Payment realized on the card account</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Rs 1,000 (Credit)</td>"+
                            "</tr>"+
                            "<tr>"+
                                "<td width='60px' style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">14th July</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Purchase of groceries</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Rs 1,000</td>"+
                            "</tr>"+
                            "<tr>"+
                                "<td width='60px' style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">20th July</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Statement date</td>"+
                                "<td style=\"margin:0px;padding:1px 5px;border:1px solid #cecece;\">Total Amount Due = Rs 6,209.16 Minimum Amount Due = Rs 310.46</td>"+
                            "</tr>"+
                        "</tbody>"+
                    "</table>"+
                    "<div>It is assumed that the Cardmember has paid all previous dues in full and does not have any amount outstanding in his/her YES BANK Credit Card account.</div>"+
                    "<div>Cardmember's statement date is 20th of every month. The following is the list of transactions the Cardmember has done on his/her Card account.</div>"+
                    "<div>On the statement dated 20th July, the following will reflect as the components of the total amount payable by the Cardmember: Interest calculated = (outstanding amount x 1.99% pm x 12months x no of days) /365</div>"+
                    "<div>Interest calculated = (outstanding amount x 1.99% pm x 12months x no of days) /365</div>"+
                    "<div>Interest on Rs 5,000@1.99%pm from 2nd June to 9th July (i.e. for 38 days) = Rs 124.31</div>"+
                    "<div>Interest on Rs 1,000@1.99%pm from 14th June to 9th July (i.e. for 26 days) = Rs 17.01</div>"+
                    "<div>Interest on Rs 5,000@ 1.99%pm from 10th July to 20th July (i.e. for 11 days) = Rs 35.9</div>"+
                    "<div>Interest on Rs 1,000 (fresh spends) @1.99%pm from 14th July to 20th July (i.e. for 7 days) = Rs 4.58</div>"+
                    "<div><strong>a) Total interest of Rs 181.88</div>"+
                    "<div><strong>b)</strong>Service tax @ 14%, Swachh Bharat Cess of 0.5% & Krishi Kalyan Cess of 0.5% on the interest amount = Rs. 27.28</div>"+
                    "<div><strong>c)</strong>Total Principal amount outstanding= Rs 6,000 (Rs 1000 fresh spend + balance Rs 5,000 outstanding from last month's billing period) <br/>Hence Total Amount Due: (a) + (b) + (c) = Rs. 6,209.16 <br/>"+
                    "<div><strong>B. PAYMENT OPTION</strong></div>"+
                    "<ul style=\"padding-left:13px\">"+
                        "<li>In case the Cardmember has a bank account with YES BANK, payment can be made via ATM/Netbanking/ Standing Instructions (SI)</li>"+
                        "<li>Cardmember can make payment through NEFT from other bank account (use IFSC code YESB0CMSNOC), or through BillDesk facility using other bank’s NetBanking account.</li>"+
                        "<li>Cardmember can also make payment by dropping the cheque or draft into any of the YES BANK Credit Card drop boxes placed in the YES BANK branches and ATM’s. Cheque / Draft should be made payable to ‘YES BANK Credit Card Number XXXX XXXX XXXX XXXX’ </li>"+
                        "<li>Cardmember can also make payment through cash in YES BANK branches. Please refer schedule of charges for applicable charge(s) for cash payments in Credit Card account.</li>"+
                        "<li>Cardmember can login into the below link and initiate payment from their respective Bank’s login with 16-digit Credit Card number. Link: <a href=\"https://pgi.billdesk.com/pgidsk/pgmerc/ybkcard/index.jsp\" target=\"_blank\">https://pgi.billdesk.com/pgidsk/pgmerc/ybkcard/index.jsp</a></li>"+
                    "</ul>"+
                "</td>"+
                "<td style=\"width:3%;height: 100%;\">"+
                "<td valign='top' style=\"width:48%;height: 100%;\">"+
                    "<div><strong>C. BILLING DISPUTES</strong></div>"+
                        "<p>Statement Disputes: All the contents of the statement shall be deemed to be correct and accepted if the Cardmember does not inform YES BANK, in writing, of the discrepancies within 60 days from the statement date. On receipt of such information, YES BANK may reverse the charge(s) on temporary basis pending investigation. If on completion of subsequent investigations, the liability of such charges is to the Cardmember's account, the charges shall be reinstated in subsequent statement along with the associated retrieval requests charges. Upon receipt of dispute from the Cardmember, within a maximum period of sixty days, YES BANK will provide necessary documents, wherever applicable and received from the member bank, subject to operating guidelines laid down by the respective network partners.</p><br/>"+
                    "<div><strong>D. Billing</strong></div>"+
                        "<p>YES BANK will send the Cardmember a monthly statement showing the payments credited and the transactions debited to the Card account since the last statement.</p>"+
                        "<p>YES BANK will mail / email a statement of transactions in the Card account every month on a pre determined date, to the mailing address / email address on record with YES BANK. If the balance outstanding is less than Rs.100/- and there is no further transaction pending billing since last statement, no statement will be issued</p><br/>"+
                    "<div><strong>E. INTEREST FREE PERIOD</strong></div>"+
                        "<p>Cardmember can avail interest free credit period of up to 50 days subject to the scheme applicable on the specific credit Card (please refer to the schedule of charges as annexed herein). However, interest free period is not applicable if the previous month's statement balance has not been cleared in full on or before the due date. The same will also not be applicable if the Cardmember has withdrawn cash from ATM.</p><br/>"+
                    "<div><strong>Illustrative Example for Interest Free Credit Period Calculation:</strong></div>"+
                    "<div>Let us assume that the payment due date for a Credit Card falls on 25th May, and previous month's dues have been paid in full, the grace period would be:</div>"+
                    "<div>1. For a purchase dated 6th April, interest free credit period is 6th April to 25th May = 50 days.</div>"+
                    "<div>2. For a purchase dated 17th April, interest free grace period is 17th April to 25th May = 39 days.</div><br/>"+
                    "<div><strong>F. GRIEVANCE REDRESSAL</strong></div>"+
                        "<p>If you are not satisfied with our services and/or response given by any of our access channels, you may call us at 1800 103 6000 (Toll free) / 022 - 49350000 or send an email to <strong>yesfirstcc@yesbank.in </strong> For any escalations, you may contact our principal nodal officer Mr. Ratan Kumar Kesh, at YES BANK Limited, 22nd Floor, IFC, YES BANK Tower, Elphinstone (W), Mumbai – 400013. Email: <strong>principal.nodalofficer@yesbank.in</strong>Phone No: 0124-4619044 between 09.30 am to 05.30 pm Monday to Friday.</p>"+
                        "<p>In the event that you do not receive any response within 1 (One) month from the date you represented your complaint to the above mentioned channels, or if you are dissatisfied with the response provided, you may write to the banking ombudsman for an independent review. Please visit the grievance redressal webpage on www.rbi.org.in for details on the Banking Ombudsman scheme.</p><br/>"+
                        "<div><strong>G.	24*7 YES TOUCH Customer Care</strong></div>"+
                        "<div><strong>Phone</strong>- 1800 103 6000 (Toll free) / 022 - 49350000 </div>"+
                        "<div><strong>Email</strong>- yesfirstcc@yesbank.in</div>"+
                "</td>"+
            "</tr>"+
        "</table><br/>"+
        "<div style=\"width:100%;font-family:Arial;font-size:10px;page-break-before:always;margin-top:20px;\"><strong>H.SCHEDULE OF CHARGES</strong></div>"+
        "<div style=\"margin-top:10px;padding:5px;height:30px;border:1px solid #cecece;color:#212d3c;text-align:center;\">YES FIRST "+(sType==302?'BUSINESS CREDIT CARD':'PREFERRED/EXCLUSIVE')+"</div>"+
        "<table cellspacing='0' style=\"width:100%;margin: 0 0 10px 0;font-family:Arial;font-size:10px;text-align:center;\">"+
            "<thead style=\"margin:0px;padding:1px 5px;height:15px;border:1px solid #cecece;color:#212d3c;\">"+
                "<th style='border:1px solid #cecece;padding:1px 5px;text-align:center;'>Joining Fees</th>"+
                "<th style='border:1px solid #cecece;padding:1px 5px;text-align:center;'>NIL</th>"+
            "</thead>"+
            "<tbody style='border:1px solid #cecece;'>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Annual Membership Fee (First Year and Renewal)</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>"+(sType==302?'Rs 5000 + Taxes Applicable':'Preferred: Rs 2,500/-, Exclusive: Rs. 10,000/- (+Taxes as applicable) (For first year, fee is charged in first statement. For every renewal, Annual Fee is charged in first statement post renewal)')+"</td>"+
            "</tr>"+
            (sType==302?
                "<tr>"+
                    "<td style='border:1px solid #cecece;padding:1px 5px;'>Spend Condition for waiver of Annual Charges (Only applicable on retail spend transaction)</td>"+
                    "<td style='border:1px solid #cecece;padding:1px 5px;'>Not Applicable</td>"+
                "</tr>":null
            )+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Interest Free Period</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Upto 50 days</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Minimum Amount Due (MAD)</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Minimum of 5% of total payment due as per statement or Rs 200, whichever is higher</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Cash Advance Limit</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>30% of Credit Limit</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Add-on Card Fee</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>No Joining Fee, No Annual Fee (Maximum Upto 3 Add-On Cards can be issued)</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Finance Charges on Revolving Credit on Cash advance and/or  Overdue amount</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>"+(sType==302?'For YES BANK Current/Savings/Business Banking Account holders – 1.20% per month (ie. 14.40% annualized) Others – 1.99% per month (ie. 23.88% annualized)':'For YES BANK Savings and Salary Account Holders- 1.20% per month (i.e 14.40% annualized)Others- 1.99% per month (i.e 23.88% annualized)')+"</td>"+
            "</tr>"+
            "<tr>"+
                "<td valign='middle' style='border:1px solid #cecece;padding:1px 5px;'>"+(sType==302?'Late Payment Charges (LPC) (Per Statement, as per the statement balance)':'Late Payment Charges')+"</td>"+
                "<td style='padding:0;'>"+
                    "<table cellspacing='0' style=\"width:100%;font-size:10px;text-align:center;\""+
                        "<tr><td style='padding:1px 5px;border:1px solid #cecece;'>For Statement Balance &lt;100- LPC - Nil</td></tr>"+
                        "<tr><td style='padding:1px 5px;border:1px solid #cecece;'>101-500"+(sType==302?'-LPC - ':';')+" Rs.100</td></tr>"+
                        "<tr><td style='padding:1px 5px;border:1px solid #cecece;'>501-5,000"+(sType==302?'-LPC - ':';')+" Rs.400</td></tr>"+
                        "<tr><td style='padding:1px 5px;border:1px solid #cecece;'>5,001-20,000"+(sType==302?'-LPC - ':';')+" Rs.500</td></tr>"+
                        "<tr><td style='padding:1px 5px;border:1px solid #cecece;'>&gt;20,000"+(sType==302?'-LPC - ':';')+" Rs.700</td></tr>"+
                    "</table>"+
                "</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Overdue Fee</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>2.5% of overlimit amount or Rs 500, whichever is higher per instance</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Cash Advance Fee</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>2.5% of amount withdrawn or Rs.300, whichever is higher</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Payment Return Charges: Cheques/Auto pay</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Rs 350 (Per instance of cheque or Autopay Return)</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Reward Redemption Fee</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>"+(sType==302?'Rs 100 per redemption request':'Rs 100 per redemption request (waived for Exclusive)')+"</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>"+(sType==302?'Fuel Surcharge Waiver (Service Tax and other Cess levied on fuel surcharge will not be reversed)':'Fuel surcharge Waiver')+"</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Valid for Transaction between Rs 400/- to Rs 5,000/- only. Maximum surcharge waiver in a statement cycle "+(sType==302?'is Rs 1000':'(For Preferred: Rs 500, For Exclusive: Rs 1,000/-)')+")</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Re-issue of Lost, Stolen or Damaged Card</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>"+(sType==302?'Rs 100 (Per reissuance)':'Rs 100 for Preferred & NIL for Exclusive')+"</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Foreign Currency Conversion Charges</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>1.75%</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Outstation Cheque Processing Fee</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>"+(sType==302?'Rs 25 (Per Outstation Cheque)':'Rs. 25 for Cheque Value less than Rs 5,000/-, Rs. 50 for Cheque Value more than Rs. 5,000/-')+"</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Duplicate Statement (Statement older than 6 months)</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Rs. 100 per statement</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Cash deposit at YES BANK Branches towards Credit Card repayment</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Rs. 100</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>"+(sType==302?'Railway Ticket on IRCTC':'Railway ticket booking and cancellation surcharge (On Counters)')+"</td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>"+(sType==302?'As per IRCTC website':'As per charges applicable on IRCTC website')+"</td>"+
            "</tr>"+
            "<tr>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Service Tax, Swachh Bharat Cess & Krishi Kalyan Cess </td>"+
                "<td style='border:1px solid #cecece;padding:1px 5px;'>Applicable on all fee and charges (14% Service Tax, and 0.5% Swachh Bharat Cess and 0.5% Krishi Kalyan Cess</td>"+
            "</tr>"+
            "</tbody>"+
        "</table>"+
    "</div>"
    ;

    if (is_chrome) {
        setTimeout(function() { // wait until all resources loadedl
            w.print(); // change window to winPrint
            w.close(); // change window to winPrint
        }, 250);
    } else {
        w.document.close(); // necessary for IE >= 10
        w.focus(); // necessary for IE >= 10
        w.print();
    }
}