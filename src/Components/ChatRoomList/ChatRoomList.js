import React, {Component} from 'react'
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
        this.RoomList = this.props.ChatRoomList
        this.CreateNewRoom = this.CreateNewRoom.bind(this)
    }

    CreateNewRoom = (RoomName) => {
        const { dispatch } = this.props
        dispatch({type: 'CREATE_NEW_ROOM', RoomName})
    }

    render() {
        const NewRoomButton = 
        <div className = 'Room'>
            <h3>Add new room</h3>
            <img src='../../../Data/ButtonAddNew.png'/>
        </div>
        let Rooms = null;
        if (!_.isEmpty(this.RoomList)) {
            Rooms = this.RoomList.map((room) => 
                <div className = 'Room'>
                    <h3>{room.Name}</h3>
                    <span>{room.Users.length} Members</span>
                </div>
            )
        }
            
        return (
            <div className = 'RoomList'>
                {Rooms}
                {NewRoomButton}
            </div>
        )   
    }
}
export default ChatRoomList;