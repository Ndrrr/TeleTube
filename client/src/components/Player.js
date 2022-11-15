import React, { Component } from 'react';
import { io } from 'socket.io-client';
import jwt_decode from 'jwt-decode';
import ReactPlayer from 'react-player'

const socket = io('');


class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: '',
            name : '',
            currentVideoUrl : 'https://youtu.be/7sDY4m8KNLc',
            playing : true,
            controller : '',
            players: [],
            lastChange : -1
        };
        this.changeVideo = this.changeVideo.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this.videoUrlRef = element => {
            this.videoUrl = element;
        };
        this.videoPlayerRef = element => {
            this.videoPlayer = element;
        };

    }

    componentDidMount() {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            name: decoded.first_name + ' ' + decoded.last_name,
            room: 'room1',
            controller: 'player',
            players: [decoded.first_name+' '+decoded.last_name]
        });

        socket.on('changeVideo', (url) => {
            this.setState({
                currentVideoUrl : url,
                playing : true
            });
        });
        socket.on('play', (time) => {
            this.setState({
                playing : true
            });
            this.videoPlayer.seekTo(time);
            this.setState({
                lastChange : time
            });
        });
        socket.on('pause', (time) => {
            this.setState({
                playing : false
            });
            this.videoPlayer.seekTo(time);
            this.setState({
                lastChange : time
            });
        });
        socket.on('newPlayer', (player) => {
            // add if player is not present
            if(this.state.players.indexOf(player) === -1) {
                this.setState({
                    players: [...this.state.players, player]
                });
            }

            console.log(this.state.players);
        });


        socket.on('removePlayer', (player) => {
            this.setState({
                players: this.state.players.filter(p => p !== player)
            });
        });
        socket.emit('newPlayer', decoded.first_name+' '+decoded.last_name);
    }

    onPlay(e) {
        console.log(Math.abs(this.videoPlayer.getCurrentTime() - this.state.lastChange));
        if(Math.abs(this.videoPlayer.getCurrentTime() - this.state.lastChange) > 0.5) {
            socket.emit('play', this.videoPlayer.getCurrentTime());
        }
    }
    onPause(e) {
        console.log(Math.abs(this.videoPlayer.getCurrentTime() - this.state.lastChange));
        if(Math.abs(this.videoPlayer.getCurrentTime() - this.state.lastChange) > 0.5) {
            socket.emit('pause', this.videoPlayer.getCurrentTime());
        }
    }
    changeVideo(e) {
        e.preventDefault();
        socket.emit('changeVideo', this.videoUrl.value);
        this.setState({
            currentVideoUrl : this.videoUrl.value,
            playing : true
        })

        console.log(this.state.playing);
        // console.log('changed video ' + util.inspect(this.videoPlayer, false, null, true /* enable colors */));
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
                                    <button className="btn btn-danger pull-right " type="button">Leave Room</button>
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
                                                <ul className="list-group">
                                                    <li className="list-group-item">Player 1: Hello</li>
                                                    <li className="list-group-item">Player 2: Hi</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="Message" />
                                            <div className="input-group-append">
                                                <button className="btn btn-dark" type="button">Send</button>
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