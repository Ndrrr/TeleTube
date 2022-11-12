import React, { Component } from 'react'
import { forgotPassword } from './UserFunctions'


class ForgotPassword extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            message: '',
            errors: {}
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    onSubmit(e) {
        e.preventDefault()

        const user = {
            email: this.state.email,
        }

        forgotPassword(user).then(res => {
            console.log(res)
            if (res) {
                this.state.message = res.msg
                this.props.history.push(`/forgot-password`)
            }
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Account Recovery</h1>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Enter email"
                                    value={this.state.email}
                                    onChange={this.onChange}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-lg btn-primary btn-block"
                            >
                                Send Password Reset Link
                            </button>
                            <p className={"text-primary mt-3"}>{this.state.message}</p>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default ForgotPassword
