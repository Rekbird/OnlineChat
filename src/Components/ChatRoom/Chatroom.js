import React, {Component} from 'react'
import './ChatRoom.scss'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { 
    EnterRoom,
    LeaveRoom,
    SendMessage
} from '../../sockets.js'
import ChatMessage from './ChatMessage.js'

const _ = require('lodash');

class ChatRoom extends Component {
    constructor(props) {
        super(props)
        this.CurrentUser = this.props.CurrentUser
        this.HandleLeavingRoom = this.HandleLeavingRoom.bind(this)
        this.HandleSendingMessage = this.HandleSendingMessage.bind(this)
        this.newMessage
    }

    HandleLeavingRoom = () => {
        LeaveRoom(this.CurrentUser, this.props.Room.Name)
    }

    HandleSendingMessage = () => {
        SendMessage(this.CurrentUser, this.props.Room.Name, this.newMessage)
    }

    HandleInputChange = (e) => {
        this.newMessage = e.target.value
    }

    render() {
        let memberList
        let messages
        if (!!this.props.Room && !!this.props.Room.Members) {
            let key = 0
            memberList = this.props.Room.Members.map(item => 
                <li className={item.Name == this.CurrentUser.Name ? 'YourUser' : 'OtherUsers'} key= {++key}>{item.Name}</li>)
            
            key = 0
            if(!!this.props.Room.Messages) messages = this.props.Room.Messages.map(item => 
                <ChatMessage key= {++key} userName= {this.CurrentUser.Name} message= {item}/>)

            return (
                <div className= 'RoomMain'>
                    <div className='Header'>
                        <h2>{this.props.lightRoom.Name}</h2>
                        <button onClick= {this.HandleLeavingRoom}>Back to Lobby</button>
                    </div>
                    <div className= 'ChatAndUsers'>
                        <ul>{memberList}</ul>
                        <div>
                            <ul className= 'Messages'>{messages}</ul>
                            <input className= 'Textbox' type= 'text' maxLength= '200' onChange= {this.HandleInputChange}/> 
                            <button onClick= {this.HandleSendingMessage}>Send</button>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <Redirect to='/'/>
                </div>
            )
        }
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