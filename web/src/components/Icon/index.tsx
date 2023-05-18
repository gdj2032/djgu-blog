import * as React from 'react';
import './index.scss';

type TYPE_HOVER_ACTIVE_DISABLED = 'light' | 'dark' | 'blue' | 'bg_blue' | 'disabled' | 'none';

interface ISvgProps {
  name: string;
  className?: string;
  /**
   * icon外圈大小 优先级 divWidth divHeight 存在 divWidth divHeight > divSize
   *
   * @memberof ISvgProps
   */
  divSize?: str_num;
  divWidth?: str_num;
  divHeight?: str_num;
  /**
   * icon hover active 统一类型
   *
   * @memberof ISvgProps
   */
  type?: TYPE_HOVER_ACTIVE_DISABLED;
  restProps?: any;
  onClick?: () => void;
  /**
   * icon大小  优先级 width height 存在 width,height > size
   *
   * @memberof ISvgProps
   */
  size?: str_num;
  /**
   * 实际宽高
   *
   * @memberof ISvgProps
   */
  width?: str_num;
  height?: str_num;
  svgClassName?: string;
  /**
   * 颜色
   *
   * @memberof ISvgProps
   */
  fill?: string;
  /**
   * 边框线颜色
   *
   * @memberof ISvgProps
   */
  stroke?: string;
}

const Icon = ({ name, className = '', divSize = '', divWidth, divHeight, type, size = '16', onClick, width, height, svgClassName, fill, stroke, ...restProps }: ISvgProps) => (
  <div onClick={onClick} className={`u-icon u-icon-${name} u-icon-${divSize || size} ${className} u-icon-type-${type}`} style={{ width: `${divWidth || divSize}px`, height: `${divHeight || divSize}px` }}>
    <svg className={`i-svg-icon ${svgClassName}`} width={width || size} height={height || size} {...restProps} fill={fill} stroke={stroke}>
      <use xlinkHref={`#${name}`} />
    </svg>
  </div>
);

export default Icon;
