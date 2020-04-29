import React, { Component } from 'react';
import PropTypes from "prop-types";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";
import pikachu from "../pikachu.png";
import "../App.css";

class Home extends Component {
constructor(props) {
    super(props);

    this.inputHandler= this.inputHandler.bind(this);	      
    this.onLogin = this.onLogin.bind(this);

    // Initialize app state
    this.state = {
    	      email: "",
	      password: "",
	      errors: {} };
	      
    }

    componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
    
    }

    componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    }

    inputHandler = (e) => {
    	this.setState({
		[e.currentTarget.id]: e.currentTarget.value
	})
	}

    onLogin(e) {
    	e.preventDefault();

	const newLogin = {
	      email: this.state.email,
	      password: this.state.password
	};

	this.props.loginUser(newLogin);
    }
    
  render() {
    const { errors } = this.state;
    
    return (
    	   <div className="container">
    	   	<h2 className="row justify-content-center header"> Build your Pokemon team! </h2>
		<form onSubmit={this.onLogin}>
                    <div className="form-group"> 
                        <label htmlFor="email" className="label">Email: </label>
                        <input  type="email"
                               	id="email"
				label="email"
                                onChange={this.inputHandler}
				className={classnames("form-control", {
                    		  invalid: errors.email || errors.emailnotfound
                  		})}
				required
                                />
			<span className="red-text">
                  	      {errors.email}
                  	      {errors.emailnotfound}
                	</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="label">Password: </label>
                        <input 
                                type="password"
                                id="password"
				label="password"
                                onChange={this.inputHandler}
				className={classnames("form-control", {
                    		  invalid: errors.password || errors.passwordincorrect
                  		})}
				required
                                />
			<span className="red-text">
                  	      {errors.password}
                  	      {errors.passwordincorrect}
                	</span>
                    </div>
		    <div className="form-group">
                        <input type="submit" className="btn btn-primary"/>
                    </div>
		    <a href="/signup" className="label">
		    	  New? Sign up here
		    </a>
                </form>
		<div className="row justify-content-center">
			<img src={pikachu} alt="Pikachu" />
		</div>
	   </div>
    )
  }
}

Home.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Home);