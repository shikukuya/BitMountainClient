import React, {Component} from 'react';
import FriendRequestListItem from '../FriendRequestListItem';
import USER_DATA from '../../globalData/userData';
import SOCKET_OBJ from '../../globalData/socketObject';
import getUrl from '../../utils/js/getUrl';
import CopyUUID from '../CopyUUID';
import AddFriend from '../AddFriend';

class FriendRequestList extends Component {
  state = {
    friendReqArr: [],
  };

  render() {
    return (
        <div>
          <CopyUUID/>
          <AddFriend/>
          {this.state.friendReqArr.map((cur) => {
            return <FriendRequestListItem {...cur} />;
          })}
        </div>
    );
  }

  componentDidMount() {
    if (USER_DATA.isLogin) {
      fetch(getUrl('getFriendReqByUserName'), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userName: USER_DATA.name}),
      })
          .then((response) => response.json())
          .then((res) => {
            if (res.status) {
              let arr = [];
              let dic = res.data;
              for (let key in dic) {
                if (dic.hasOwnProperty(key)) {
                  let friendObj = dic[key];
                  friendObj.name = key;
                  arr.push(friendObj);
                }
              }
              this.setState({friendReqArr: arr});
            } else {
              console.warn(res.text);
            }
          });

      SOCKET_OBJ.on(`前端${USER_DATA.name}接收好友请求`, this.socketHandleGetFriend);
    }
  }

  socketHandleGetFriend = res => {
    let data = res;

    let arr = this.state.friendReqArr;

    let fromUser = data['fromUser'];
    let note = data.note;

    fetch(getUrl('getDetailByUserName'), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({userName: fromUser}),
    })
        .then((res) => res.json())
        .then((res2) => {
          if (res2.status) {
            console.log('来加好友的人是数据库里的人，来源正确', res2);
            arr.push({
              name: fromUser,
              score: res2.data.score,
              id: res2.data.id,
              note: note,
              headSculpture: res2.data.headSculpture,
            });
            this.setState({friendReqArr: arr});
          } else {
            console.log('来加好友的人不是数据库里的', res2);
          }
        });
  }

  componentWillUnmount() {
    if (USER_DATA.isLogin) {
      SOCKET_OBJ.off(`前端${USER_DATA.name}接收好友请求`, this.socketHandleGetFriend);
    }
  }
}

export default FriendRequestList;
