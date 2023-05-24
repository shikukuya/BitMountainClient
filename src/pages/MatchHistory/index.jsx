import React, {Component} from 'react';
import "./index.css"
import HistoryItem from "../../components/HistoryItem";
import Background from "../../components/Background";
import USER_DATA from "../../globalData/userData";
import getUrl from "../../utils/js/getUrl";
import myAlert from "../../utils/js/alertMassage";
class MatchHistory extends Component {
    state = {
        historyList: [],
    }

    render() {
        const {historyList} = this.state;
        return (
            <div className="page-history">
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
        if (USER_DATA.isLogin) {
            fetch(getUrl("getMatchHistoryByUserId"), {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: USER_DATA.id}),
            }).then(
                res => res.json()
            ).then(
                res => {
                    if (res["status"]) {
                        this.setState({historyList: res["arrayAll"]});
                    } else {
                        myAlert(`${res["text"]}`);
                    }
                }
            );
        } else {
            myAlert("请您先登录！");
        }
    }
}

export default MatchHistory;
