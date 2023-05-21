import React, {Component} from 'react';
import './index.css';
import FriendList from '../../components/FriendList';
import FriendRequestList from '../../components/FriendRequestList';
import Background from '../../components/Background';
import USER_DATA from '../../globalData/userData';
import UserDataPanel from '../../components/UserDataPanel';
import UnLogin from '../../components/UnLogin';
import UserAbilityPanel from '../../components/UserAbilityPanel';

class Friend extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    showFriendList: true,
    showFriendRequest: false,
    showRecentPlayers: false,
  };

  render() {
    const {showFriendList, showFriendRequest} = this.state;
    return (
        <div className="friendPage">
          {/*详细能力弹窗*/}
          <UserAbilityPanel/>

          <div className="left">
            {/* <h2>添加好友</h2>
            <AddFriend/>
            <h4>您的ID</h4>
            <CopyUUID/>
            <h4>您的信息</h4>
            <UserDataPanel/> */}
            <button
                className={showFriendList ? "selected" : ""}
                onClick={this.handleFriendList}
            >
              我的好友
            </button>
            <button onClick={this.handleFriendRequest}
                    className={showFriendRequest ? "selected" : ""}>
              添加好友
            </button>
            {/* <button
            onClick={this.handleRecentPlayers}
            ref={this.recentPlayersBtn}
          >
            最近对战
          </button> */}
            <UserDataPanel/>
          </div>
          <div className="right">
            <div className="downBody">{this.showList()}</div>
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
        return <FriendList/>;
      }
      if (showFriendRequest) {
        return <FriendRequestList/>;
      }
    } else {
      return <UnLogin/>;
    }
  };

  /// 点击好友列表
  handleFriendList = () => {
    this.setState({
      showFriendList: true,
      showFriendRequest: false,
      showRecentPlayers: false,
    });
  };

  /// 点击好友申请
  handleFriendRequest = () => {
    this.setState({
      showFriendList: false,
      showFriendRequest: true,
      showRecentPlayers: false,
    });
  };

  /// 点击最近对战
  handleRecentPlayers = () => {
    this.setState({
      showFriendList: false,
      showFriendRequest: false,
      showRecentPlayers: true,
    });
  };

  componentDidMount() {
    console.log(USER_DATA);
  }
}

export default Friend;
