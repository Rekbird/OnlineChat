import React, {Component} from 'react'

class ChatMessage extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        return (
            <div>
                <span>{this.props.message.SentBy} {this.props.message.TimeStamp}</span>
                <span>{this.props.message.Text}</span>
            </div>
        )
    }
}

export default ChatMessage