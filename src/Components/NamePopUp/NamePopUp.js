import React, {Component} from 'react'
import { connect } from 'react-redux';
import './NamePopUp.scss'

/*Universal popup window
IN: HandleNameChange() method
    showCancel bool
OUT: newName
if chosen name is cannot be taken you will receive error message
*/
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
        let CancelButton = this.props.showCancel ? <button onClick = {() => this.HandleButtonClick('cancel')}>Cancel</button> : null
        let errorMessage = !!this.props.ErrorMessage ? null : <div>{this.props.ErrorMessage}</div>
        return (
            <div className = "modal">
                <div className='NamePopUp'>
                    <h3>Choose a name</h3>
                    <input type='text' maxLength="20" onChange = {this.InputChange}/>
                    {errorMessage}
                    <div>
                        <button onClick = {() => this.HandleButtonClick('accept')}>Accept</button>
                        {CancelButton}
                    </div>
                </div>
            </div>
        )   
    }
}

const mapStateToProps = state => ({
    ErrorMessage: state.Error
})

export default connect(mapStateToProps)(NamePopUp)