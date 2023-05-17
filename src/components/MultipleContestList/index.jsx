import React, {Component} from 'react';
import "./index.css";
import getArray from "../../utils/js/range";
import {numberToAlpha} from "../../utils/js/strTools";
import SOCKET_OBJ from "../../globalData/socketObject";
import USER_DATA from "../../globalData/userData";

import PubSub from "pubsub-js"
import MultipleContestListItem from "../MultipleContestListItem";

class MultipleContestList extends Component {

  constructor(props) {
    super(props);
    const {roomName} = this.props;
    this.roomName = roomName;
    this.state = {

      myCurQuestion: 0,
      opCurQuestion: 0,
    }
  }

  render() {
    const {myCurQuestion, opCurQuestion} = this.state;
    return (
        <div className="multipleContestList">
          {
            getArray(5).map(i => {
              return <MultipleContestListItem
                  index={i}
                  alpha={numberToAlpha(i)}
                  clickFunc={this.handleClickQuestion(i)}
                  key={i}/>
            })
          }
          <div className="SpecQue mySpec" style={{top: `${myCurQuestion * 20}%`}}/>
          <div className="SpecQue opSpec" style={{top: `${opCurQuestion * 20}%`}}/>
        </div>
    );
  }

  handleClickQuestion = (index) => {
    return (ev) => {
      this.setState({myCurQuestion: index});
      SOCKET_OBJ.emit("对局中的用户更新自己在看哪个题", {
        roomName: this.roomName,
        userName: USER_DATA.name,
        newIndex: index,
      });
      // 告诉Question组件展示对应的题目
      PubSub.publish("更新用户正在看题的下标",
          {"index": index}
      );
    }
  }


  componentDidMount() {
    // 监听对手的看题位置
    SOCKET_OBJ.on(`前端对局中${this.roomName}房间有用户更新看题位置`, this.socketHandleUpdateLook);
  }

  socketHandleUpdateLook = res => {
    let data = (res);
    if (data["userName"] === USER_DATA.opponent.name) {
      this.setState({opCurQuestion: data["newIndex"]});
    }
  }

  componentWillUnmount() {
    SOCKET_OBJ.off(`前端对局中${this.roomName}房间有用户更新看题位置`, this.socketHandleUpdateLook);
  }

}

export default MultipleContestList;
