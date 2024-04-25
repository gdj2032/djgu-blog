import { Button } from 'antd';
import React, { Component } from 'react';

interface IProps {
}

interface IState {
  a: number;
  b: { obj: number }[];
}

export default class TestChild2 extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      a: 1,
      b: [],
    };
  }

  handleAddA = () => {
    this.setState({ a: this.state.a + 1 })
    setTimeout(() => {
      this.setState({ a: this.state.a + 1 })
    }, 0);

    new Promise((resolve, reject) => {
      resolve('')
    }).then(() => {
      this.setState({ a: this.state.a + 1 })
    })
  }

  handleAddB = () => {
    this.setState({ b: [{ obj: 1 }] })
  }

  render() {
    const { a, b } = this.state;
    return (
      <div>
        <h2>TestChild2</h2>
        <Button onClick={this.handleAddA}>TestChild2AddA</Button>
        <div>TestChild2-a-value: {a}</div>
        <Button onClick={this.handleAddB}>TestChild2AddB</Button>
        {
          b.map(e => <List obj={e.obj} key={e.obj} />)
        }
      </div>
    )
  }
}

interface IListProps { obj: number }
interface IListState { obj1: number }

class List extends Component<IListProps, IListState> {

  state = {
    obj1: 1,
  }

  shouldComponentUpdate(nextProps: IListProps, nextState: IListState) {
    if (nextProps.obj === this.props.obj) {
      return false;
    }
    if (nextState.obj1 === this.state.obj1) {
      return false;
    }
    return true
  }

  render() {
    console.log('list render')
    return (
      <div>
        <div>obj: {this.props.obj}</div>
        <Button onClick={() => this.setState({ obj1: 1 })}>obj1Btn</Button>
        <div>obj1: {this.state.obj1}</div>
      </div>
    )
  }
}
