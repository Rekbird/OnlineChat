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
                <span className= 'MessageText'>{this.props.message.Text}</span>
            </div>
        )
    }
}

export default ChatMessage