var React = require("react");
class NumberColumn extends React.Component {

    render() {
        var num = Number(this.props.data);
        var meta = this.props.metadata;
        if (meta.round) {
            var r = Math.pow(10, Number(meta.round));
            num = Math.round(num * r) / r;
        }
        return (
            <span className={this.props.metadata.className}>
                {num}
            </span>
        );
    }
}
module.exports = NumberColumn;