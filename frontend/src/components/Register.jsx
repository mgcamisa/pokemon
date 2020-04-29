import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";
import classnames from "classnames";
import "../App.css";
import pokeball from "../pokeball.png";

class Register extends Component {
constructor(props) {
    super(props);

    this.inputHandler= this.inputHandler.bind(this);	      
    this.onSignup = this.onSignup.bind(this);

    // Initialize app state
    this.state = {
    	      email: "",
	      password: "",
	      password2: "",
	      errors: {} }
	      
    }

    componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
    
    }

    componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

    inputHandler = (e) => {
    	this.setState({
		[e.currentTarget.id]: e.currentTarget.value
	})
	}

    onSignup(e) {
    	e.preventDefault();

	const newUser = {
      	      email: this.state.email,
      	      password: this.state.password,
      	      password2: this.state.password2
    	};

	this.props.registerUser(newUser, this.props.history);
    }
    
  render() {
  const { errors } = this.state;

    return (
    	   <div className="container">
    	   	<h2 className="row justify-content-center header"> Create an account </h2>
		<form onSubmit={this.onSignup}>
                    <div className="form-group"> 
                        <label htmlFor="email" className="label">Email: </label>
                        <input  type="email"
                               	id="email"
                                onChange={this.inputHandler}
				className={classnames("form-control", {
                    		  invalid: errors.email
                  		})}
				required
                                />
			<span className="red-text">{errors.email}</span>	
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="label">Password: </label>
                        <input 
                                type="password" 
                                id="password"
                                onChange={this.inputHandler}
				className={classnames("form-control", {
                    		  invalid: errors.password
                  		})}
				required
                                />
			<span className="red-text">{errors.password}</span>
                    </div>
		    <div className="form-group">
		    	 <label htmlFor="password2" className="label">Confirm password: </label>
			 <input
				type="password"
				id="password2"
				onChange={this.inputHandler}
				className={classnames("form-control", {
                    		  invalid: errors.password2
                  		})}
				required
				/>
			<span className="red-text">{errors.password2}</span>
		    </div>
		    <div className="form-group">
                        <input type="submit" className="btn btn-lg btn-primary"/>
                    </div>
                </form>
		<div className="row justify-content-center">
		     <img src={pokeball} alt="pokeball" className="image"/>
		</div>
	   </div>

    )
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));