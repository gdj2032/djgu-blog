import { APPNAME } from '@/constants';
import { isElectron } from '@/electron/constants';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import './index.scss';

import icTopRestore from '@/images/topbar/icon_top_restore.png';
import icTopMax from '@/images/topbar/icon_top_max.png';
import icTopMin from '@/images/topbar/ic_top_min.png';
import icTopClose from '@/images/topbar/icon_top_close.png';
import icLauncher from '@/images/logo.png';

const CustomEventType = 'frameWndEvent';

export enum WinSizeState {
  normal = 0,
  maximize = 1,
  minimize = 2,
  fullscreen = 3,
};

export interface IFramePageProps {
  // 自定义顶部按钮
  customButtons?: Array<{ icon: ReactNode; className?: string; onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void }>;
  customItem?: ReactNode;
  disabled?: boolean;
  icon?: ReactNode; // 顶部最左侧icon
  title?: ReactNode; // title文字
  winName?: string;
  titleAtCenter?: boolean; // 居中
  disableDrag?: boolean;
  hostWindow?: { id: number; window: Window };
  transparent?: boolean; // 透明
  resizable?: boolean; // 控制最大最小化button
  minimizable?: boolean; // 最小化按钮
  closable?: boolean; //如果指定了false， 则同时无法通过快捷键关闭 控制关闭button
  className?: string; // 样式类名
  hideTitleBar?: boolean; // 是否隐藏titleBar
  onBeforeRestore?: (event: CustomEvent) => void; // before窗口还原
  onBeforeMaximize?: (event: CustomEvent) => void; // before窗口最大化
  onBeforeMinimize?: (event: CustomEvent) => void; // before窗口最小化
  onBeforeClose?: (event: CustomEvent) => void; // before 窗口关闭
  children?: ReactNode;
}

export declare type IFramePageState = {
  winSizeState: WinSizeState;
}

export default class PageFrame extends React.Component<IFramePageProps, IFramePageState> {
  static defaultProps = {
    minimizable: true,
    hideTitleBar: !isElectron,
  }
  private _nativeWindowId: number;
  constructor(props: any) {
    super(props);
    this.state = {
      winSizeState: WinSizeState.normal,
    }
    if (isElectron) {
      if (this.props.hostWindow) {
        this._nativeWindowId = this.props.hostWindow.id;
      } else {
        this._nativeWindowId = window.app.getEleWindow().id;
      }
    }
  }
  //获取pageFrame实际所在的窗口的window对象，一般来说就是window， 如果是通过newWinddow创建的，则是另一个窗口的window对象
  public get hostWindow() {
    return this.props.hostWindow ? this.props.hostWindow.window : window;
  }

  public get nativeWindowId() {
    return this._nativeWindowId;
  }
  // 窗口关闭
  public closeWindow() {
    const event = new CustomEvent(CustomEventType, { cancelable: true });

    this.props.onBeforeClose && this.props.onBeforeClose(event);
    if (event.defaultPrevented) {
      return;
    }
    if (this.props.hostWindow) {
      this.props.hostWindow.window.close();
      return;
    }
    if (isElectron) {
      window.app.closeWindow(null, true);
    } else {
      window.opener = null;
      window.open('', '_self').close();
    }
  }

  private onBtnClose = () => {
    this.closeWindow();
  }

  private onNativeWinClosing = (_: any, data: { winId: number }) => {
    if (!this.isClosable()) {
      return;
    }
    if (data && data.winId === this.nativeWindowId) {
      this.closeWindow();
    }
  }

  // 窗口最大
  protected onBtnRestore() {
    const event = new CustomEvent(CustomEventType, { cancelable: true });
    this.props.onBeforeRestore && this.props.onBeforeRestore(event);
    if (event.defaultPrevented) {
      return;
    }
    if (this.state.winSizeState === WinSizeState.fullscreen) {
      window.app.setFullScreen(false, this.nativeWindowId);
    }
    window.app.restoreWindow(this.nativeWindowId);
  }

  private onBtnRestoreBinded = () => {
    this.onBtnRestore();
  }

  // 窗口恢复
  protected onBtnMax() {
    const event = new CustomEvent(CustomEventType, { cancelable: true });
    this.props.onBeforeMaximize && this.props.onBeforeMaximize(event);
    if (event.defaultPrevented) {
      return;
    }
    window.app.maximizeWindow(this.nativeWindowId);
  }
  private onBtnMaxBinded = () => {
    this.onBtnMax();
  }
  // 窗口最小
  protected onBtnMin() {
    const event = new CustomEvent(CustomEventType, { cancelable: true });
    this.props.onBeforeMinimize && this.props.onBeforeMinimize(event);
    if (event.defaultPrevented) {
      return;
    }
    window.app.minimizeWindow(this.nativeWindowId);
  }
  private onBtnMinBinded = () => {
    this.onBtnMin();
  }

  private isClosable() {
    return this.props.closable || (isElectron && !(this.props.closable === false));
  }
  private renderTopBtn(icon: ReactNode, onClick: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void, exClasses?: string[]) {
    return (
      <div className={`${classNames({ disabled: this.props.disabled })} page-frame-title-btn btn ${exClasses ? exClasses.join(' ') : ''}`} onClick={onClick} >
        {icon}
      </div>
    )
  }

  private onCheckWindowSizeState = () => {
    const sizeState = this.getWinSizeState(this.nativeWindowId);
    this.setState({ winSizeState: sizeState })
  }

  private getWinSizeState(winId?: number): WinSizeState {
    const win = window.app.getEleWindow(winId);
    if (!win) {
      throw new Error('window not exist');
    }
    if (win.isFullScreen()) {
      return WinSizeState.fullscreen;
    } else if (win.isMaximized()) {
      return WinSizeState.maximize;
    } else if (win.isMinimized()) {
      return WinSizeState.minimize;
    } else {
      return WinSizeState.normal;
    }
  }
  componentDidMount() {
    if (isElectron) {
      const winId = this.nativeWindowId;
      window.app.addWindowEventListener('maximize', this.onCheckWindowSizeState, winId);
      window.app.addWindowEventListener('minimize', this.onCheckWindowSizeState, winId);
      window.app.addWindowEventListener('unmaximize', this.onCheckWindowSizeState, winId);
      window.app.addWindowEventListener('restore', this.onCheckWindowSizeState, winId);
      window.app.addWindowEventListener('enter-full-screen', this.onCheckWindowSizeState, winId);
      window.app.addWindowEventListener('enter-html-full-screen', this.onCheckWindowSizeState, winId);
      window.app.addWindowEventListener('leave-full-screen', this.onCheckWindowSizeState, winId);
      window.app.addWindowEventListener('leave-html-full-screen', this.onCheckWindowSizeState, winId);
      window.app.registerMessageListener('closingWindow', this.onNativeWinClosing);
      const windname = this.props.winName ? this.props.winName : (typeof this.props.title === 'string' ? this.props.title : APPNAME);
      window.app.setWindowFeature({ title: windname }, this.nativeWindowId);
    }
  }
  componentWillUnmount() {
    if (isElectron) {
      const winId = this.nativeWindowId;
      window.app.removeWindowEventListener('maximize', this.onCheckWindowSizeState, winId);
      window.app.removeWindowEventListener('minimize', this.onCheckWindowSizeState, winId);
      window.app.removeWindowEventListener('unmaximize', this.onCheckWindowSizeState, winId);
      window.app.removeWindowEventListener('restore', this.onCheckWindowSizeState, winId);
      window.app.removeWindowEventListener('enter-full-screen', this.onCheckWindowSizeState, winId);
      window.app.removeWindowEventListener('enter-html-full-screen', this.onCheckWindowSizeState, winId);
      window.app.removeWindowEventListener('leave-full-screen', this.onCheckWindowSizeState, winId);
      window.app.removeWindowEventListener('leave-html-full-screen', this.onCheckWindowSizeState, winId);
      window.app.unregisterMessageListener('closingWindow', this.onNativeWinClosing);
    }
  }

  render() {
    const icon = this.props.icon === undefined ? <img className="default-app-icon" src={icLauncher} /> : this.props.icon;
    const resizable = isElectron && (this.props.resizable === true || this.props.resizable === undefined); //明确指定了true或者election下未指定才显示
    const minimizable = isElectron && this.props.minimizable; //明确指定了true才不显示
    const closable = this.isClosable();
    return (
      <div className={`page-frame ${isElectron && 'page-frame-ele'} ${this.props.className || ''}`} onClick={(e) => e.stopPropagation()}>
        {!this.props.hideTitleBar && (
          <div className={`page-frame-header ${this.props.transparent ? 'transparent' : ''}`}>
            <div className="page-frame-title-wrap">
              {icon && <div className="page-frame-icon">{icon}</div>}
              {this.props.title && <div className={`page-frame-title ${this.props.titleAtCenter ? 'center-title' : ''}`}>{this.props.title}</div>}
            </div>
            <div className="page-frame-flex-area" />
            {/* {this.props.customItem && <div className="page-frame-custom">{this.props.customItem}</div>} */}
            {this.props.customButtons && this.props.customButtons.map(config => { return this.renderTopBtn(config.icon, (e) => { config.onClick(e) }); })}
            {minimizable && this.renderTopBtn(<img src={icTopMin} alt="" />, this.onBtnMinBinded)}
            {resizable && this.state.winSizeState !== WinSizeState.normal && this.renderTopBtn(<img src={icTopRestore} alt="" />, this.onBtnRestoreBinded)}
            {resizable && this.state.winSizeState === WinSizeState.normal && this.renderTopBtn(<img src={icTopMax} alt="" />, this.onBtnMaxBinded)}
            {closable && this.renderTopBtn(<img src={icTopClose} alt="" />, this.onBtnClose, ['close'])}
          </div>
        )}
        <div className="page-frame-content">{this.props.children}</div>
      </div>
    );
  }

}
