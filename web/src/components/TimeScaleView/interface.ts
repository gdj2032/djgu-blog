export enum ScaleMode {
  HOUR = 1, // 小时刻度

  HALF_HOUR, // 30分钟刻度

  TEN_MINUTES, // 10分钟刻度

  ONE_MINUTES // 1分钟刻度
}

export interface ITimeScaleConfig {
  container: string;
}

export enum IScaleTimeMode {
  REAL_TIME = 1, // 实时模式

  HISTORY // 回放模式
}
