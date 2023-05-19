import React, {Component} from 'react';
import "./index.css"
import USER_DATA from "../../globalData/userData";
import FriendListItem from "../FriendListItem";
import SOCKET_OBJ from "../../globalData/socketObject";
import getUrl from "../../utils/js/getUrl";


class FriendList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * [
       *  {
       *         userName: "",
       *         score: 400,
       *         id: "",
       *         headSculpture: 1,
       *  }
       * ]
       */
      friendArr: []
    }
  }

  render() {
    const {friendArr} = this.state;
    console.log("开始渲染", friendArr);
    return (
        <div className="friendList">
          {
            friendArr.map(friend => {
              return <FriendListItem {...friend} key={friend['id']}/>
            })
          }
        </div>
    );
  }

  componentDidMount() {
    // 先验条件已经保证是登录了的
    fetch(getUrl("getFriendsByUserId"), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"id": USER_DATA.id}),
    }).then(res => res.json()).then(
        data => {
          if (data["status"]) {
            this.setState({friendArr: data["data"]});
          } else {
            console.warn(data["text"]);
          }
        }
    )


    // 先验条件已经保证是登录了的
    // fetch(getUrl("getFriendsByUserName"), {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({"userName": USER_DATA.name}),
    // }).then(
    //     res => res.json()
    // ).then(
    //     data => {
    //       if (data.status) {
    //         let arr = [];
    //         let dic = data.data;
    //         for (let key in dic) {
    //           if (dic.hasOwnProperty(key)) {
    //             let friendObj = dic[key];
    //             friendObj.userName = key;
    //             arr.push(friendObj)
    //           }
    //         }
    //         this.setState({friendArr: arr});
    //       } else {
    //         console.warn(data.text);
    //       }
    //     }
    // );

    // 有人这时候把自己给删除了
    SOCKET_OBJ.on(`前端${USER_DATA.name}处理被好友删除`, this.socketHandleDeleteFriend);
    SOCKET_OBJ.on(`前端${USER_DATA.id}新增好友`, this.socketHandleAddFriend);
  }

  socketHandleDeleteFriend = data => {
    let doUserId = data["doUser"];  // 删自己的那个人的id
    let newArr = [];
    for (let item of this.state.friendArr) {
      if (item.id !== doUserId) {
        newArr.push(item);
      }
    }
    this.setState({friendArr: newArr});
  }

  socketHandleAddFriend = (res) => {
    let data = (res);
    let newArr = [...this.state.friendArr];
    newArr.push(data);
    this.setState({friendArr: newArr});
  }

  componentWillUnmount() {
    SOCKET_OBJ.off(`前端${USER_DATA.name}处理被好友删除`, this.socketHandleDeleteFriend);
    SOCKET_OBJ.off(`前端${USER_DATA.id}新增好友`, this.socketHandleAddFriend);
  }
}

export default FriendList;
