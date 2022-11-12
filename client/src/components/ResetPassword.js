import React, { Component } from 'react'
import { resetPassword } from './UserFunctions'
import jwt_decode from "jwt-decode";

let passwordMsg = '';
let password2Msg = '';
let validFrom = [false, false];

class ResetPassword extends Component {
    constructor() {
        super()
        this.state = {
            password: '',
            password_confirm: '',
            message: '',
            errors: {}
        }

        this.onPasswordChange = this.onPasswordChange.bind(this)
        this.onPassword2Change = this.onPassword2Change.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onPasswordChange = (event) => {
        let pass = event.target.value;
        if(pass.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
            validFrom[0] = true;
            passwordMsg = '';
        } else {
            validFrom[0] = false;
            passwordMsg = 'Password must be at least 8 characters and contain at least 1 number, 1 uppercase and 1 lowercase letter';
        }
        this.setState({[event.target.name]: event.target.value});
    }

    onPassword2Change = (event) => {
        let pass = event.target.value;
        if(pass!==this.state.password){
            validFrom[1] = false;
            password2Msg = 'Passwords do not match';
        } else {
            validFrom[1] = true;
            password2Msg = '';
        }
        this.setState({[event.target.name]: event.target.value});
    }
    onSubmit(e) {
        e.preventDefault()
        const token = window.location.href.split('/').pop();
        const decoded = jwt_decode(token);

        const user = {
            email: decoded.email,
            password: this.state.password,
            token: token
        }

        resetPassword(user).then(res => {
            if (res) {
                this.state.message = res.msg;
                this.props.history.push(`/reset-password/${token}`)
            }
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Password Recovery</h1>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Enter Password"
                                    value={this.state.password}
                                    onChange={this.onPasswordChange}
                                />
                                <p className={"text-danger"}>{passwordMsg}</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password_confirm">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password_confirm"
                                    placeholder="Confirm Password"
                                    value={this.state.password_confirm}
                                    onChange={this.onPassword2Change}
                                />
                                <p className={"text-danger"}>{password2Msg}</p>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-lg btn-primary btn-block"
                            >
                                Reset
                            </button>
                            <p className={"text-success mt-3"}>{this.state.message}</p>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default ResetPassword
