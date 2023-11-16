/**
 * 全局加载
 */
import React, { Component } from 'react';
import './index.scss';

interface IProps {
}

type T_TOAST_TYPE = 'none' | 'success' | 'error' | 'warning'

interface IState {
  visible: boolean;
  message?: string;
  type: T_TOAST_TYPE;
}

interface Info {
  message: string;
  /**
   * @default none
   *
   * @memberof Info
   */
  type?: T_TOAST_TYPE
  /**
   * 毫秒 默认3秒
   * @default 3000
   *
   * @memberof Info
   */
  timer?: number;
}

export default class QuillToast extends Component<IProps, IState> {

  static _ref: QuillToast

  static setRef = (r: QuillToast) => {
    QuillToast._ref = r
  }

  static show = (info?: Info) => {
    QuillToast._ref?.show(info)
  }

  static hide = () => {
    QuillToast._ref?.hide()
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      visible: false,
      type: 'none',
      message: '',
    };
  }

  timer;

  private show(info?: Info) {
    this.setState({ visible: true, type: 'none', ...info });

    this.timer = setTimeout(() => {
      this.hide()
    }, info?.timer || 3000);
  }

  private hide() {
    this.setState({ visible: false, message: '', type: 'none' });
  }

  render() {
    const { message, visible, type } = this.state;
    return (
      <div className={`g-quill-toast g-quill-toast-${type}`} style={{ display: visible ? 'flex' : 'none' }}>
        {message}
      </div>
    )
  }
}
