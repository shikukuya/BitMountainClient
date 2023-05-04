import React, {Component} from 'react';
import {submitCode, submitCode2} from "../../utils/js/glotApiTools";

class TestPage extends Component {
    render() {
        return (
            <div>
                <button onClick={this.handle}>点击发送</button>
                <button onClick={this.handle2}>点击发送2</button>

                <textarea name="" id="" cols="30" rows="10">

                </textarea>
            </div>
        );
    }

    handle = () => {
        submitCode().finish(res => {
            console.log(res);
        })
    }
    handle2 = () => {
        console.log(2222)
        submitCode2();
    }
}

export default TestPage;
