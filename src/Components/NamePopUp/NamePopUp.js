import React, {Component} from 'react'
import './NamePopUp.scss'


class NamePopUp extends Component {
    constructor(props) {
        super(props)
        this.HandleButtonClick = this.HandleButtonClick.bind(this)
        this.InputChange = this.InputChange.bind(this)
        this.NewName
    }

    HandleButtonClick = (Button) => {
        Button == 'cancel' ? this.props.HandleNameChange(null) : this.props.HandleNameChange(this.NewName);
    }

    InputChange = (e) => {
        this.NewName = e.target.value
    }

    render() {
        let CancelButton = !!this.props.Name ? <button onClick = {() => this.HandleButtonClick('cancel')}>Cancel</button> : null
        return (
            <div className = "modal">
                <div className='NamePopUp'>
                    <h3>Enter your name</h3>
                    <input type='text' maxLength="20" onChange = {this.InputChange}/>
                    <div>
                        <button onClick = {() => this.HandleButtonClick('accept')}>Accept</button>
                        {CancelButton}
                    </div>
                </div>
            </div>
        )   
    }
}
export default NamePopUp;