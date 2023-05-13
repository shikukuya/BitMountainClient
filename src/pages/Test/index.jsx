import React, {Component} from 'react';


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

    }
    handle2 = () => {

    }
}

export default TestPage;
