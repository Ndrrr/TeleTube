import React, { Component } from 'react'
import {activateAccount} from "./UserFunctions";

class Activation extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('reached')
        const token = this.props.match.params.token;
        activateAccount(token).then(res => {
            if(res){
                this.props.history.push(`/login?msg=activated`)
            } else {
                this.props.history.push(`/login?msg=activation_failed`)
            }
        })
    }

    render() {

        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center"></h1>
                    </div>
                </div>
            </div>
        )
    }
}

export default Activation
