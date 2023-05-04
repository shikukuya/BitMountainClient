import React, {Component} from 'react';
import "./index.css"
import HistoryItem from "../../components/HistoryItem";
import Background from "../../components/Background";
import USER_DATA from "../../globalData/userData";
import getUrl from "../../utils/js/getUrl";
class MatchHistory extends Component {
    state = {
        historyList: [],
    }

    render() {
        const {historyList} = this.state;
        return (
            <div className="historyPage">
                <div className="historyList">
                    {
                        historyList.map((item, i) => {
                            return <HistoryItem {...item} key={i}/>
                        })
                    }
                </div>
                <Background/>
            </div>
        );
    }

    componentDidMount() {
        fetch(getUrl("getMatchHistoryByUserName"), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userName: USER_DATA.name}),
        }).then(
            res => res.json()
        ).then(
            res => {
                this.setState({historyList: res["arrayAll"]});
            }
        );
    }
}

export default MatchHistory;
