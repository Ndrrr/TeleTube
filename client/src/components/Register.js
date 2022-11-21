import React, { Component } from 'react'
import { withRouter} from "react-router-dom";
import { register } from './UserFunctions'
import queryString from 'query-string'

let firstNameMsg = '';
let lastNameMsg = '';
let emailMsg = '';
let passwordMsg = '';
let password2Msg = '';
let validFrom = [false, false, false, false, false];

class Register extends Component {
  constructor() {
    super()
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
      errors: {},
      refresh: 0
    }

    this.onNameChange = this.onNameChange.bind(this)
    this.onLastNameChange = this.onLastNameChange.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onPassword2Change = this.onPassword2Change.bind(this)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onNameChange = (event) => {
    if(event.target.value.length < 3){
      validFrom[0] = false;
      firstNameMsg = 'Name must be at least 3 characters';
    }
    else{
        validFrom[0] = true;
        firstNameMsg = '';
    }
    this.setState({[event.target.name]: event.target.value});
  }

  onLastNameChange = (event) => {
    if(event.target.value.length < 3){
      validFrom[1] = false;
      lastNameMsg = 'Name must be at least 3 characters';
    }
    else{
      validFrom[1] = true;
      lastNameMsg = '';
    }
    this.setState({[event.target.name]: event.target.value});
  }

  onEmailChange = (event) => {
    if(event.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){
        validFrom[2] = true;
        emailMsg = '';
    } else {
        validFrom[2] = false;
        emailMsg = 'Invalid email format';
    }
    this.setState({[event.target.name]: event.target.value});
  }

  onPasswordChange = (event) => {
    let pass = event.target.value;
    if(pass.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
        validFrom[3] = true;
        passwordMsg = '';
    } else {
        validFrom[3] = false;
        passwordMsg = 'Password must be at least 8 characters and contain at least 1 number, 1 uppercase and 1 lowercase letter';
    }
    this.setState({[event.target.name]: event.target.value});
  }

  onPassword2Change = (event) => {
    let pass = event.target.value;
    if(pass!==this.state.password){
        validFrom[4] = false;
        password2Msg = 'Passwords do not match';
    } else {
        validFrom[4] = true;
        password2Msg = '';
    }
    this.setState({[event.target.name]: event.target.value});
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()

    if(validFrom[0] && validFrom[1] && validFrom[2] && validFrom[3] && validFrom[4]){
        const newUser = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
            password_confirm: this.state.password_confirm
        }
        register(newUser).then(res => {
          console.log(res)
          if(res.data.error === 'User already exists'){
            this.props.history.push('/register?error=User already exists');
          } else {
            this.props.history.push(`/login`)
          }
          window.location.reload()
          //this.setState({refresh: 1 - this.state.refresh});
        })
    }
  }

  componentDidMount() {
    let params = queryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
    console.log("params: ")
    console.log(params)
    if(params.error !== undefined){
      emailMsg = params.error;
      this.setState({['errors']: params.error});
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit} className='mb-2'>
              <h1 className="h3 mb-3 font-weight-normal">Register</h1>
              <div className="form-group">
                <label htmlFor="name">First name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  placeholder="Enter your first name"
                  value={this.state.first_name}
                  onChange={this.onNameChange}
                />
                <p className={"text-danger"}>{firstNameMsg}</p>
              </div>
              <div className="form-group">
                <label htmlFor="name">Last name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  placeholder="Enter your lastname name"
                  value={this.state.last_name}
                  onChange={this.onLastNameChange}
                />
                <p className={"text-danger"}>{lastNameMsg}</p>

              </div>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onEmailChange}
                />
                <p className={"text-danger"}>{emailMsg}</p>

              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onPasswordChange}
                />
                <p className={"text-danger"}>{passwordMsg}</p>
              </div>
              <div className="form-group">
                <label htmlFor="password_confirm">Password</label>
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
                Register!
              </button>
            </form>
            <a href={'/login'}>Already a user?</a>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Register)
