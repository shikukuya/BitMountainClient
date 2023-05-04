import React, {Component} from 'react';
import "./index.css"

class AbilityCircle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {w, h, x, y, title, ability} = this.props;
    return (
        <div className="abilityCircle" style={
          {
            left: `${x}%`, top: `${y}%`,
            width: `${w}px`,
            height: `${h}px`,
            lineHeight: `${h}px`,
            animationDelay: `${Math.random()}s`,
            outlineWidth: `${Math.log(ability + 1) * 2}px`,
            boxShadow: `green 0 0 ${Math.log(ability + 1) * 2}px`,
            backgroundColor: `rgba(0, 0, 0, ${Math.atan(ability * 10) / Math.PI})`,
          }
        }>
          {title}
        </div>
    );
  }
}

export default AbilityCircle;
