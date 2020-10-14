import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import MailIcon from '@material-ui/icons/Mail';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
const useStyles = (theme) => ({
    root: {
        width: "82vw",
        padding: "5vw 9vw",
    },
    title: {
        fontSize: "7vw",
        color: "#3c3c3c"
    },
    infoCard: {
        // height: "24vw",
        height: "auto",
        border: "1px solid #cacaca",
        borderRadius: "5vw",
        margin: "3vw 0",
        padding: "5vw",
        display: "flex",
        justifyContent: "space-between",
    },
    user: {
        marginTop: "2.2vw",
        width: "50vw",
    },
    userName: {
        fontSize: "7vw",
        wordWrap: "break-all",
    },
    userInfoIcon: {
        marginRight: "2vw",
    },
    userInfo: {
        margin: "1vw",
        fontSize: "3.8vw",
        display: "flex",
        color: "#888"
    },
    userAvatarHolder:{
        width: "25vw"
    },
    userAvatarImageHolder:{
        width: "25vw"
    },
    userAvatarImage:{
        width: "100%",
        height: "auto",
        borderRadius: "50%"
    },
});


class UserInfoCard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.title}>
                    <b>ALLWAY 報修系統</b>
                </div>
                <div className={classes.infoCard}>
                    <div className={classes.user}>
                        <div className={classes.userName}>
                            <b>{this.props.displayName}</b>
                        </div>
                        <div className={classes.userInfo}>
                            <AccountBoxIcon className={classes.userInfoIcon} />
                            {`${this.props.Store_Name} · ${this.props.Customer_Name}`}
                        </div>
                        <div className={classes.userInfo}>
                            <PhoneIphoneIcon className={classes.userInfoIcon} />
                            {`${this.props.Customer_Mobile}`}
                        </div>
                        <div className={classes.userInfo}>
                            <MailIcon className={classes.userInfoIcon} />
                            {`${this.props.Customer_Email}`}
                        </div>
                    </div>
                    <div className={classes.userAvatarHolder}>
                        <div className={classes.userAvatarImageHolder}>
                            <img className={classes.userAvatarImage} src={this.props.pictureUrl}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withStyles(useStyles)(UserInfoCard)