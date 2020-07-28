import React, {Component} from 'react'
import { connect } from 'react-redux';
import './App.scss'
import NamePopUp from './Components/NamePopUp/NamePopUp.js';
import NameIndicator from './Components/NameIndicator/NameIndicator.js'

class Application extends Component {
    constructor(props) {
        super(props)
        this.HandleNameChange = this.HandleNameChange.bind(this)
        this.OpenNamePopUp = this.OpenNamePopUp.bind(this)
    }

    HandleNameChange = (Name) => {
        const { dispatch } = this.props;
        if (!!Name) {
            dispatch({ type: 'ASSIGNED_USERNAME', Name });
        }
        this.OpenNamePopUp(false)
   }

   OpenNamePopUp = (isOpen) => {
        const { dispatch } = this.props;
        dispatch({ type: 'OPEN_NAMEPOPUP', PopUpOpen: isOpen});
   }

    render() {
        let PopUp = this.props.PopUpOpen ? <NamePopUp Open = {this.PopUpOpen} Name = {this.props.Name} HandleNameChange = {this.HandleNameChange}/> : null
        return (
            <div className="AppMain">
                <NameIndicator Name = {this.props.Name} OpenNamePopUp = {this.OpenNamePopUp}/>
                
                {PopUp}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    Name: state.Name,
    PopUpOpen: state.PopUpOpen
});
  
export default connect(mapStateToProps)(Application);
