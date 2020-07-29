import React, {Component} from 'react'
import './ChatRoom.scss'
import { connect } from 'react-redux'
import { 
    EnterRoom,
    CreateUserInRoom
} from '../../sockets.js'
import NamePopUp from '../NamePopUp/NamePopUp.js'

const _ = require('lodash');

class ChatRoom extends Component {
    constructor(props) {
        super(props)
        this.CurrentUser = this.props.CurrentUser
    }

    HandleNameChange = (name, roomName) => {
        if (!!name) {
            CreateUserInRoom(name, roomName);
        }
   }

    render() {
        let chatRoom = <div>Fetching some data...</div>
        let popUp = !this.CurrentUser ? <NamePopUp showCancel = {false} HandleNameChange = {this.HandleNameChange}/> : null
        if (!!this.props.Room && !!this.props.Room.Members) {
            let key = 0
            let memberList = this.props.Room.Members.map(item => item.Name == this.CurrentUser.Name ? <li key= {++key}>{item.Name} (You)</li> : <li key= {++key}>{item.Name}</li>)
            chatRoom = <ul>{memberList}</ul>
        } else {
            chatRoom = <div>Fetching some data...</div>
        }
        
        return (
            <div>
                <h2>{this.props.lightRoom.Name}</h2>
                {chatRoom}
                {popUp}
            </div>
        )
    }

    //Requesting room info if user came from lobby
    componentDidMount() {
        if (!!this.CurrentUser && !this.props.Room) EnterRoom(this.CurrentUser, this.props.lightRoom.Name)
    }
}

const mapStateToProps = state => ({
    Room: state.Room,
    CurrentUser: state.User
})

export default connect(mapStateToProps)(ChatRoom)