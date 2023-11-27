import _ from 'lodash'
import { message } from 'antd';
import { inertiaState, InertiaEvent } from './inertia'
import { ScaleMode, ITimeScaleConfig, IScaleTimeMode } from './interface'
import { formatTime, getElementLeft, getElementTop } from './utils'
import * as BarUtil from './BarUtil'
import timeController from './timeController'
import timePopover from './popover';
import styleConfig from './style'
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@/constants';

const { eventBus, EVENT_TYPE } = BarUtil;
const MIN_SCROLL_OFFSET = 10;

export default class TimeScale {
  _id: string;

  _canvas: HTMLCanvasElement;

  _ctx: CanvasRenderingContext2D;

  _canvasSize = [];

  minScaleMap = { // 不同刻度模式，最效刻度对应的秒数
    [ScaleMode.HOUR]: 360, // 6 * 60
    [ScaleMode.HALF_HOUR]: 180, // 3 * 60
    [ScaleMode.TEN_MINUTES]: 60, // 1 * 60
    [ScaleMode.ONE_MINUTES]: 6 // 6
  };

  // 缩放时的刻度变化列表
  scaleModeList = [ScaleMode.HOUR, ScaleMode.HALF_HOUR, ScaleMode.TEN_MINUTES, ScaleMode.ONE_MINUTES];

  scaleMode = ScaleMode.HOUR; // 刻度模式，默认小时

  minScale = 360; // 最小刻度

  _scrollLeft = 0; // 左侧偏移距离

  _tmpScrollLeft = 0;

  _duration = 86400; // 刻度总长度24 * 60 * 60

  _maxLength = 0; // 刻度区域总长度

  _mouseOriginX = 0; // 点击初始x坐标

  _isDrag = false; // 是否正在拖拽

  _isMouseDown = false; // 鼠标是否按下

  _ratio = 1;

  _playableSeconds = 0; // 可播放的秒数

  _currentPlayingSeconds = 0; // 当前正在播放的秒数

  _playbackTime = 0; // 当前播放的时间戳

  _timeInterval;

  _mode: IScaleTimeMode = IScaleTimeMode.REAL_TIME; // 刻度模式

  constructor(cfg: ITimeScaleConfig) {
    const { container } = cfg

    this._id = container;
    this._canvas = document.getElementById(container) as HTMLCanvasElement;
    this._ctx = this._canvas.getContext('2d');

    // 兼容不同像素比
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = (this._ctx as any).webkitBackingStorePixelRatio || 1;
    this._ratio = devicePixelRatio / backingStoreRatio;

    // 设置初始位置
    this._playableSeconds = this.getSeconds(dayjs())
    this._currentPlayingSeconds = this._playableSeconds;
    this.seek(this._currentPlayingSeconds);

    this.render();
    this.initEvent();
    this.startTimer();
  }

  render() {
    // 画布宽高调整
    let resizeFlag = false;
    const parent = this._canvas.parentElement;
    if (this._canvas.style.width !== `${parent.offsetWidth}px`) {
      const width = parent.offsetWidth;
      this._canvas.style.width = width + 'px';
      this._canvas.width = width * this._ratio;
      this._canvasSize[0] = width
      resizeFlag = true;
    }

    if (this._canvas.style.height !== `${parent.offsetHeight}px`) {
      const height = parent.offsetHeight;
      this._canvas.style.height = height + 'px';
      this._canvas.height = height * this._ratio;
      this._canvasSize[1] = height;
      resizeFlag = true;
    }

    if (resizeFlag) {
      this._ctx.scale(this._ratio, this._ratio);
    }

    // 清空画布
    this._ctx.clearRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());

    // scale边框
    this._ctx.strokeStyle = styleConfig.BORDER_COLOR;
    this._ctx.strokeRect(0, 0, this.getCanvasWidth(), styleConfig.SCALE_HEIGHT);

    // 播放进度
    this.renderProgress();

    // 刻度
    this.renderTicks();
  }

  update = () => {
    window.requestAnimationFrame(() => {
      this.render();
    });
  }

  initEvent() {
    this._canvas.addEventListener('mousedown', (e) => {
      this.onMouseDown(e)

      const moveHandle = this.onMouseMove.bind(this);
      const upHandle = (ev) => {
        this.onMouseUp(ev);
        window.removeEventListener('mouseup', upHandle);
        window.removeEventListener('mousemove', moveHandle);
      }

      window.addEventListener('mousemove', moveHandle);
      window.addEventListener('mouseup', upHandle);
    });

    const wheelHandle = _.throttle(this.onMouseWheel.bind(this), 500);
    this._canvas.parentElement.addEventListener('mousewheel', wheelHandle, false);

    const mouseMoveHandle = (lev) => {
      this.onHover(lev);
    }
    this._canvas.addEventListener('mousemove', mouseMoveHandle);

    this._canvas.addEventListener('mouseleave', () => {
      this.onMouseLeave();
    })

    eventBus.on(EVENT_TYPE.START_DRAG, (_res, barId) => {
      if (barId !== this._id) {
        this._tmpScrollLeft = this._scrollLeft;
      }
    })

    eventBus.on(EVENT_TYPE.SCROLL, (ev) => {
      this.updateScrollLeft(ev);
    })

    eventBus.on(EVENT_TYPE.AI_BAR_CLICK, (ev) => {
      this.onMouseUp(ev);
    })

    // 时间总控监听
    timeController.on(timeController.EVENT_TYPE.PLAYBACK_TIME_CHANGE, (changes, source) => {
      if (!changes.timeChange) {
        return;
      }

      // 时间控制器修改时间，则重新seek位置
      this.step(source === timeController.CONTROL_SOURCE.DATE_PICKER);
    })
  }

  step = (seekFlag?: boolean) => {
    const isRealTime = timeController.isRealTime();
    const playBackTime = timeController.getCurrentPlaybackTime();

    // 保存当前播放时间戳
    if (this._playbackTime &&
      (dayjs(this._playbackTime).format('YYYY-MM-DD') !== dayjs(playBackTime).format('YYYY-MM-DD'))) {
      this._playbackTime = playBackTime;

      // 播放步进时，跨天重新seek
      if (typeof seekFlag !== 'boolean') {
        seekFlag = true;
      }
    }

    if (!this._playbackTime) {
      this._playbackTime = playBackTime;
    }

    // 根据是否为实时播放，计算当前可播放区域
    if (isRealTime || this.inTheDay(playBackTime)) {
      this._playableSeconds = this.getSeconds(dayjs());
    } else {
      this._playableSeconds = this._duration;
    }

    this._currentPlayingSeconds = this.getSeconds(dayjs(playBackTime));

    if (seekFlag) {
      this.seek(this._currentPlayingSeconds);
    }

    this.dispatch(EVENT_TYPE.STEP, {
      seconds: this._currentPlayingSeconds,
      seekFlag,
    });

    this.update();
  }

  /**
   * 时间步进
   */
  startTimer = () => {
    this._timeInterval = setInterval(() => {
      this.step();
    }, 500);
  }

  /**
   * 绘制可播放 + 当前播放进度
   */
  renderProgress = () => {
    const playableRect = this.getSecondsRect(this._playableSeconds);
    if (!playableRect) {
      return;
    }

    // 可播放进度
    this._ctx.fillStyle = styleConfig.PLAYABLE_BACKGROUND_COLOR;
    this._ctx.fillRect(playableRect.x, playableRect.y, playableRect.width, playableRect.height);

    // 正在播放进度
    const currentPlayRect = this.getSecondsRect(this._currentPlayingSeconds);
    if (currentPlayRect) {
      this._ctx.fillStyle = styleConfig.PLAYED_BACKGROUND_COLOR;
      this._ctx.fillRect(currentPlayRect.x, currentPlayRect.y, currentPlayRect.width, currentPlayRect.height);

      // 当前播放时间绘制一条线
      this._ctx.beginPath();
      this._ctx.moveTo(currentPlayRect.x + currentPlayRect.width, 0);
      this._ctx.lineTo(currentPlayRect.x + currentPlayRect.width, styleConfig.SCALE_HEIGHT);
      this._ctx.strokeStyle = styleConfig.CURRENT_TICK_COLOR;
      this._ctx.stroke();
    }
  }

  /**
   * 绘制刻度 + 文字
   */
  renderTicks = () => {
    const canvasWidth = this.getCanvasWidth();
    // 设置字体样式
    this._ctx.textAlign = 'center';
    this._ctx.textBaseline = 'middle';
    this._ctx.font = '12px sans-serif'
    this._ctx.fillStyle = styleConfig.TICK_LABEL_COLOR;

    // 绘制刻度线 & 文案
    this._ctx.beginPath();
    let startX = canvasWidth / 2;
    for (let t = 0, j = 0; t <= this._duration; t += this.minScale, j++) {
      const offsetX = startX - Math.abs(this._scrollLeft);
      if (offsetX <= 0) {
        startX += styleConfig.TICK_INTERVAL;
        continue
      }

      if (offsetX >= canvasWidth) {
        break
      }

      let lineHeight = styleConfig.SHORT_TICK_HEIGHT;
      if (j % 10 === 0) {
        lineHeight = styleConfig.LONG_TICK_HEIGHT;

        // 时间刻度文案
        const text = formatTime(t);
        this._ctx.fillText(text, offsetX, styleConfig.SCALE_HEIGHT - lineHeight - 8)
      }

      this._ctx.moveTo(offsetX, styleConfig.SCALE_HEIGHT);
      this._ctx.lineTo(offsetX, styleConfig.SCALE_HEIGHT - lineHeight);
      startX += styleConfig.TICK_INTERVAL;
    }

    // 移除最后一次额外添加的TICK_INTERVAL
    startX -= styleConfig.TICK_INTERVAL;

    // 记录刻度区域总长度
    this._maxLength = startX + canvasWidth / 2;
    this._ctx.strokeStyle = styleConfig.TICK_COLOR;
    this._ctx.stroke();
  }

  onMouseDown = (e) => {
    const { clientX, clientY } = e
    this._isDrag = false;
    this._isMouseDown = true;
    this._mouseOriginX = clientX;
    this._tmpScrollLeft = this._scrollLeft;

    this.dispatch(EVENT_TYPE.START_DRAG, null);

    inertiaState.start([clientX, clientY]);
  }

  onMouseMove = (e) => {
    if (!this._isMouseDown) {
      return;
    }
    const { clientX, clientY } = e;
    // 判断最小距离，修复点击时不小心触发的拖动
    if (!this._isDrag && Math.abs(clientX - this._mouseOriginX) < MIN_SCROLL_OFFSET) {
      return;
    }

    this._isDrag = true;
    this.dispatch(EVENT_TYPE.DRAGING);
    inertiaState.update([clientX, clientY]);
  }

  openFutureTimeMessage = (top, left) => {
    const toast = document.getElementsByClassName('scale-toast')
    if (toast && toast.length) {
      return
    }
    message.open({
      content: '无法选择未来的时间',
      type: 'info',
      duration: 2,
      key: 'scale-toast',
      className: 'scale-toast',
      style: {
        top,
        left,
      }
    })
  }

  onMouseUp = (e) => {
    if (!this._isDrag) {
      // 单击
      const seconds = this.translateOffsetToSeconds(e.offsetX);
      if (seconds < 0) {
        return;
      }

      if (seconds > this._playableSeconds) {
        const top = this._canvas.offsetTop;
        const left = getElementLeft(this._canvas) + this.getCanvasWidth() / 2 - 87;
        this.openFutureTimeMessage(top, left);
        return;
      }

      this._currentPlayingSeconds = seconds;

      const hms = this.getHMS(seconds)
      // const newPlaybackTime = dayjs(timeController.getCurrentPlaybackTime()).hours(hms.hour).minutes(hms.minutes).seconds(hms.seconds).valueOf()
      const newPlaybackTime = dayjs(`${dayjs(timeController.getCurrentPlaybackTime()).format(DATE_FORMAT.YMD)} ${this.addZero(hms.hour)}:${this.addZero(hms.minutes)}:${this.addZero(hms.seconds)}`).valueOf()
      timeController.changePlaybackTime(newPlaybackTime, timeController.CONTROL_SOURCE.GLOBAL_BAR);

      this.dispatch(EVENT_TYPE.CONTOLER_CLICK, this._currentPlayingSeconds);
      this.update();
    }

    this._isMouseDown = false;
    inertiaState.stop();
  }

  updateScrollLeft(ev: InertiaEvent) {
    // 当惯性停止之后，才算结束
    if (!ev) {
      this._isDrag = false
      return;
    }

    const { movement } = ev;
    const currentScrollLeft = movement[0]
    const canvasWidth = this.getCanvasWidth();

    // 往右滚动
    if (currentScrollLeft > 0) {
      if (this._scrollLeft >= 0) {
        this._scrollLeft = 0
      } else {
        this._scrollLeft = this._tmpScrollLeft + currentScrollLeft;
      }
    }

    // 往左滚动
    if (currentScrollLeft < 0) {
      if (Math.abs(this._scrollLeft) >= (this._maxLength - canvasWidth)) {
        this._scrollLeft = -(this._maxLength - canvasWidth);
      } else {
        this._scrollLeft = this._tmpScrollLeft + currentScrollLeft;
      }
    }

    this.update();
  }

  onMouseWheel = (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    if (this._isDrag || this._isMouseDown) {
      return false;
    }

    const delta = e.delta || e.wheelDelta
    let currentIndex = this.scaleModeList.findIndex((m) => m === this.scaleMode);
    let tmpIndex = currentIndex;
    if (delta > 0) {
      // 向上滚动
      currentIndex = Math.min(++tmpIndex, this.scaleModeList.length - 1);
    } else {
      // 向下滚动
      currentIndex = Math.max(0, --tmpIndex);
    }

    if (this.scaleModeList[currentIndex] !== this.scaleMode) {
      // 获取当前中点刻度的描述，重新计算scrollLeft
      const seconds = this.translateOffsetToSeconds(this.getCanvasWidth() / 2)
      this.scaleMode = this.scaleModeList[currentIndex];
      this.minScale = this.minScaleMap[this.scaleMode];

      this.dispatch(EVENT_TYPE.ZOOM, {
        middle: seconds,
        scaleMode: this.scaleMode,
        minScale: this.minScale
      })

      this.seek(seconds)
      this.update();
    }

    return false;
  }

  onHover = (ev) => {
    if (this._isDrag) {
      timePopover.hide();
      return;
    }

    const { clientX, offsetX } = ev

    const seconds = this.translateOffsetToSeconds(offsetX);
    timePopover.show({
      content: `${dayjs(this._playbackTime).format('YYYY-MM-DD')} ${formatTime(seconds, true)}`,
      x: clientX,
      y: getElementTop(this._canvas)
    })
  }

  onMouseLeave = () => {
    timePopover.hide();
  }

  /**
   * 刻度定位，将当前时刻居中展示
   * @param seconds 24小时制下的秒数
   */
  seek = (seconds) => {
    const canvasWidth = this.getCanvasWidth();
    // 初始偏移量
    const offset = -canvasWidth / 2;
    // 可视区域中点
    const middle = canvasWidth / 2;

    const secondsWidth = this.getSecondsWidth(seconds);

    this._scrollLeft = offset + middle - secondsWidth
  }

  /**
   * 获取秒数对应进度条的长度
   * @param seconds
   */
  getSecondsWidth = (seconds) => {
    const tickCount = seconds / this.minScale;
    return tickCount * styleConfig.TICK_INTERVAL;
  }

  /**
   * 读取对象的秒数
   * @param m
   * @returns
   */
  getSeconds = (m: dayjs.Dayjs) => {
    return dayjs(m).second()
  }

  /**
   * 获取已播放区域在当前可是区域中的宽度
   * @returns
   */
  getSecondsRect = (seconds) => {
    const canvasWidth = this.getCanvasWidth();
    const secondsWidth = this.getSecondsWidth(seconds);
    const leftWidth = this._scrollLeft + (canvasWidth / 2 + secondsWidth)

    if (leftWidth <= 0) {
      return null
    }

    let start = 0;
    if (this._scrollLeft > (-canvasWidth / 2)) {
      start = canvasWidth / 2 + this._scrollLeft
    }

    const width = (leftWidth > canvasWidth ? canvasWidth : leftWidth) - start

    return {
      x: start,
      y: 0,
      width: width,
      height: styleConfig.SCALE_HEIGHT
    }
  }

  /**
   * 获取当前可视区偏移值下的秒数
   */
  translateOffsetToSeconds = (offset) => {
    offset = offset - this._scrollLeft - this.getCanvasWidth() / 2

    return (offset * this.minScale) / styleConfig.TICK_INTERVAL;
  }

  getCanvasWidth = () => {
    return this._canvasSize[0] || 0
  }

  getCanvasHeight = () => {
    return this._canvasSize[1] || 0
  }

  dispatch = (event, data?: any) => {
    eventBus.emit(event, data, this._id);
  }

  getHMS = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds / 60 % 60));
    const s = Math.floor((seconds % 60));

    return {
      hour: h,
      minutes: m,
      seconds: s
    }
  }

  addZero = (val: number) => {
    return val > 9 ? val : `0${val}`
  }

  /**
   * 判断该时间是否在当天
   * @param milliseconds
   * @returns
   */
  inTheDay = (milliseconds) => {
    const m = dayjs(milliseconds);
    return m.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
  }
}
