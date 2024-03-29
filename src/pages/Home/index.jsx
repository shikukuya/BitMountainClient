import React, {Component} from 'react';
import './index.css';
import {Navigate} from 'react-router-dom';
import Background from '../../components/Background';
import USER_DATA from '../../globalData/userData';
import SOCKET_OBJ from '../../globalData/socketObject';
import Matching from '../../components/Matching';
import PubSub from 'pubsub-js';
import ModeItem from '../../components/MoodItem';
import getUrl from '../../utils/js/getUrl';
import myAlert from '../../utils/js/alertMassage';
import {startGameSound, startSound} from '../../utils/js/playSound';
import {changeBackgroundMusic} from '../../utils/js/backgroundMusic';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gotoLink: <div/>,
      onlineNum: '连接中……',
      isMatching: false,
      noticeText: '', // 模式提示信息
      choiceMood: '普通模式',
      maxDiff: '计算中……',
    };
  }

  // render函数太大了，拆一下里面
  getInnerElement = () => {
    if (!this.state.isMatching) {
      return (
          <div className="area">
            <h1>天梯模式</h1>
            <div className="modeGroup">
              <ModeItem
                  modeName="普通模式"
                  tipText="两个人对战一道题，5条命，率先通过者胜利"
                  clickFunc={this.getHandleFunctionByName('普通模式')}
              />
              <ModeItem
                  modeName="极限模式"
                  tipText="两个人对战一道题，只有一条命，率先通过者胜利"
                  clickFunc={this.getHandleFunctionByName('极限模式')}
              />
              <ModeItem
                  modeName="多题模式"
                  tipText="两个人对战5道题，10条命，率先通过所有者胜利"
                  clickFunc={this.getHandleFunctionByName('多题模式')}
              />
              <ModeItem
                  modeName="多题极限模式"
                  tipText="两个人对战5道题，只有一条命，率先通过所有者胜利"
                  clickFunc={this.getHandleFunctionByName('多题极限模式')}
              />
            </div>
            <h1>娱乐模式</h1>
            <div className="modeGroup">
              <ModeItem
                  modeName="打字对决"
                  tipText="两个人共同打一篇文章，规定时间内进度优先者胜利"
                  clickFunc={this.getHandleFunctionByName('打字对决')}
              />
              <ModeItem
                  modeName="井字棋脚本擂台"
                  tipText="编写井字棋脚本"
                  clickFunc={() => {
                    this.setState({gotoLink: <Navigate to="/ticTacToe"/>});
                  }}
              />
              <ModeItem
                  modeName="五子棋脚本对决"
                  tipText="编写五子棋脚本"
                  clickFunc={() => {
                    this.setState({gotoLink: <Navigate to="/gobang"/>});
                  }}
              />
              <ModeItem
                  modeName="机械自走棋"
                  tipText="一种新型自走棋游戏，通过编写ai脚本来实现机器人在棋盘上的圈地对抗"
                  clickFunc={() => {
                    this.setState({
                      gotoLink: <Navigate to="/mechanicalAutoChess"/>,
                    });
                  }}
              />
            </div>
          </div>
      );
    } else {
      return <Matching cancelHandle={this.cancelHandle}/>;
    }
  };

  render() {
    const {gotoLink, onlineNum, noticeText, maxDiff} = this.state;
    console.log(onlineNum, 'props拿到的在线人数');
    return (
        <div className="page-home">
          {gotoLink}
          <div className="serverData">
            <p>当前连接人数：{onlineNum}</p>
            <p>匹配最大分数容差：{maxDiff}</p>
            {/*<button onClick={this.testBtn}>test</button>*/}
          </div>
          {this.getInnerElement()}
          <div className="noticeLine">{noticeText}</div>
          <div className="record-number">
            <a href="https://beian.miit.gov.cn" id="beiAnId">冀ICP备2022004336号</a>
          </div>
          <Background/>
        </div>
    );
  }

  // testBtn = () => {
  //   console.log(123);
  //   // SOCKET_OBJ.emit("后端测试监听2", {"id": "767f1e66-4cbd-57b4-9273-453fff6e0be1"});
  // }

  componentDidMount() {
    // SOCKET_OBJ.on("前端监听消息", res => {
    //   console.log(res);
    // })
    fetch(getUrl('getOnlineUserNum'))
        .then((res) => res.json())
        .then((res) => {
          this.setState({onlineNum: res.onlineNum, maxDiff: res.maxDiff});
        })
        .catch((err) => console.log(err));

    // 再开启实时监听
    SOCKET_OBJ.on('前端更新在线人数', this.socketHandleUpdateOnlineNumber);
    // 不停的检查是否已经登录
    this.checkLogin = setInterval(() => {
      if (USER_DATA.isLogin) {
        myAlert('欢迎您来到比特山！');
        this.listenMatch();
        changeBackgroundMusic('main');
        clearInterval(this.checkLogin);
      }
    }, 500);

    this.changeModeTips = PubSub.subscribe('模式提示更改', (_, data) => {
      this.setState(data);
    });

    SOCKET_OBJ.on(`前端用户${USER_DATA.id}接收插入匹配池的消息`, this.socketHandleListenPoolData);
  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.changeModeTips);

    if (this.checkLogin) {
      // 如果这个定时器还没有被清除掉
      clearInterval(this.checkLogin);
    }
    // 关闭socket监听
    if (USER_DATA.isLogin) {
      SOCKET_OBJ.off(`前端用户${USER_DATA.id}匹配到对手`, this.socketHandleListenMatch);
    }

    SOCKET_OBJ.off('前端更新在线人数', this.socketHandleUpdateOnlineNumber);
    SOCKET_OBJ.off(`前端用户${USER_DATA.id}接收插入匹配池的消息`, this.socketHandleListenPoolData);
  }

  socketHandleUpdateOnlineNumber = res => {
    let data = res;
    this.setState({onlineNum: data.onlineNum, maxDiff: data.maxDiff});
  }

  socketHandleListenPoolData = data => {
    myAlert(data["text"]);
  }

  /**
   * 监听到匹配
   * 这个函数需要在登录之后，执行一次
   */
  listenMatch = () => {
    SOCKET_OBJ.on(`前端用户${USER_DATA.id}匹配到对手`, this.socketHandleListenMatch);
  };

  /**
   * socket传来消息：用户匹配到对手
   * data 传来格式：{
   *    id: xxx,  // 这个就是自己的id
   *    mood: xxx,
   *    opponentDetails: {...},
   *    两个题目信息
   * }
   * @param data
   */
  socketHandleListenMatch = data => {
    if (data["opponentDetails"]['id'] === USER_DATA.id) {
      myAlert('惊现奇怪bug，你竟匹配到了你自己，请联系并督促开发者修复');
      return;
    }
    console.log("匹配到的对手信息", data);
    // 更新对手信息
    USER_DATA.opponent = data["opponentDetails"];

    // 当前抽到的题目的列表
    USER_DATA.questionObjList = data['randomQuestionList'];

    // 如果是打字模式，抽到的标题
    USER_DATA.typewriteTitle = data['typewriteTitle'];

    const moodName = data["mood"];

    // 通知导航栏更改状态
    PubSub.publish('导航栏修改模式', {
      isUserPlaying: true,
      modeName: moodName,
    });

    // 开始页面跳转
    this.setState({isMatching: false});
    if (moodName === '普通模式') {
      this.setState({gotoLink: <Navigate to="/normalContest"/>});
    }
    if (moodName === '极限模式') {
      this.setState({gotoLink: <Navigate to="/hardcoreContest"/>});
    }
    if (moodName === '多题模式') {
      this.setState({gotoLink: <Navigate to="/multipleContest"/>});
    }
    if (moodName === '打字对决') {
      this.setState({gotoLink: <Navigate to="/typewritingContest"/>});
    }
    if (moodName === '多题极限模式') {
      this.setState({gotoLink: <Navigate to="/hardMoreContest"/>});
    }

    // 播放一个音效
    startSound();
  }
  /**
   * 取消匹配按钮逻辑
   */
  cancelHandle = () => {
    fetch(getUrl('cancelMatch'), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userId: USER_DATA.id,
        moodName: this.state.choiceMood,
      }),
    })
        .then((res) => res.json())
        .then((res) => {
          console.log('取消匹配的结果', res);
          if (res['status']) {
            myAlert('取消匹配成功');
          } else {
            myAlert('取消匹配失败，您早就已经不在匹配池中了');
          }
          // 无论结果为True或者false，都要取消匹配成功
          this.setState({isMatching: false});
        });
  };

  /**
   * 高阶函数
   * @param moodName
   * @return {function(): void}
   */
  getHandleFunctionByName = moodName => {
    return () => {
      if (USER_DATA.isLogin) {
        this.setState({isMatching: true, choiceMood: moodName});
        // 告诉后端自己开始匹配了
        SOCKET_OBJ.emit('后端处理玩家匹配', {
          // userName: USER_DATA.name,
          id: USER_DATA.id,
          mood: moodName,
          score: USER_DATA.score,
        });
        // 播放一个音效
        startGameSound();
      } else {
        myAlert('请您先登录，才能玩');
      }
    };
  };
}

export default Home;
