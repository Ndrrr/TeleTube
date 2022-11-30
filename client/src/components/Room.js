import React, { Component } from 'react'
import {getProfile} from './UserFunctions'
import jwt_decode from "jwt-decode";

let firstNameMsg = '';

let validForm = [true, true, true, true];

class Room extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            email: '',
            room_id: '',

            msg: '',
            created_at: '',
            last_room_id: '',
            errors: {}
        }
        this.onNameChange = this.onNameChange.bind(this)
        this.onChange = this.onChange.bind(this)
        //this.onSubmit = this.onSubmit.bind(this)
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

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    componentDidMount() {
        const token = localStorage.getItem('usertoken')
        const room_token = localStorage.getItem('roomtoken')
        if (token)
            getProfile(token).then(res => {
                console.log(res)
                this.setState({
                    name: res.first_name + ' ' + res.last_name,
                    email: res.email,
                })
            })
        else {
            this.props.history.push('/login')
        }
        if(room_token){

            this.setState({
                room_id: jwt_decode(room_token).id,
            })
        }
    }

    render() {
        const room_player =(
            <div>Room player with {this.state.room_id}</div>
        )

        const room_creator = (
            <div>Room creator </div>
        )
        return (
            <div className="container">
                <div className="row">
                    {this.state.room_id ? room_player : room_creator}
                </div></div>
        )
    }
}

export default Room;