import React, {Component} from 'react';
import "./index.css"
import FriendList from "../../components/FriendList";
import FriendRequestList from "../../components/FriendRequestList";
import Background from "../../components/Background";
import USER_DATA from "../../globalData/userData";
import AddFriend from "../../components/AddFriend";
import CopyUUID from "../../components/CopyUUID";
import UserDataPanel from "../../components/UserDataPanel";
import UnLogin from "../../components/UnLogin";
import UserAbilityPanel from "../../components/UserAbilityPanel";

class Friend extends Component {
  constructor(props) {
    super(props);
    this.friendListBtn = React.createRef();
    this.friendReqBtn = React.createRef();
  }

  state = {
    showFriendList: true,
    showFriendRequest: false,
  }

  render() {
    return (
        <div className="friendPage">
          {/*详细能力弹窗*/}
          <UserAbilityPanel/>

          <div className="left">
            <h2>添加好友</h2>
            <AddFriend/>
            <h4>您的ID</h4>
            <CopyUUID/>
            <h4>您的信息</h4>
            <UserDataPanel/>
          </div>
          <div className="right">
            <div className="topLine">
              <button className="top-switch active"
                      onClick={this.handleFriendList}
                      ref={this.friendListBtn}>
                好友列表
              </button>
              <button className="top-switch"
                      onClick={this.handleFriendRequest}
                      ref={this.friendReqBtn}>
                好友申请
              </button>
            </div>
            <div className="downBody">
              {this.showList()}
            </div>
          </div>
          <Background/>
        </div>
    );
  }

  /**
   * 根据状态展示信息
   */
  showList = () => {
    const {showFriendList, showFriendRequest} = this.state;
    if (USER_DATA.isLogin) {
      if (showFriendList) {
        return (<FriendList/>)
      }
      if (showFriendRequest) {
        return (<FriendRequestList/>)
      }
    } else {
      return <UnLogin/>;
    }

  }

  /// 点击好友列表
  handleFriendList = () => {
    this.setState({
      showFriendList: true,
      showFriendRequest: false,
    })
    this.friendReqBtn.current.classList.remove("active");
    this.friendListBtn.current.classList.add("active");
  }

  /// 点击好友申请
  handleFriendRequest = () => {
    this.setState({
      showFriendList: false,
      showFriendRequest: true,
    })
    this.friendReqBtn.current.classList.add("active");
    this.friendListBtn.current.classList.remove("active");
  }

  componentDidMount() {
    console.log(USER_DATA);
  }
}

export default Friend;
