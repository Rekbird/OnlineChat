import React, {Component} from 'react'
import { connect } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useParams
  } from "react-router-dom"
import { 
    CreateUser,
    CreateUserInRoom,
    EnterRoom,
    LeaveRoom,
    SendMessage
} from './sockets.js'
import './App.scss'
import NamePopUp from './Components/NamePopUp/NamePopUp.js'
import NameIndicator from './Components/NameIndicator/NameIndicator.js'
import ChatRoomList from './Components/ChatRoomList/ChatRoomList.js'
import ChatRoom from './Components/ChatRoom/Chatroom.js'


class Application extends Component {
    constructor(props) {
        super(props)
        this.HandleNameChange = this.HandleNameChange.bind(this)
    }

    HandleNameChange = (name) => {
        if (!!name) {
            CreateUser(name);
        }
   }

    render() {
        let rooms = null
        if (!_.isEmpty(this.props.Rooms)) {
            let key = 0
            rooms = this.props.Rooms.map(item => 
                <Route path={'/' + key} key= {++key}>
                    <ChatRoom lightRoom = {item}/>
                </Route>
                )
        }

        let popUp = !this.props.CurrentUser ? <NamePopUp showCancel = {false} HandleNameChange = {this.HandleNameChange}/> : null
        let lobby = 
            <div className="AppMain">
                <h1>HELLO, {this.props.Name}</h1>
                <ChatRoomList/>
                {popUp}
            </div>
        
        if (!!this.props.Room) {
            let path = '/' + this.props.Room.Name
            lobby = <Redirect to= {path}/>
        } 

        return (
            <Router>
                <Switch>
                    {rooms}
                    <Route exact path='/'>
                        {lobby}
                    </Route>
                    <Route path= '*'>
                        <Redirect to= '/'/>
                    </Route> 
                </Switch>
            </Router>
        )
    }
}

const mapStateToProps = state => ({
    Name: state.Name,
    CurrentUser: state.User,
    Rooms: state.Rooms,
    Room: state.Room
})

export default connect(mapStateToProps)(Application)