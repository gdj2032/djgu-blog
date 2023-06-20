/**
 * 全局加载
 */
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { Component } from 'react';
import './index.scss';

interface IProps {
}

interface IState {
  visible: boolean;
  tip?: string;
}

interface Info {
  tip?: string;
}

export default class Loading extends Component<IProps, IState> {

  static _ref: Loading

  static setRef = (r: Loading) => {
    Loading._ref = r
  }

  static show = (info?: Info) => {
    Loading._ref?.show(info)
  }

  static hide = () => {
    Loading._ref?.hide()
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  private show(info?: Info) {
    this.setState({ visible: true, ...info });
  }

  private hide() {
    this.setState({ visible: false });
  }

  antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  render() {
    const { tip, visible } = this.state;
    return (
      <div className='g-loading' style={{ display: visible ? 'flex' : 'none' }}>
        <Spin spinning size='large' tip={tip} indicator={this.antIcon} />
      </div>
    )
  }
}
