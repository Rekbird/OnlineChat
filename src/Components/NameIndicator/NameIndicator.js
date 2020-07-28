import React, {Component} from 'react'
import "./NameIndicator.scss"

class NameIndicator extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className = 'NameIndicator' onClick = {() => this.props.OpenNamePopUp(true)}>
                <img src="../../../Data/avatar.png" width="15" height="15"/>
                <div>{this.props.Name}</div>
            </div>
        )

    }
}

export default NameIndicator