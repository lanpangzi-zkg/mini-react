import React from 'react';
import Component from './mini-react/Component';
import './style.css';

class Foo extends Component {
  render() {
    const { title } = this.props;
    return <div className="foo">{title}</div>;
  }
}

export default function App() {
  return (
    <div className="box">
      <h1 id="a">Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
      <Foo title="haha" />
    </div>
  );
}
