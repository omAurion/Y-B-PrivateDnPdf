import React from "react";
import {Route, NotFoundRoute, DefaultRoute, RouteHandler, Link} from "react-router";
import _ from "lodash";
import content from "../content";
var sType = "101";
var summaryLbl = "My Rewards";

export default class CreditForm extends React.Component {
    constructor(props, context) {
        super(props);
        let customer = content.CUSTOMER;
        if(customer.hasOwnProperty("statementType")){
            sType = customer.statementType;
        }
        if(sType == "103" || sType == "104")
        {
            summaryLbl = "My Cashback";
        }
        else
        {
            summaryLbl = "My Reward";
        }
    }
    render() {
        var route = _.last(this.context.router.getCurrentRoutes());
        var name = route.name;

        return (
            <div className="pageStyle">
                <div className="containerMiddle customNavStyle">
                    <div className="row">
                        <div className="col-md-4 col-sm-2"></div>
                        <div className="col-md-8 col-sm-10 col-xs-12">
                            <ul>
                                <li id="transactionTab">
                                    <Link to="credit-transaction">My Transaction</Link>
                                </li>
                                <li id="myRewardsTab">
                                    <Link to="my_reward">{summaryLbl}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="tab-content">
                    <RouteHandler data={this.props.data}/>
                </div>
            </div>
        );
    }
}

CreditForm.contextTypes = {
    router: React.PropTypes.func
}

import CraditT from "./credit-transaction.jsx";
import MyReward from "./my_reward.jsx";


CreditForm.CraditT = CraditT;
CreditForm.MyReward = MyReward;