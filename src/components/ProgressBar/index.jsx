import React, {Component} from 'react';
import "./index.css";

class ProgressBar extends Component {

    render() {
        // rate 是一个0~1之间的小数
        // color = [int, int, int]
        const {w, h, rate, color} = this.props;
        let [r, g, b] = color;

        return (
            <div
                className="components-progress-bar"
                style={{
                    width: `${w}px`,
                    height: `${h}px`
                }}
            >
                <div className="inner"
                     style={{
                         backgroundColor: `rgb(${r}, ${g}, ${b})`,
                         width: `${rate * 100}%`
                     }}
                />
            </div>
        );
    }
}

export default ProgressBar;
