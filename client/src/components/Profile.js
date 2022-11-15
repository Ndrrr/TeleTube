import React, { Component } from 'react'
import {getProfile, updateProfile} from './UserFunctions'
import $ from 'jquery';

let firstNameMsg = '';
let lastNameMsg = '';
let passwordMsg = '';
let password2Msg = '';

let validForm = [true, true, true, true];

class Profile extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      email: '',
      form_fname: '',
      form_lname: '',
      form_email: '',
      form_old_password: '',
      form_password: '',
      form_password2: '',


      msg: '',
      created_at: '',
      last_room_id: '',
      errors: {}
    }
    this.onNameChange = this.onNameChange.bind(this)
    this.onLastNameChange = this.onLastNameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onPassword2Change = this.onPassword2Change.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onNameChange = (event) => {
    if(event.target.value.length < 3){
      validForm[0] = false;
      firstNameMsg = 'Name must be at least 3 characters';
    }
    else{
      validForm[0] = true;
      firstNameMsg = '';
    }
    console.log(event.target.name)
    console.log(event.target.value)
    this.setState({[event.target.name]: event.target.value});
  }

  onLastNameChange = (event) => {
    if(event.target.value.length < 3){
      validForm[1] = false;
      lastNameMsg = 'Name must be at least 3 characters';
    }
    else{
      validForm[1] = true;
      lastNameMsg = '';
    }
    this.setState({[event.target.name]: event.target.value});
  }


  onPasswordChange = (event) => {
    let pass = event.target.value;
    if(pass.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
      validForm[2] = true;
      passwordMsg = '';
    } else {
      validForm[2] = false;
      passwordMsg = 'Password must be at least 8 characters and contain at least 1 number, 1 uppercase and 1 lowercase letter';
    }
    this.setState({[event.target.name]: event.target.value});
  }

  onPassword2Change = (event) => {
    let pass = event.target.value;
    if(pass!==this.state.form_password){
      validForm[3] = false;
      password2Msg = 'Passwords do not match';
    } else {
      validForm[3] = true;
      password2Msg = '';
    }
    this.setState({[event.target.name]: event.target.value});
  }

  onSubmit = (e) => {
    e.preventDefault()
    let valid = true;
    for(let i = 0; i < validForm.length; i++){
        if(!validForm[i]){
            valid = false;
            break;
        }
    }
    console.log(validForm)
    if(valid){
        const newUser = {
            first_name: this.state.form_fname,
            last_name: this.state.form_lname,
            email: this.state.form_email,
            old_password: this.state.form_old_password,
            new_password: this.state.form_password
        }
        console.log(newUser)
        const token = localStorage.getItem('usertoken')
        console.log(token)
       updateProfile(token, newUser).then(res => {
           console.log(res)
            if(res.data.msg==='Updated'){
                this.setState({msg: 'Profile updated successfully'})
            } else {
              this.setState({msg: 'Error updating profile'})
            }
       })
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  componentDidMount() {
    const token = localStorage.getItem('usertoken')
    if (token)
    getProfile(token).then(res => {
      this.setState({
        name: res.first_name + ' ' + res.last_name,
        email: res.email,
        form_fname: res.first_name,
        form_lname: res.last_name,
        form_email: res.email,
        created_at: res.created_at,
        last_room_id: res.last_room_id
      })
    })
    else {
      this.props.history.push('/login')
    }
  }

  render() {
    return (
        <section className="vh-100" style={{backgroundColor: "#f4f5f7"}}>
          <div className="container py-5 h-200">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-lg-6 mb-4 mb-lg-0">
                <div className="card mb-3" style={{borderRadius: ".5rem"}}>
                  <div className="row g-0">

                    <div className="modal fade" id="updateProfileModal" tabIndex="-1" role="dialog"
                         aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content row">
                          <div className="modal-header">
                              <h3 className="modal-title" id="exampleModalLabel">Update Profile</h3>
                              <button type="button" className="close" data-dismiss="modal"
                                      aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                              </button>
                          </div>
                          <div className="modal-body">
                              <form onSubmit={this.onSubmit} noValidate className={"col-md-12"}>
                                  <div className="form-group">
                                      <label htmlFor="name">Name</label>
                                      <input type="text"
                                             className="form-control"
                                             name="form_fname"
                                             value={this.state.form_fname}
                                             onChange={this.onNameChange}
                                      />
                                      <span className="text-danger">{firstNameMsg}</span>
                                  </div>
                                  <div className="form-group">
                                      <label htmlFor="name">Last Name</label>
                                      <input type="text"
                                             className="form-control"
                                             name="form_lname"
                                             value={this.state.form_lname}
                                             onChange={this.onLastNameChange}
                                      />
                                      <span className="text-danger">{lastNameMsg}</span>
                                  </div>
                                  <div className="form-group">
                                      <label htmlFor="email">Email</label>
                                      <input type="email"
                                             className="form-control"
                                             name="form_email"
                                             value={this.state.form_email}
                                             readOnly={true}
                                      />
                                  </div>

                                  <div className="form-group">
                                      <label htmlFor="password">Password</label>
                                      <input type="password"
                                             className="form-control"
                                             name="form_old_password"
                                             value={this.state.form_old_password}
                                             onChange={this.onChange}
                                      />

                                      <div className="form-group">
                                          <label htmlFor="password">New Password</label>
                                          <input type="password"
                                                 className="form-control"
                                                 name="form_password"
                                                 value={this.state.form_password}
                                                 onChange={this.onPasswordChange}
                                          />
                                          <span className="text-danger">{passwordMsg}</span>
                                      </div>
                                      <div className="form-group">
                                          <label htmlFor="password2">Confirm New Password</label>
                                          <input type="password"
                                                 className="form-control"
                                                 name="form_password2"
                                                 value={this.state.form_password2}
                                                 onChange={this.onPassword2Change}
                                          />
                                          <span className="text-danger">{password2Msg}</span>
                                      </div>
                                      <button type="submit" className="btn btn-primary btn-block">Update</button>
                                      <span className="text-default">{this.state.msg}</span>
                                  </div>
                              </form>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                    data-dismiss="modal">Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="col-md-4 gradient-custom text-center text-white"
                         style={{borderTopLeftRadius: "5rem", borderBottomLeftRadius: ".5rem"}}>
                      <img
                          src={"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"}
                          alt={"Avatar"} className={"img-fluid my-5"}
                          style={{width: "80px"}}/>
                      <h5>{this.state.name}</h5>

                      <button type="button" data-toggle="modal" data-target="#updateProfileModal" style={{height:"25px", width:"25px", backgroundColor:"transparent", border:"0px"}}><img className="far fa-edit mb-5"/></button>
                    </div>
                    <div className="col-md-8">
                      <div className="card-body p-4">
                        <h6>Information</h6>
                        <hr className="mt-0 mb-4"/>
                        <div className="row pt-1">
                          <div className="col-8 mb-3">
                            <h6>Email</h6>
                            <p className="text-muted">{this.state.email}</p>
                          </div>
                        </div>
                        <hr className="mt-0 mb-4"/>
                        <div className="row pt-1">
                          <div className="col-6 mb-3">
                            <h6></h6>
                            <p className="text-muted"></p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6></h6>
                            <p className="text-muted"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            {
                $('#myModal').on('shown.bs.modal', function () {
                    $('#myInput').trigger('focus')
                })
            }
        </section>
    )
  }
}

export default Profile
