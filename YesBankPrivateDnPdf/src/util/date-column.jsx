var React = require("react");
import _ from 'lodash';

class DateColumn extends React.Component {
    render() {
        var data = this.props.data;
        if (_.isString(this.props.data)) {
            data = new Date(data);
        }
        return (
            <span style={{marginRight: "5px"}}>
                {data.toLocaleDateString()}
            </span>
        );
    }
}
module.exports = DateColumn;