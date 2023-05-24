import React, {Component} from 'react'
import "./App.css"
import "./utils/css/util.css"

import {Routes, Route, Navigate} from "react-router-dom";

import TopNav from "./components/TopNav";

import Home from "./pages/Home";
import Friend from "./pages/Friend";
import MatchHistory from "./pages/MatchHistory";
import UserPage from "./pages/UserPage";
import Register from "./pages/Register";
import RuleIntroduction from "./pages/RuleIntroduction";
import ResetPage from "./pages/Reset";
import NormalContest from "./pages/NormalContest";
import TypeWritingContest from "./pages/TypeWritingContest";
import MultipleContest from "./pages/MultipleContest";
import TestPage from "./pages/Test";
import TicTacToe from "./pages/TicTacToe";
import Gobang from "./pages/Gobang";
import HonorPath from "./pages/HonorPath";
import TermsAndConditions from "./pages/TermsAndConditions";
import MechanicalAutoChess from "./pages/MechanicalAutoChess";
import Admin from "./pages/Admin";
import PubSub from "pubsub-js";

export default class App extends Component {

  render() {
    const hint = "您的浏览器不支持HTML5音频标签，请升级到更新的浏览器。";
    return (
        <div>
          <TopNav/>

          <Routes>
            <Route path="/home" element={<Home/>}/>
            <Route path="/friend" element={<Friend/>}/>
            <Route path="/match-history" element={<MatchHistory/>}/>
            <Route path="/user-page" element={<UserPage/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/rule" element={<RuleIntroduction/>}/>
            <Route path="/reset" element={<ResetPage/>}/>
            <Route path="/normalContest" element={<NormalContest hpInit={5} moodName="普通模式"/>}/>
            <Route path="/hardcoreContest" element={<NormalContest hpInit={1} moodName="极限模式"/>}/>
            <Route path="/multipleContest" element={<MultipleContest hpInit={10} moodName="多题模式"/>}/>
            <Route path="/typewritingContest" element={<TypeWritingContest/>}/>
            <Route path="/hardMoreContest" element={<MultipleContest hpInit={1} moodName="多题极限模式"/>}/>
            <Route path="/ticTacToe" element={<TicTacToe/>}/>
            <Route path="/gobang" element={<Gobang/>}/>
            <Route path="/test" element={<TestPage/>}/>
            <Route path="/honorPath" element={<HonorPath/>}/>
            <Route path="/mechanicalAutoChess" element={<MechanicalAutoChess/>}/>
            <Route path="/termsAndConditions" element={<TermsAndConditions/>}/>
            <Route path="/admin" element={<Admin/>}/>

            <Route path="/" element={<Navigate to="/home"/>}/>
          </Routes>
          <div className="music">
            <audio src={this.state.currentMusicSrc}
                   ref={this.musicRef}
                   loop preload={"auto"}>{hint}</audio>
          </div>
        </div>
    )
  }

  constructor(props) {
    super(props);
    this.state = {
      currentMusicSrc: "http://littlefean.gitee.io/bit-mountain-music/music/login.mp3",
    }
    this.musicRef = React.createRef();
  }

  componentDidMount() {

    this.token = PubSub.subscribe("背景音乐状态改变", (_, data) => {
      this.setState({currentMusicSrc: data["src"]});
      this.musicRef.current.volume = data["volume"];
      this.musicRef.current.play();
    });


    // 上上下下左右左右 ba
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

    let konamiCodeIndex = 0;

    document.addEventListener('keydown', (event) => {
      if (event.keyCode === konamiCode[konamiCodeIndex]) {
        konamiCodeIndex++;
        if (konamiCodeIndex === konamiCode.length) {
          console.log("触发了小彩蛋");
          window.open("/#/admin");
          konamiCodeIndex = 0;
        }
      } else {
        konamiCodeIndex = 0;
      }
    });

  }

  componentWillUnmount() {
    // 取消消息订阅
    PubSub.unsubscribe(this.token);
  }

}
