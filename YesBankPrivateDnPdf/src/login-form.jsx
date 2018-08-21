var React = require("react");
var ReactDOM = require("react-dom");
var {Route} = require("react-router");

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {error: null};
    }

    componentDidMount(){
        $("#loginWindowId").hide();
    }
    onSubmit(e) {
        e.preventDefault();
        var username = ReactDOM.findDOMNode(this.refs.username).value;
        var password = ReactDOM.findDOMNode(this.refs.password).value;
        if (this.props.onLogin)
            this.props.onLogin(username, password);
    }

    render() {
        if (this.props.error) {
            var error = (
                <div className="alert alert-danger" role="alert">
                    {this.props.error}
                </div>
            );
        }
        return (

            <div className="container-fluid">
                <div className="login" id="loginWindowId">
                    <form name="loginform" id="login-form" onSubmit={this.onSubmit.bind(this)}>
                        <div className="form-group">
                            <label htmlFor="username" className = "loginfont-color">Username</label>
                            <input type="text" className="form-control" name="username" ref="username"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className = "loginfont-color">Password</label>
                            <input type="password" className="form-control" name="password" ref="password"/>
                        </div>
                        <input type="submit" className="btn btn-default" value="Retrieve content"/>
                    </form>
                </div>
            </div>
        );
    }
}

module.exports = LoginForm;