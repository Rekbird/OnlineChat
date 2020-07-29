import React, {Component} from 'react'
import { connect } from 'react-redux';
import { 
    CreateUser,
    CreateUserInRoom,
    CreateRoom,
    EnterRoom,
    LeaveRoom,
    SendMessage
} from './sockets.js'
import './App.scss'
import NamePopUp from './Components/NamePopUp/NamePopUp.js';
import NameIndicator from './Components/NameIndicator/NameIndicator.js'
import ChatRoomList from './Components/ChatRoomList/ChatRoomList.js'

class Application extends Component {
    constructor(props) {
        super(props)
        this.HandleNameChange = this.HandleNameChange.bind(this)
        this.OpenNamePopUp = this.OpenNamePopUp.bind(this)
    }

    HandleNameChange = (name) => {
        if (!!name) {
            CreateUser(name);
        }
   }

   OpenNamePopUp = (isOpen) => {
        const { dispatch } = this.props;
        dispatch({ type: 'OPEN_NAMEPOPUP', PopUpOpen: isOpen});
   }

    render() {
        let popUp = this.props.PopUpOpen ? <NamePopUp name = {this.props.Name} HandleNameChange = {this.HandleNameChange}/> : null

        let roomOrLobby

        return (
            <div className="AppMain">
                <NameIndicator Name = {this.props.Name} OpenNamePopUp = {this.OpenNamePopUp}/>
                <ChatRoomList/>
                {popUp}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Name: state.Name,
    PopUpOpen: state.PopUpOpen,
    Rooms: state.Rooms,
    Room: state.Room
});
  
export default connect(mapStateToProps)(Application);
