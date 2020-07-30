import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { 
    CreateRoom,
} from '../../sockets.js'
import NamePopUp from '../NamePopUp/NamePopUp.js'
import './ChatRoomList.scss'

/**
 * In:
 * List of ChatRooms
 * 
 * Out:
 * New ChatRoom
 */
const _ = require('lodash');

class ChatRoomList extends Component {
    constructor(props) {
        super(props)
        this.CreateNewRoom = this.CreateNewRoom.bind(this)
        this.VisibleNamePopUp = this.VisibleNamePopUp.bind(this)
    }

    CreateNewRoom = (roomName) => {
        if (!!roomName) CreateRoom(roomName, this.props.CurrentUser)
        else this.VisibleNamePopUp(false)
    }

    VisibleNamePopUp = (isVisible) => {
        const { dispatch } = this.props;
        dispatch({ type: 'VISIBLE_NAMEPOPUP', PopUpVisible: isVisible});
   }

    render() {
        let rooms = null;
        let popUp = this.props.PopUpVisible ? <NamePopUp showCancel = {true} HandleNameChange = {this.CreateNewRoom}/> : null
        const newRoomButton = 
            <div className = 'Room' onClick = {() => this.VisibleNamePopUp(true)}>
                <h3>Add new room</h3>
                <img src='../../../Data/ButtonAddNew.png'/>
            </div>

        if (!_.isEmpty(this.props.Rooms)) {
            let key = 0
            rooms = this.props.Rooms.map((room) => 
                <Link to={'/' + room.Name} key= {++key}>
                    <div className = 'Room' >
                        <h3>{room.Name}</h3>
                        <span>Members: {room.Members}</span>
                    </div>
                </Link>
            )
        }
            
        return (
            <div className = 'RoomList'>
                {rooms}
                {newRoomButton}
                {popUp}
            </div>
        )   
    }
}

const mapStateToProps = state => ({
    PopUpVisible: state.PopUpVisible,
    Rooms: state.Rooms,
    CurrentUser: state.User
})

export default connect(mapStateToProps)(ChatRoomList)