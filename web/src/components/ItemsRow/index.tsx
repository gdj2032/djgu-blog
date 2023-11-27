import * as React from 'react';
import Button, { ButtonType, ButtonProps } from 'antd/lib/button';
import { getClassName } from '../util';
import './index.scss'

/**
 * 默认配置按钮，也可以通过render() 渲染其他组件
 */
export interface IRowItem {
  /**
   * 按钮名称
   */
  label?: string;
  /**
   * 按钮类型
   */
  type?: ButtonType;
  /**
   * 如果没有指定Render，则是按钮的onClick
   */
  onClick?: (e: any) => void;
  /**
   * 其他按钮属性
   */
  btnProps?: ButtonProps;
  /**
   * item 的className
   */
  className?: string;

  /**
   * 自定义渲染
   */
  render?: () => React.ReactNode;
}
export interface IItemRowProps {
  route?: Array<{ name: string; url?: string }>;
  items?: IRowItem[];
  style?: React.CSSProperties;
  className?: string;
  offsetTop?: number;
}

const classname = (n: string = '') => {
  const cn = 'items-row'
  return getClassName(cn, n);
};

export default class ItemRow extends React.Component<IItemRowProps, any> {

  render() {
    if (!this.props.items) {
      return null;
    }
    return (
      <div className={`${classname()} ${this.props.className || ''}`} style={this.props.style}>
        {
          (this.props.items || []).map((item, index) => {
            const className = `${classname('item')} ${item.className}`;
            if (item.render) {
              return <span key={index} className={className}>{item.render()}</span>
            }
            return <Button key={item.label} className={className} {...item.btnProps} type={item.type || 'primary'} onClick={item.onClick}>{item.label}</Button>;
          })
        }
      </div>
    );
  }
}
