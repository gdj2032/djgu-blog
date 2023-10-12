/**
 * 时间刻度组件
 */
import React, { useEffect, useRef } from 'react';
import TimeScale from './scale';
import './index.scss';

const CanvasId = 'time-scale-view'

const TimeScaleView = () => {
  const timeScale = useRef<TimeScale>(null);
  useEffect(() => {
    timeScale.current = new TimeScale({
      container: CanvasId
    });
  }, [])

  return (
    <div
      className="m-time-scale-view"
    >
      <canvas id={CanvasId} />
    </div>
  )
}

export default TimeScaleView;
