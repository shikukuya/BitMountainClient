import React, {Component} from 'react';
import "./index.css"
import {computeLevel} from "../../model/level";
import SOCKET_OBJ from "../../globalData/socketObject";
import USER_DATA from "../../globalData/userData";

class FriendRequestListItem extends Component {
    constructor(props) {
        super(props);
        this.selfEle = React.createRef();
    }

    render() {

        const {name, score, id, note, headSculpture} = this.props;
        return (
            <div className="friendRequestItem" key={id} ref={this.selfEle}>
                <div className="left">
                    <img src={require(`../../headImgs/${headSculpture}.png`)} alt="?" className="headImg"/>
                </div>
                <div className="mid">
                    <div className="basicData">
                        <div className="name">{name}</div>
                        <img src={require(`../../levelIcon/level${computeLevel(score)}.png`)} alt="" className="level"/>
                        <div className="score">{score}</div>
                    </div>
                    <div className="note">
                        {note}
                    </div>

                </div>
                <div className="right">
                    <button className="confirmBtn" onClick={this.agreeHandle}>接受</button>
                    <button className="refuseBtn" onClick={this.refuseHandle}>拒绝</button>
                </div>

            </div>
        );
    }

    // 发送接受这个好友、拒绝这个好友的后端消息
    emitData = (bool) => {
        const {name} = this.props;
        SOCKET_OBJ.emit("后端更新好友请求处理", {
            // a 同意 b
            aUser: USER_DATA.name,
            bUser: name,
            isAgree: bool,
        })
        this.selfEle.current.style.display = "none";
    }

    agreeHandle = () => {
        this.emitData(true);
    }

    refuseHandle = () => {
        this.emitData(false);
    }
}

export default FriendRequestListItem;
