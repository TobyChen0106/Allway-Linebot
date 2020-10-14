import React, { Component } from 'react';
import './AppTitle.css'

class AppTitle extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app-title">
                <div className="row select-cards-title-wrapper">
                    {/* <img className="logo-image" src={this.props.logo} /> */}
                    <div className="chinese-font select-cards-title">{this.props.title}</div>
                </div>
                <div className="row">
                    <div className="seletion-subtitle-wrapper chinese-font" >
                        {this.props.subtitle}
                    </div>
                </div>
            </div>
        );
    }
}
export default AppTitle;