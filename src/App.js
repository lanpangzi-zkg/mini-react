import React from 'react';
import Component from './mini-react-v2/Component';
import './style.css';

class Foo extends Component {
  render() {
    const { title } = this.props;
    return <div className="foo">{title}</div>;
  }
}
function Bar(props) {
  return <p className="bar">name:{props.name}</p>;
}
export default function App() {
  return (
    <div className="box">
      <h1 id="a">Hello StackBlitz!</h1>
      <p className="p1">Start editing to see some magic happen :)</p>
      <Foo title="hehe" />
      <Bar name="bar" />
    </div>
  );
}
