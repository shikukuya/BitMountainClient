import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import "./index.css";


class GoHomeAlert extends Component {

    render() {
        const {
            isWin,
            isShow,
            reason
        } = this.props;

        let title = isWin ? "胜利" : "失败";

        if (isShow) {
            return (
                <div className="goHomeAlertPanel">
                    <div className="alertPanel">
                        <p className="title">{title}</p>
                        <p className="reason">{reason}</p>
                        <NavLink className="btn" to="/home"
                                 onClick={this.handleExitContest}>返回主界面</NavLink>
                    </div>

                    <div className="blackGround"/>
                </div>
            );
        } else {
            return <div/>
        }

    }
}

export default GoHomeAlert;
