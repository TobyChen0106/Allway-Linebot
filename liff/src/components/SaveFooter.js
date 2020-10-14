import React, { Component } from 'react';
import './SaveFooter.css'

class SaveFooter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row select-cards-save-wrapper">
                <div className="row select-cards-save-shadow" />
                <div className="row select-cards-save-button-wrapper">
                    <button className="select-cards-save-button chinese-font" onClick={this.props.formOnSubmit}>
                        {this.props.saveButtonName}
                    </button>
                </div>
            </div>
        );
    }
}
export default SaveFooter;