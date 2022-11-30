import React, { Component } from 'react'
import {createRoom, getProfile, joinRoom} from './UserFunctions'
import jwt_decode from "jwt-decode";

class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            room_id: '',

            room_id_form: '',
            room_password_form: '',
            msg: '',
            created_at: '',
            last_room_id: '',
            errors: {}
        }
        this.onChange = this.onChange.bind(this)
        this.onJoinRoom = this.onJoinRoom.bind(this)
        this.onCreateRoom = this.onCreateRoom.bind(this)
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    async componentDidMount() {
        const token = localStorage.getItem('usertoken')
        const room_token = localStorage.getItem('roomtoken')
        try {
        const response = await getProfile(token)
        if(room_token){
            this.setState({
                room_id: jwt_decode(room_token).id,
            })
        }} catch (e) {
            this.props.history.push(`/login`)
        }
    }

    async onCreateRoom(e) {
        e.preventDefault()
        const room_id = this.state.room_id_form
        const room_password = this.state.room_password_form
        try {
            const response = await createRoom(localStorage.getItem('usertoken'), room_id, room_password);
            console.log(response)
            if (response.status === 200) {
                if (response.data.room_id === room_id) {
                    console.log("sent to join")
                    await this.onJoinRoom();
                } else {
                    this.setState({
                        msg: "Room id already exists"
                    })
                }
            } else {
                this.setState({
                    msg: "Room id already exists"
                })
            }
        } catch (e) {
            this.setState({
                msg: "Room id already exists"
                }
            )
        }

    }

    async onJoinRoom(e) {
        if(e)
            e.preventDefault()
        const room_id = this.state.room_id_form
        const room_password = this.state.room_password_form
        try {
            const response = await joinRoom(localStorage.getItem('usertoken'), room_id, room_password);
            if (response.status === 200) {
                localStorage.setItem('roomtoken', response.data.room_token)
                window.location.reload();
            }
        } catch (e) {
            this.setState({
                msg: "Invalid room id or password"
            })

        }

    }

    render() {
        const room_player =(
            <div>Room player with {this.state.room_id}</div>
        )

        const room_creator = (
            <div>
                <form id="enter-room">
                    <div className="form-group">
                        <label htmlFor="name">Room id</label>
                        <input type="text"
                               className="form-control"
                               name="room_id_form"
                               placeholder="Room id"
                               value={this.state.room_id_form}
                               onChange={this.onChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Password</label>
                        <input type="text"
                               className="form-control"
                               name="room_password_form"
                               placeholder="Room password"
                               value={this.state.room_password_form}
                               onChange={this.onChange}
                        />
                    </div>
                    <button type="button" className="btn btn-lg btn-primary mr-2" onClick={this.onCreateRoom}>
                        Create
                    </button>

                    <button type="button" className="btn btn-lg btn-warning" onClick={this.onJoinRoom}>
                        Join
                    </button>
                </form>
            </div>
        )
        return (
            <div className="container">
                <div className="row">
                    {this.state.room_id ? room_player : room_creator}
                    <span className="text-danger">{this.state.msg}</span>
                </div>
            </div>
        )
    }
}

export default Room;