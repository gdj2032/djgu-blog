import dayjs from 'dayjs';
import EventEmitter from 'events';
import { EVENT_TYPE } from './event';

//播放速度
export const PLAYER_SPEED_TYPE = {
  one_half: 0.5,
  three_quarters: 0.75,
  one: 1,
  two: 2,
  four: 4,
  eight: 8,
  sixteen: 16,
}

export enum VideoLevel {
  HD = 1,
  VGA = 2,
}

enum ControlSource {
  GLOBAL_BAR = 1, // 全局进度控制条

  DATE_PICKER, // 日期 & 事件选择器

  DATE_BAR, // 日期选择条

  SPEED_CONTROL, // 倍速控制

  CLARITY_CONTROL // 清晰度控制
}

class TimeController extends EventEmitter {
  private _startPlayTime = 0; // 播放开始时间

  private _lastRealTime; // 上一次切换时, 记录的真实时间

  private _freezeTime; // 暂停时间

  private _isPause = false; // 是否暂停

  private _speed = 1; // 倍数播放 默认1倍数

  public EVENT_TYPE = EVENT_TYPE;

  public CONTROL_SOURCE = ControlSource;

  public _clarity = VideoLevel.VGA;

  constructor() {
    super();

    // 默认为实时播放模式
    this._lastRealTime = this.getCurrentTimestamp();
  }

  /**
   * 初始化所有状态
   */
  reset = () => {
    this.changeSpeed(PLAYER_SPEED_TYPE.one);
    this.changeClarity(VideoLevel.VGA);
    this.changePlaybackTime(0)
  }

  /**
   * 获取当前时间戳
   */
  private getCurrentTimestamp = () => {
    return dayjs().unix()
  }

  /**
   * 时间戳毫秒置为000
   * @param timestamp
   */
  private zeroMillisecond = (timestamp) => {
    return dayjs(timestamp).valueOf();
  }

  /**
   * 暂停播放进度
   */
  public pause = () => {
    if (this._isPause) {
      return;
    }

    this._freezeTime = this.getCurrentTimestamp();
    this._isPause = true;

    this.emit(
      EVENT_TYPE.PLAYBACK_TIME_CHANGE,
      this.getChangeStatus(false, false, false, true)
    );
  }

  /**
   * 恢复播放进度
   */
  public resume = () => {
    if (!this._isPause) {
      return;
    }

    const now = this.getCurrentTimestamp();
    // 获取暂停前已播放的毫秒数
    const milliseconds = this._freezeTime - this._lastRealTime
    if (!this.isRealTime()) {
      // 如果暂停之前为回放模式，将startPlayTime修正
      this._startPlayTime += milliseconds
    }

    this._lastRealTime = now
    this._freezeTime = 0;
    this._isPause = false;
    this.emit(
      EVENT_TYPE.PLAYBACK_TIME_CHANGE,
      this.getChangeStatus(true, false, false, true)
    );
  }

  /**
   * 当前播放是否暂停
   */
  public isPause = () => {
    return this._isPause;
  }

  /**
   * 切换当前播放进度
   * @param time 毫秒级时间戳 (PS: 如果传入0则表示切换为实时播放)
   * @param source 调用来源
   */
  public changePlaybackTime = (timestamp: number, source?: ControlSource) => {
    const now = this.getCurrentTimestamp();
    timestamp = this.zeroMillisecond(timestamp);

    if (!timestamp || timestamp === now) {
      this._startPlayTime = 0;
    } else if (dayjs().isAfter(timestamp)) {
      //如果timestamp是未来时间
      this._startPlayTime = 0;
    } else {
      this._startPlayTime = timestamp;
    }

    this._lastRealTime = now;

    if (this._isPause) {
      this._freezeTime = now;
    }

    this.emit(
      EVENT_TYPE.PLAYBACK_TIME_CHANGE,
      this.getChangeStatus(true),
      source
    );
  }

  /**
   * 修改播放倍数
   * @param speed
   */
  public changeSpeed = (speed) => {
    if (this.isRealTime()) {
      // 实时模式不支持倍速播放
      return;
    }

    this._startPlayTime = this.getCurrentPlaybackTime();
    this._lastRealTime = this.getCurrentTimestamp();

    if (this.isPause()) {
      this._freezeTime = this._lastRealTime;
    }

    this._speed = speed;

    this.emit(
      EVENT_TYPE.PLAYBACK_TIME_CHANGE,
      this.getChangeStatus(true, true),
      ControlSource.SPEED_CONTROL
    );
  }

  /**
   * 修改清晰度
   * @param clarity
   */
  public changeClarity = (clarity) => {
    if (this._clarity === clarity) {
      return;
    }

    this._clarity = clarity

    this.emit(
      EVENT_TYPE.PLAYBACK_TIME_CHANGE,
      this.getChangeStatus(false, false, true),
      ControlSource.CLARITY_CONTROL
    )
  }

  /**
   * 获取当前播放时间戳
   */
  public getCurrentPlaybackTime = () => {
    const now = this.getCurrentTimestamp();
    const currentRealTime = this._isPause ? this._freezeTime : now;
    if (this.isRealTime()) {
      return currentRealTime;
    }

    const millisecond = currentRealTime - this._lastRealTime;
    let playbackTime = this._startPlayTime + millisecond * this._speed;

    // 算出的时间如果大于当前时间，则将倍速重置，切换回实时模式
    if (this._speed !== 1 && playbackTime >= now) {
      this._speed = 1;
      this._startPlayTime = 0;
      playbackTime = now;

      this.emit(
        EVENT_TYPE.PLAYBACK_TIME_CHANGE,
        this.getChangeStatus(true, true, false)
      );
    }

    return playbackTime;
  }

  /**
   * 判断是否为实时播放模式
   * @returns
   */
  public isRealTime = () => {
    return this._startPlayTime === 0;
  }

  /**
   * 获取播放倍速
   */
  public getSpeed = () => this._speed;

  /**
   * 获取视频清晰度
   */
  public getClarity = () => this._clarity;

  /**
   * 生成change对象
   * @param timeChange 时间修改
   * @param speedChange 倍率修改
   * @param clarityChange 清晰度修改
   * @param playStatusChange 播放状态修改
   * @returns
   */
  public getChangeStatus = (
    timeChange = false,
    speedChange = false,
    clarityChange = false,
    playStatusChange = false) => {
    return {
      timeChange,
      speedChange,
      clarityChange,
      playStatusChange
    }
  }
}

const timeController = new TimeController();

export { EVENT_TYPE }

export default timeController;
