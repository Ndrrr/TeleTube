import React, { Component } from 'react'
import { login } from './UserFunctions'
import queryString from "query-string";

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: '',
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
      password: this.state.password
    }

    login(user).then(res => {
    console.log(res)
      if(res.msg === "Please Check your email to activate your account") {
        this.setState({error: res.msg})
      }
      else if (res.error !== 'Invalid credentials') {
        this.props.history.push(`/profile`)
      } else {
        this.setState({ error : res.error })
      }
      console.log(this.state.error)
    })
  }

  componentDidMount() {
    let params = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
    console.log(params)
    if(params.msg !== undefined){
        this.setState({['error']: params.msg});
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
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
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
              <a href={'/forgot-password'}>Forgot password?</a>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block mt-2"
              >
                Sign in
              </button>
              <p className={"text-warning mt-2"}>{this.state.error}</p>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
