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
import ReactDOM from 'react-dom';
var s;


var endpoint = config.serverURL + '/callback'

var AmtValue = React.createClass({
    formatCurrency(nStr)
    {
        //return numeral(val).format("0,000.00");

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
    render: function(){
        let amt = this.props.data;
        if(amt == "" || amt == 0.00)
        {
            return <span></span>
        }

        else {
            amt = this.props.data;
            amt = this.formatCurrency(amt);
            return <span>{amt}</span>
        }
    }
});

var DateValue = React.createClass({
    render: function() {
        let date = this.props.data;
        if (date == "") {
            return <span></span>
        }
        else {
            date = this.props.data;
            let year = date.substr(0,4);
            let month = date.substr(4,2);
            let dt = date.substr(6,2);
            date = dt+"/"+month+"/"+year;
            return <span>{date}</span>
        }
    }
});


class TransactionItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {collapsed: true};
    }

    onClick(e) {
        e.preventDefault();
        this.setState({collapsed: !this.state.collapsed});
    }

    render() {

        let answer;
        if (!this.state.collapsed) {
            answer = (
                <div>
                    {this.props.children}
                </div>
            );
        } else {

        }

        return (
            <div className="cardAccordionStyle">
                <button onClick={this.onClick.bind(this)}>
                    {this.props.question}
                </button>
                {answer}
            </div>
        );
    }
}

let columns = ['Date','Transaction Description', 'Amount(INR)','cr/dr','select'];

let AddOnTable = ({items, card, adonsFilter})=>(
    <div className="scrollDiv">
        <div className="addonHeaderStyle">Other Card Number : {card}</div>
        <Griddle results={items} tableClassName="table"
                 showFilter={adonsFilter} showPager={false} filterPlaceholderText="Type here to search"
                 columnMetadata={addOnsCols} showSettings={false}  resultsPerPage={items.length}
                 columns={["sortDate","transactionDetails","amount","transactionType"]}
                 noDataMessage="No Add on card Transactions to display"/>
    </div>
)

export default class CreditTransactionForm extends React.Component {


    onShowMode(e) {
        this.context.viewModel.showMode = e.target.value;
        s=e.target.value;

    }

    onRowClick(row, e) {
        if (e.target.className == "print-checkbox") {
            row.props.data.selected = e.target.checked;
            row.forceUpdate();
        }
    }

    dynAddonGrid(){
        /*let MyCardPage = content.CUSTOMER.myCardPage;
        var addOns = [];
        var adonsFilter = false;
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
                        cardNo:zTransaction.cardNo,
                        sortDate:(zTransaction.amount==0)?"":zdate,
                        date:zTransaction.date,
                        transactionDetails:zTransaction.transactionDetails,
                        transactionType:zTransaction.transactionType,
                        amount:(zTransaction.amount==0)?"":zTransaction.amount
                    })
                }
                addOns = newTransactionData

                let addonColumns = _(addOns).map('cardNo').uniq().value();
                console.log("addonColumns=>"+addonColumns.length);
                for(var card in addonColumns){
                    let cardTemp = addonColumns[card];
                    console.log("cardTemp=>"+cardTemp);
                    let cardNoData = addOns.filter(function(addOnsData) {
                        return (addOnsData.cardNo == cardTemp)
                    });
                    console.log("cardNoData=>"+JSON.stringify(cardNoData));
                    var fooElem = document.getElementById('addOnDiv');
                    if(fooElem) {
                        fooElem.innerHTML = "<div>" +
                            "<div>"+cardTemp+"</div>" +
                            "<Griddle results={"+cardNoData+"} tableClassName=\"table\"" +
                            "showFilter={"+adonsFilter+"} showPager={false} filterPlaceholderText=\"Type here to search\"" +
                            "columnMetadata={addOnsCols} showSettings={false}  enableInfiniteScroll={true} bodyHeight={288}" +
                            "columns={[\"sortDate\",\"transactionDetails\",\"amount\",\"transactionType\"]}" +
                            "noDataMessage=\"No Add on card Transactions to display\"/></div>"
                    }*/

                    /*return (<div>
                        <div>{cardTemp}</div>
                        <Griddle results={cardNoData} tableClassName="table"
                                 showFilter={adonsFilter} showPager={false} filterPlaceholderText="Type here to search"
                                 columnMetadata={addOnsCols} showSettings={false}  enableInfiniteScroll={true} bodyHeight={288}
                                 columns={["sortDate","transactionDetails","amount","transactionType"]}
                                 noDataMessage="No Add on card Transactions to display"/>
                    </div>);*/
                    /*ReactDOM.render(<AddOnTable items={cardNoData} card={card} adonsFilter={adonsFilter}/>, document.getElementById('addOnDiv'));*/
                //}
            //}
        //}
    }

    render() {
        //let data = this.props.data;
        //let TransactionsInfo = content.CUSTOMER.myCardPage.TransactionsInfo; //content.creditTransactions;
        let customer = content.CUSTOMER;
        //let MyCardPage = content.CUSTOMER.myCardPage;
        var addOns = [];
        var addOnsArr = [];
        var statementtable = [];
        var domestic = [];
        var international = [];
        var statementtableArr = [];
        var showAllFilter = false;
        var domesticFilter = false;
        var internationalFilter = false;
        var adonsFilter = false;
        var addonColumns = [];

        if(customer.hasOwnProperty("myCardPage")){
            let MyCardPage = customer.myCardPage;
            if(MyCardPage.hasOwnProperty("TransactionsInfo"))
            {
                let TransactionsInfo = MyCardPage.TransactionsInfo;
                if(TransactionsInfo.hasOwnProperty("transaction"))
                {
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
                                countrycode:zTransaction.countrycode,
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
                            countrycode:zTransaction.countrycode,
                            description:zTransaction.description+' – Ref No: '+zTransaction.referenceCode,
                            CardSequenceNumber:zTransaction.CardSequenceNumber,
                            amount:(zTransaction.amount==0)?"":zTransaction.amount,
                            transactionType:zTransaction.transactionType
                        })
                    }

                    /*newTransactionData = _.sortBy(newTransactionData, "sortDate");*/
                    statementtable = newTransactionData;

                    showAllFilter = true;
                    let domesticTemp = statementtable.filter(function(statementdata) {
                        let countryCode = "dom";
                        let transactionCode = (statementdata.transactionCode).substr(0,statementdata.transactionCode.length-1);
                        transactionCode = (transactionCode.length==2)?'00'+transactionCode:((transactionCode.length==3)?'0'+transactionCode:((transactionCode.length==4)?transactionCode:transactionCode));
                        if(transactionCode == '0100'){
                            if(statementdata.countrycode == "IND" || statementdata.countrycode == "NPL" || statementdata.countrycode == "BTN"){
                                countryCode = "dom";
                            }
                            else{
                                countryCode = "foreign";
                            }
                        }

                        return (transactionCode != '0120' && transactionCode != '0096' && transactionCode != '0115' && transactionCode != '0170' && transactionCode != '0175' && transactionCode != '0248' && transactionCode != '0249' && transactionCode != '0946' && transactionCode != '0298' && transactionCode != '0299' && transactionCode != '0698' && transactionCode != '0699' && transactionCode != '0947' && countryCode != "foreign")});

                    if(domesticTemp.length > 0) {
                        domesticFilter = true;
                        domestic = statementtable.filter(function(statementdata) {
                            let countryCode = "dom";
                            let transactionCode1 = (statementdata.transactionCode).substr(0,statementdata.transactionCode.length-1);
                            transactionCode1 = (transactionCode1.length==2)?'00'+transactionCode1:((transactionCode1.length==3)?'0'+transactionCode1:((transactionCode1.length==4)?transactionCode1:transactionCode1));
                            if(transactionCode1 == '0100'){
                                if(statementdata.countrycode == "IND" || statementdata.countrycode == "NPL" || statementdata.countrycode == "BTN"){
                                    countryCode = "dom";
                                }
                                else{
                                    countryCode = "foreign";
                                }
                            }
                            return (transactionCode1 != '0120' && transactionCode1 != '0096' && transactionCode1 != '0115' && transactionCode1 != '0170' && transactionCode1 != '0175' && transactionCode1 != '0248' && transactionCode1 != '0249' && transactionCode1 != '0946' && transactionCode1 != '0298' && transactionCode1 != '0299' && transactionCode1 != '0698' && transactionCode1 != '0699' && transactionCode1 != '0947' && countryCode != "foreign")});
                    }

                    let internationalTemp = statementtable.filter(function(statementdata) {
                        let countryCode = "dom";
                        let transactionCode2 = (statementdata.transactionCode).substr(0,statementdata.transactionCode.length-1);
                        transactionCode2 = (transactionCode2.length==2)?'00'+transactionCode2:((transactionCode2.length==3)?'0'+transactionCode2:((transactionCode2.length==4)?transactionCode2:transactionCode2));
                        if(transactionCode2 == '0100'){
                            if(statementdata.countrycode != "IND" && statementdata.countrycode != "NPL" && statementdata.countrycode != "BTN"){
                                countryCode = "foreign";
                            }
                        }
                        return (transactionCode2 == '0120' || transactionCode2 == '0096' || transactionCode2 == '0115' || transactionCode2 == '0170' || transactionCode2 == '0175' || transactionCode2 == '0248' || transactionCode2 == '0249' || transactionCode2 == '0946' || transactionCode2 == '0298' || transactionCode2 == '0299' || transactionCode2 == '0698' || transactionCode2 == '0699' || transactionCode2 == '0947' || countryCode == "foreign")});

                    if(internationalTemp.length > 0) {
                        internationalFilter = true;
                        international = statementtable.filter(function(statementdata) {
                            let countryCode = "dom";
                            let transactionCode3 = (statementdata.transactionCode).substr(0,statementdata.transactionCode.length-1);
                            transactionCode3 = (transactionCode3.length==2)?'00'+transactionCode3:((transactionCode3.length==3)?'0'+transactionCode3:((transactionCode3.length==4)?transactionCode3:transactionCode3));
                            if(transactionCode3 == '0100'){
                                if(statementdata.countrycode != "IND" && statementdata.countrycode != "NPL" && statementdata.countrycode != "BTN"){
                                    countryCode = "foreign";
                                }
                            }

                            return (transactionCode3 == '0120' || transactionCode3 == '0096' || transactionCode3 == '0115' || transactionCode3 == '0170' || transactionCode3 == '0175' || transactionCode3 == '0248' || transactionCode3 == '0249' || transactionCode3 == '0946' || transactionCode3 == '0298' || transactionCode3 == '0299' || transactionCode3 == '0698' || transactionCode3 == '0699' || transactionCode3 == '0947' || countryCode == "foreign")});
                    }

                }
            }

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
        

        return (
            <div className="col-xs-12 container-class">
                <br/>
                <div>
                    <TransactionItem question="Show All">
                        <div className="scrollDiv">
                            <Griddle results={statementtable} tableClassName="table"
                                     showFilter={showAllFilter} showPager={false}
                                     columnMetadata={CreditTransactionForm_Data} showSettings={false} resultsPerPage={statementtable.length}
                                     filterPlaceholderText="Type here to search"
                                     columns={["sortDate","description","amount","transactionType"]}
                                     noDataMessage="No Transactions to display"/>
                        </div>
                    </TransactionItem>
                    <TransactionItem question="Domestic">
                        <div className="scrollDiv">
                        <Griddle results={domestic} tableClassName="table" showFilter={domesticFilter} showPager={false}
                                 columnMetadata={CreditTransactionForm_Data} showSettings={false} resultsPerPage={domestic.length}
                                 filterPlaceholderText="Type here to search"
                                 columns={["sortDate","description","amount","transactionType"]}
                                 noDataMessage="No Domestic Transactions to display"/></div>
                    </TransactionItem>
                    <TransactionItem question="International">
                        <div className="scrollDiv">
                        <Griddle results={international} tableClassName="table" showFilter={internationalFilter} showPager={false}
                                 columnMetadata={CreditTransactionForm_Data} showSettings={false} resultsPerPage={international.length}
                                 filterPlaceholderText="Type here to search"
                                 columns={["sortDate","description","amount","transactionType"]}
                                 noDataMessage="No International Transactions to display"/></div>
                    </TransactionItem>
                    <TransactionItem question="Other Cards">
                            {_.map(addonColumns, (c)=><AddOnTable items={addOns.filter(function(addonData) {
                            return (addonData.addoncardnumber == c)})} card={c} adonsFilter={adonsFilter}/>)}
                    </TransactionItem>
                </div>
                <br/>
                <br/><br/>
                <br/>
            </div>
        );
    }
}

var fdStatementTable =  [
    {
        "transactionDate": "",
        "description": "",
        "amount": "",
        "transactionCode": ""
    }
];

var fdAddons =  [
    {
        "date": "",
        "transactionDetails": "",
        "amount": ""
    }
];

let CreditTransactionForm_Data = [
    {
        columnName: 'sortDate',
        displayName: 'Date',
        sortable: false,
        customComponent:DateValue,
        cssClassName:"dateWidth"
    },
    {
        columnName: 'description',
        displayName: 'Transaction Description'
    },
    {
        columnName: 'amount',
        displayName: 'Amount (INR)',
        cssClassName:"amtStyle",
        customComponent:AmtValue
    },
    {
        columnName: 'transactionType',
        displayName: 'Cr/Dr',
        cssClassName:"crDrStyle"
    }
];

let addOnsCols = [
    {
        columnName: 'sortDate',
        displayName: 'Date',
        customComponent:DateValue,
        cssClassName:"dateWidth"
    },
    {
        columnName: 'transactionDetails',
        displayName: 'Transaction Details',
    },
    {
        columnName: 'amount',
        displayName: 'Amount (INR)',
        cssClassName:"amtStyle",
        customComponent:AmtValue
    },
    {
        columnName: 'transactionType',
        displayName: 'Cr/Dr',
        cssClassName:"crDrStyle"
    }
];
//module.exports = CreditTransactionForm;


CreditTransactionForm.contextTypes = {
    router: React.PropTypes.func
};


