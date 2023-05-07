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
import SOCKET_OBJ from "./globalData/socketObject";
import NormalContest from "./pages/NormalContest";
import TypeWritingContest from "./pages/TypeWritingContest";
import MultipleContest from "./pages/MultipleContest";
import TestPage from "./pages/Test";
import myAlert from "./utils/js/alertMassage";
import TicTacToe from "./pages/TicTacToe";
import Gobang from "./pages/Gobang";
import HonorPath from "./pages/HonorPath";
import TermsAndConditions from "./pages/TermsAndConditions";
import MechanicalAutoChess from "./pages/MechanicalAutoChess";

export default class App extends Component {

  render() {
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

            <Route path="/" element={<Navigate to="/home"/>}/>
          </Routes>

        </div>
    )
  }

  gotoHome = () => {

  }

  componentDidMount() {
    const konamiCode = [
      38, // up
      38, // up
      40, // down
      40, // down
      37, // left
      39, // right
      37, // left
      39, // right
      66, // b
      65  // a
    ];

    let konamiCodeIndex = 0;

    document.addEventListener('keydown', function (event) {
      if (event.keyCode === konamiCode[konamiCodeIndex]) {
        konamiCodeIndex++;
        if (konamiCodeIndex === konamiCode.length) {
          console.log("触发了小彩蛋");
          konamiCodeIndex = 0;
        }
      } else {
        konamiCodeIndex = 0;
      }
    });

  }
}
