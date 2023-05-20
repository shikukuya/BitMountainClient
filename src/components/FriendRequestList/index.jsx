import React, {Component} from 'react';
import FriendRequestListItem from '../FriendRequestListItem';
import USER_DATA from '../../globalData/userData';
import SOCKET_OBJ from '../../globalData/socketObject';
import getUrl from '../../utils/js/getUrl';
import CopyUUID from '../CopyUUID';
import AddFriend from '../AddFriend';
import myAlert from "../../utils/js/alertMassage";

class FriendRequestList extends Component {
  state = {
    friendReqArr: [],
  };

  render() {
    return (
        <div>
          <CopyUUID/>
          <AddFriend/>
          {/*name, score, id, note, headSculpture*/}
          {this.state.friendReqArr.map((cur) => {
            return <FriendRequestListItem {...cur} />;
          })}
        </div>
    );
  }

  componentDidMount() {
    if (USER_DATA.isLogin) {
      fetch(getUrl('getFriendReqByUserId'), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: USER_DATA.id}),
      })
          .then((response) => response.json())
          .then((res) => {
            if (res.status) {
              this.setState({friendReqArr: res["data"]});
              /**
               * arr 中的每一项中必须有
               * {name, score, id, note, headSculpture}
               */
            } else {
              myAlert(`${res.text}`);
            }
          });

      SOCKET_OBJ.on(`前端${USER_DATA.id}接收好友请求`, this.socketHandleGetFriend);
    }
  }

  /**
   * 前端接收到好友请求,socket响应内容
   * socket传来的消息：
   *  {
   *    fromUserId: "xxx"
   *    note: "xxx"
   *  }
   * @param data
   */
  socketHandleGetFriend = data => {
    let arr = this.state.friendReqArr;

    let fromUserId = data['fromUserId'];
    let note = data["note"];

    fetch(getUrl('getDetailByUserId'), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: fromUserId}),
    })
        .then((res) => res.json())
        .then(res2 => {
          if (res2["status"]) {
            console.log('来加好友的人是数据库里的人，来源正确', res2);
            // name 改为 userName
            let newFriendReq = res2["data"];
            newFriendReq["note"] = note;
            arr.push(newFriendReq);
            this.setState({friendReqArr: arr});
          } else {
            console.warn('来加好友的人不是数据库里的', res2);
          }
        });
  }

  componentWillUnmount() {
    if (USER_DATA.isLogin) {
      SOCKET_OBJ.off(`前端${USER_DATA.id}接收好友请求`, this.socketHandleGetFriend);
    }
  }
}

export default FriendRequestList;
