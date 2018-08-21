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
import conn from "../conn"

var endpoint = config.serverURL + '/callback'
var summaryLbl = "Reward Points";
var sType = "204";
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

export default class  MyRewardForm extends React.Component {
    constructor(props, context) {
        super(props);
        let customer = content.CUSTOMER;
        if(customer.hasOwnProperty("statementType")){
            sType = customer.statementType;
        }
        if(sType == "103" || sType == "104")
        {
            summaryLbl = "Cashback";
        }
        else
        {
            summaryLbl = "Reward Points";
        }
    }

    rewardGrid(){
        let customer = content.CUSTOMER;
        //let MyCardPage = content.CUSTOMER.myCardPage;
        //let OverViewPage = customer.overViewPage;
        var rewards = [];
        var rewardArr = [];
        
        if(customer.hasOwnProperty("statementType")){
            sType = customer.statementType;
        }

        if(customer.hasOwnProperty("myCardPage")) {
            let MyCardPage = customer.myCardPage;
            if(MyCardPage.hasOwnProperty("rewardSummary")) {
                let tempStatementtable = MyCardPage.rewardSummary;
                rewardArr.push(tempStatementtable);
                console.log("tempStatementtable==>"+JSON.stringify(tempStatementtable));
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
            }
            else{
                rewardArr.push(fdCashback);
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
                console.log("rewards==>"+JSON.stringify(rewards));
            }
            else{
                rewards.push(fdRewards);
            } 
        }
        

        if(sType == "103" || sType == "104")
        {
            return (<Griddle results={rewardArr} tableClassName="table" showFilter={false} showPager={false}
                     showSettings={false} columns={["openingBalance","earned", "disbursed", "adjusted", "closingBalance"]}
                     columnMetadata={Cashback_Metadata}/>);
        }
        else
        {
            return(<Griddle results={rewards} tableClassName="table" showFilter={false} showPager={false}
                     showSettings={false} columns={["TOT_CTD_EARNED","TOT_YTD_EARNED", "TOT_CTD_DISB", "TOT_CTD_ADJ"]}
                     columnMetadata={Rewards_Metadata}/>);
        }
    }

    render() {
        return (
            <div className="pageStyle">
                <br/>
                <div className="mainHeadingStyle"><h3>{"Your "+summaryLbl+"  Summary"}</h3></div>
                <div className="scrollDiv">
                    {this.rewardGrid()}
                </div>
                <br/><br/>
                <div><h4>{"To redeem Your "+summaryLbl+" from a wide range of options, please visit "}<a href="https://www.yesrewardz.com/creditcard" target="_blank">www.yesrewardz.com/creditcard</a></h4></div>
            </div>
        );
    }
}

//module.exports = MyRewardForm;

MyRewardForm.contextTypes = {
    router: React.PropTypes.func
};


let Cashback_Metadata = [
    {
        columnName: 'openingBalance',
        displayName: 'Cashback on Movie Spends'
    },
    {
        columnName: 'earned',
        displayName: 'Cashback on Grocery Spends'
    },

    {
        columnName: 'disbursed',
        displayName: 'Cashback on Bill Payment'
    },
    {
        columnName: 'adjusted',
        displayName: 'Cashback on Others Spends'
    },
    {
        columnName: 'closingBalance',
        displayName: 'Total Cashback for the month'
    }
];

let Rewards_Metadata = [
    {
        columnName: 'TOT_CTD_EARNED',
        displayName: 'Points earned so far'
    },
    {
        columnName: 'TOT_YTD_EARNED',
        displayName: 'Points earned this month'
    },

    {
        columnName: 'TOT_CTD_DISB',
        displayName: 'Points redeemed this month'
    },
    {
        columnName: 'TOT_CTD_ADJ',
        displayName: 'Points available for redemption'
    }
];