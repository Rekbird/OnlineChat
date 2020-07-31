import React, {Component} from 'react'
import './ChatMessage.scss'

class ChatMessage extends Component {
    constructor(props) {
        super(props)
    }



    render() {
        return (
            <div className= 'ChatMessage'>
                <span className= 'MessageSignOff'>{this.props.message.SentBy} {this.props.message.TimeStamp}</span>
                <p className= 'MessageText'>{this.props.message.Text}</p>
            </div>
        )
    }
}

export default ChatMessage