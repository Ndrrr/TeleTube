import React, { Component } from 'react';
import { io } from 'socket.io-client';
import jwt_decode from 'jwt-decode';
import ReactPlayer from 'react-player';


class Player extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            socket: io(''),
            room: '',
            name : '',
            currentVideoUrl : 'https://youtu.be/7sDY4m8KNLc',
            playing : true,
            controller : '',
            players: [],
            lastChange : -1,
            msg: '',
            redirect: false
        };
        this.changeVideo = this.changeVideo.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.videoUrlRef = element => {
            this.videoUrl = element;
        };
        this.videoPlayerRef = element => {
            this.videoPlayer = element;
        };
        this.msgRef = element => {
            this.msgComp = element;
        }
        this.chatRef = element => {
            this.chat = element;
        };

    }

    componentDidMount() {
        const token = localStorage.usertoken;
        let decoded;
        try {
            decoded = jwt_decode(token);
        } catch (e) {
            this.props.history.push('/login');
            return;
        }
        var tmpName = decoded.first_name + ' ' + decoded.last_name;
        this.setState({
            name: tmpName,
            room: this.props.room_id,
            controller: 'player',
            players: [decoded.first_name+' '+decoded.last_name]
        });
        this.state.socket.on('connect', () => {
            this.state.socket.emit('join', this.state.room, this.state.name);
        });
        this.state.socket.on('changeVideo', (url) => {
            this.setState({
                currentVideoUrl : url,
                playing : true
            });
        });
        this.state.socket.on('play', (time) => {
            if(this.videoPlayer) this.videoPlayer.seekTo(time);
            this.setState({
                lastChange : (new Date()).getTime(),
                playing : true
            });
        });
        this.state.socket.on('pause', (time) => {
            if(this.videoPlayer) this.videoPlayer.seekTo(time);
            this.setState({
                lastChange : (new Date()).getTime(),
                playing : false
            });
        });
        this.state.socket.on('newPlayer', (player) => {
            // add if player is not present
            if(this.state.lastChange != -1 && Math.abs((new Date()).getTime() - this.state.lastChange) > 500) {
                this.state.socket.emit('changeVideo', this.state.currentVideoUrl);
                this.state.socket.emit('play', this.videoPlayer.getCurrentTime());
            }
            if(Array.isArray(player)) {
                this.setState({
                    players: player
                });
            }
            // console.log(this.state.players);
        });


        this.state.socket.on('removePlayer', (player) => {
            this.setState({
                players: this.state.players.filter(p => p !== player)
            });
        });
        this.state.socket.on('msg', (message) => {
            console.log(message);
            // this.setState({
            //     msg : this.state.msg + message
            // });
            this.chat.innerHTML += message;
        });
    }

    leaveRoom(e) {
        e.preventDefault();
        this.state.socket.emit('leaveRoom', this.state.room);
        this.state.socket.disconnect();
        localStorage.removeItem('roomtoken');
        window.location.href = '/room';
    }
    onPlay(e) {
        this.setState({
            playing : true
        });
        console.log(Math.abs((new Date()).getTime() - this.state.lastChange));
        if(Math.abs((new Date()).getTime() - this.state.lastChange) > 1000) {
            this.state.socket.emit('play', this.videoPlayer.getCurrentTime());
        }
    }
    onPause(e) {
        this.setState({
            playing : false
        });
        console.log(Math.abs((new Date()).getTime() - this.state.lastChange));
        if(Math.abs((new Date()).getTime() - this.state.lastChange) > 1000) {
            this.state.socket.emit('pause', this.videoPlayer.getCurrentTime());
        }
    }
    changeVideo(e) {
        e.preventDefault();
        this.state.socket.emit('changeVideo', this.videoUrl.value);
        this.setState({
            currentVideoUrl : this.videoUrl.value,
            playing : true
        })

        console.log(this.state.playing);
        // console.log('changed video ' + util.inspect(this.videoPlayer, false, null, true /* enable colors */));
    }
    sendMsg(e) {
        e.preventDefault();
        var msg_to_send='<li className="list-group-item">'+ this.state.name+": " + this.msgComp.value + '</li>'
        this.state.socket.emit('msg', msg_to_send);
        this.chat.innerHTML += msg_to_send;
        this.msgComp.value = '';
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 mt-5 mx-auto">
                        <div id={this.state.room} className="card">
                            <div className="card-header container">
                                <div className="d-inline-block col-md-4"></div>
                                <h3 className="text-center align-middle col-md-4  d-inline-block">Room: {this.state.room}</h3>
                                <div className="d-inline-block col-md-4 align-right text-right">
                                    <button className="btn btn-danger pull-right" onClick={this.leaveRoom}>Leave Room</button>
                                </div>
                                <h4 className="text-center align-middle col-md-12 d-inline-block">Controller : {this.state.controller}</h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-3">
                                        <h4>Players</h4>
                                        <ul className="list-group pre-scrollable">
                                            {this.state.players.map((player, i) => {
                                                return <li className="list-group-item" key={i}>{player}</li>
                                            })}
                                        </ul>
                                    </div>
                                    <div className="col-md-6">

                                        <h4 className={'text-center'}>Player</h4>
                                        <div className="embed-responsive border">
                                            <ReactPlayer ref={this.videoPlayerRef} url={this.state.currentVideoUrl} playing={this.state.playing} controls={true} onPlay={this.onPlay} onPause={this.onPause}/>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <h4>Chat</h4>
                                        <div id="chat" className="card">
                                            <div className="card-body">
                                                <ul className="list-group" id="messages" ref={this.chatRef}>

                                                </ul>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="Message" ref={this.msgRef}/>
                                            <div className="input-group-append">
                                                <button className="btn btn-dark" type="button" onClick={this.sendMsg}>Send</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                                <form className="col-md-12 text-center input-group" onSubmit={this.changeVideo}>
                                    <input type="text" className="form-control mt-3" ref={this.videoUrlRef} placeholder="Video URL" />
                                    <div className="input-group-append">
                                        <button className="btn btn-dark mt-3" type="submit" >Change Video</button>
                                    </div>
                                </form>

                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Player;