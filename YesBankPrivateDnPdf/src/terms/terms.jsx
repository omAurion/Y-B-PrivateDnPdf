import React from "react";
import {Route, NotFoundRoute, DefaultRoute, RouteHandler, Link} from "react-router";
import _ from "lodash";
import content, {loadContent} from "../content.js";

export default class TermsForm extends React.Component {
    render() {
        var route = _.last(this.context.router.getCurrentRoutes());
        var name = route.name;
        var customer = content.CUSTOMER;
        var terms;
        var link2m = "";
        var link3m = "";
        var sType = customer.statementType;

        if(customer.hasOwnProperty("offers"))
        {
            terms = customer.offers;
            if(terms.hasOwnProperty("link2m"))
            {
                link2m = terms.link2m;
            }
            if(terms.hasOwnProperty("link3m"))
            {
                link3m = terms.link3m;
            }
        }

        /*<div className="termsConditionStyle1"><img width="100%" src={link2m}/></div>
        <div className="termsConditionStyle"><img width="100%" src={link3m}/></div>*/

        return (
            <div className="pageStyle">
                {(window.urlResult == "dup")?<div className="dupTCDiv">Terms and Condition as applicable at the time of actual statement generation</div>:
                    <div className="row">
                        <br/><br/>
                        <div className="termsStyle">
                        <div className="col-xs-12 col-md-6 col-sm-6">
                            <div><strong>A. FINANCE CHARGES</strong></div>
                            <ul className="termsUlStyle">
                                <li>
                                    Finance charges are payable at the monthly percentage rate on all transactions from the date of transaction in the event of the Cardmember choosing not to pay his balance in full, and on all cash advances taken by the Cardmember, till they are paid back.
                                </li>
                                <li>
                                    <strong>Finance charges, if payable, are debited to Cardmember’s account till the outstanding on the Card is paid in full.</strong>
                                </li>
                                <li>
                                    Finance charges on cash advances are applicable from the date of transaction until the payment is made in full.
                                </li>
                                <li>
                                    When the Cardmember carries forward any outstanding amount or avails any cash advance, a finance charge calculated by average ‘Daily Balance Method’, will apply to balances carried forward and to fresh billings, till such time the previous outstanding amounts are repaid in full.
                                </li>
                                <li>
                                    Please note that the Finance charges and other charges are subject to change at the discretion of YES BANK Limited.
                                </li>
                            </ul>
                            <div>
                                <strong>Making only the minimum payment every month would result in the repayment stretching over years with consequent interest payment on your outstanding balance.</strong>
                            </div>
                            <div><strong>Please refer to following illustration for understanding the calculation of finance charges on revolving credit.</strong></div>
                            <table className="termsTable1Style">
                                <thead>
                                <th>Date</th>
                                <th>Transaction</th>
                                <th>Amount</th>
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
                                    <td>Total Amount Due = Rs 6,000 <br/> Minimum Amount Due = Rs 300</td>
                                </tr>
                                <tr>
                                    <td>10th July</td>
                                    <td>Payment realised on the Card account</td>
                                    <td>Rs 1,000 (Credit)</td>
                                </tr>
                                <tr>
                                    <td>14th July</td>
                                    <td>Purchase of groceries</td>
                                    <td>Rs 1,000</td>
                                </tr>
                                <tr>
                                    <td>20th July</td>
                                    <td>Statement date</td>
                                    <td>Total Amount Due = Rs 6,214.62 <br/> Minimum Amount Due =  Rs 310.73</td>
                                </tr>
                                </tbody>
                            </table>
                            <br/>
                            <p>It is assumed that the Cardmember has paid all previous dues in full and does not have any amount outstanding in his/her YES BANK Credit Card account.</p>
                            <p>Cardmember's statement date is 20th of every month. The following is the list of transactions the Cardmember has done on his/her Card account.</p>
                            <p>On the statement dated 20th July, the following will reflect as the components of the total amount payable by the Cardmember:</p>
                            <p>Interest calculated = (outstanding amount x 1.99% pm x 12 months x no of days) /365</p>
                            <p>Interest on Rs 5000 @ 1.99% pm from 2nd June to 9th July (i.e. for 38 days) = Rs 124.31</p>
                            <p>Interest on Rs 1000 @ 1.99% pm from 14th June to 9th July (i.e. for 26 days) = Rs 17.01</p>
                            <p>Interest on Rs 5000@ 1.99% pm from 10th July to 20th July (i.e. for 11 days) = Rs 35.98</p>
                            <p>Interest on Rs 1000 (fresh spends) @ 1.99% pm from 14th July to 20th July (i.e. for 7 days) = Rs 4.58</p>
                            <div><strong>a)</strong> Total interest of Rs 181.88</div>
                            <div><strong>b)</strong> Goods & Services tax of 18% on the interest amount  = Rs 32.74</div>
                            <div><strong>c)</strong> Total Principal amount outstanding= Rs 6000 (Rs 1000 fresh spend + balance Rs 5000 outstanding from last  month's billing period)</div>
                            <p>Hence Total Amount Due = (a) + (b) + (c) = Rs 6214.62</p>
                            {/*<p>Please note that for transactions till 30.06.2017, Service Tax at the rate of 15% (inclusive of Swach Bharat Cess @ 0.5% and Krishi Kalyan Cess @ 0.5%) is applicable on all fee and charges. Under Goods and Services Tax (GST) applicable from 1st July 2017, the existing service tax on all fee and charges has been replaced by a GST rate of 18%.</p>*/}
                            <br/>
                            <div><strong>B. PAYMENT OPTIONS</strong></div>
                            <ul className="termsUlStyle">
                                <li>
                                    In case the Cardmember has a bank account with YES BANK, payment can be made via ATM/Netbanking/ Standing Instructions (SI)
                                </li>
                                <li>
                                    Cardmember can make payment through NEFT from other bank account (use IFSC code YESB0CMSNOC), or through BillDesk facility using other bank’s NetBanking account.
                                </li>
                                <li>
                                    Cardmember can also make payment by dropping the cheque or draft (5 days prior to payment due date) into  any of the YES BANK Credit Card drop boxes placed in the YES BANK branches and ATM’s. Cheque / Draft should be made payable to ‘YES BANK Credit Card Number XXXX XXXX XXXX XXXX’.
                                </li>
                                <li>
                                    Cardmember can also make payment through cash at YES BANK branches. Please refer schedule of charges for applicable charge(s) for cash payments in Credit Card account.
                                </li>
                                <li>
                                    Cardmember can login into the below link and initiate payment from their respective Bank’s login with 16-digit Credit Card number. <br/> Link: <a href="https://pgi.billdesk.com/pgidsk/pgmerc/ybkcard/index.jsp" target="_blank">https://pgi.billdesk.com/pgidsk/pgmerc/ybkcard/index.jsp</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-xs-12 col-md-6 col-sm-6">
                            <div><strong>C. BILLING DISPUTES</strong></div>
                            <p>
                                Statement Disputes: All the contents of the statement shall be deemed to be correct and accepted if the Cardmember does not inform YES BANK, in writing, of the discrepancies within 60 days from the statement date. On receipt of such information, YES BANK may reverse the charge(s) on temporary basis pending investigation. If on completion of subsequent investigations, the liability of such charges is to the Cardmember's account, the charges shall be reinstated in subsequent statement along with the associated retrieval requests charges. Upon receipt of dispute from the Cardmember, within a maximum period of 60 days, YES BANK will provide necessary documents, wherever applicable and received from the member bank, subject to operating guidelines laid down by the respective network partners.
                            </p>
                            <br/>
                            <div><strong>D. BILLING</strong></div>
                            <p>
                                YES BANK will send the Cardmember a monthly statement showing the payments credited and the transactions debited to the Cardaccount since the last statement.
                            </p>
                            <p>
                                YES BANK will mail / email a statement of transactions in the Card account every month on a pre determined date, to the mailing address / email address on record with YES BANK. If the balanceoutstanding is less than Rs.100/- and there is no further transaction pending billing since last statement, no statement will be issued.
                            </p>
                            <br/>
                            <div><strong>E. INTEREST FREE PERIOD</strong></div>
                            <p>
                                Cardmember can avail interest free credit period of up to 50 days subject to the scheme applicable on the specific Credit Card (please refer to the schedule of charges as annexed herein).However, interest free period is not applicable if the previous month's statement balance has not been cleared in full on or before the due date. The same will also not be applicable if the Cardmember has withdrawn cash from ATM.
                            </p>
                            <br/>
                            <div><strong>Illustrative Example for Interest Free Credit Period Calculation:</strong></div>
                            <div>
                                Let us assume that the payment due date for a Credit Card falls on 25th May, and previous month's dues have been paid in full, the grace period would be:
                            </div>
                            <div>
                                1. For a purchase dated 6th April, interest free credit period is 6th April to 25th May = 50 days.</div>
                            <div>
                                2. For a purchase dated 17th April, interest free grace period is17th April to 25th May = 39 days.
                            </div>
                            <br/>
                            <div><strong>F. GRIEVANCE REDRESSAL</strong></div>
                            <p>
                                If you are not satisfied with our services and/or response given by any of our access channels, you may call us at 1800 121 4444/ 1800 103 0210 (Toll free) / 022-71856444 or send an email to <strong><u>yesprivate@yesbank.in</u></strong> For any escalations, you may contact our Principal Nodal Officer Mr. Ratan Kumar Kesh, at YES BANK Limited, 5<sup>th</sup> Floor, IFC, YES BANK Tower, Elphinstone Road (W), Mumbai - 400013 Email : <strong><u>principal.nodalofficer@yesbank.in</u></strong> Phone No: 0124-4619044 between 09.30 am to 05.30 pm Monday to Friday.
                            </p>
                            <p>
                                In the event that you do not receive any response within 1(One) month from the date you represented your complaint to the above mentioned channels, or if you are dissatisfied with the response provided, you may write to the banking ombudsman for an independent review. Please visit the grievance redressal webpage on <a href="https://www.rbi.org.in/" target="_blank">www.rbi.org.in</a> for details on the Banking Ombudsman scheme.
                            </p>
                            <br/>
                            <div><strong>G.	YES PRIVATE BANKING & CONCIERGE SESRVICES</strong></div>
                            <div className="gStyle"><strong>Phone</strong>- 1800 121 4444/ 1800 103 0210 (Toll free) / 022-71856444</div>
                            <div className="gStyle"><strong>Email</strong>- yesprivate@yesbank.in</div>
                            <br/>
                            <div><strong>Important Information:</strong></div>
                            <p>“Basis RBI circular on ‘Customer Protection – Limiting Liability’ dated 06th July’17, Customers’ Liability for Unauthorized Electronic Banking Transactions has been defined. The detailed policy has been updated on YES BANK’s website. Please visit www.yesbank.in for referring to the Policy”.</p>
                        </div>
                        <br/>
                        <div className="col-md-12">
                            <div><strong><u>H.	SCHEDULE OF CHARGES</u></strong></div>
                            <table className="termsTable2Style">
                                <thead>
                                <th colSpan="2">Yes Private Credit Card</th>
                                </thead>
                                <thead>
                                <th>Joining Fees</th>
                                <th>NIL</th>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Annual Membership Fee (First Year and Renewal)</td>
                                    <td>First Year Fees : Rs.50,000 plus taxes as applicable <br/> Renewal Fees : Rs.10,000 plus taxes as applicable</td>
                                </tr>
                                <tr>
                                    <td>Interest Free Period</td>
                                    <td>Upto 50 days</td>
                                </tr>
                                <tr>
                                    <td>Minimum Amount Due (MAD)</td>
                                    <td>Minimum of 5% of total payment due as per statement or Rs 200, whichever is higher</td>
                                </tr>
                                <tr>
                                    <td>Cash Advance Limit</td>
                                    <td>30% of Credit Limit</td>
                                </tr>
                                <tr>
                                    <td>Add-on Card Fee</td>
                                    <td>No Joining Fee, No Annual Fee (Maximum Upto 5 Add-On Cards can be issued)</td>
                                </tr>
                                <tr>
                                    <td>Finance Charges on Revolving Credit on Cash advance and/or  Overdue amount</td>
                                    <td>For YES BANK Savings and Salary Account Holders- 1.20% per month (i.e 14.40% annualized)Others- 1.99% per month (i.e 23.88% annualized)</td>
                                </tr>
                                <tr>
                                    <td>Late Payment Charges</td>
                                    <td>Nil</td>
                                </tr>
                                <tr>
                                    <td>Overdue Fee</td>
                                    <td>Nil</td>
                                </tr>
                                <tr>
                                    <td>Cash Advance Fee</td>
                                    <td>Nil</td>
                                </tr>
                                <tr>
                                    <td>Payment Return Charges: Cheques/Auto pay</td>
                                    <td>Nil</td>
                                </tr>
                                <tr>
                                    <td>Reward Redemption Fee</td>
                                    <td>Nil</td>
                                </tr>
                                <tr>
                                    <td>Fuel Surcharge Waiver (Goods & Services Tax levied on fuel surcharge will not be reversed.)</td>
                                    <td>Valid for Transaction between Rs 400/- to Rs 5,000/- only.</td>
                                </tr>
                                <tr>
                                    <td>Re-issue fee for Lost, Stolen or Damaged Card replacement</td>
                                    <td>Nil</td>
                                </tr>
                                <tr>
                                    <td>Foreign Currency Conversion Charges</td>
                                    <td>1.75%</td>
                                </tr>
                                <tr>
                                    <td>Outstation Cheque Processing Fee</td>
                                    <td>Nil</td>
                                </tr>
                                <tr>
                                    <td>Duplicate Statement (Statement older than 6 months)</td>
                                    <td>Nil</td>
                                </tr>
                                <tr>
                                    <td>Cash deposit at YBL Branches towards Credit Card repayment</td>
                                    <td>Nil</td>
                                </tr>
                                <tr>
                                    <td>Goods and Services Tax (GST)</td>
                                    <td>18% (Applicable on all fee and Charges)</td>
                                </tr>
                                </tbody>
                            </table>
                            <br/>
                            <div className="tncGstinNo">YES BANK Credit Cards GSTIN: 27AAACY2068D3ZE</div>
                        </div>
                    </div>
                    </div>}
            </div>
        );
    }
}

TermsForm.contextTypes = {
    router: React.PropTypes.func
}

