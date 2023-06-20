import React, { ReactNode } from "react";
import { useEffect, useState } from "react";
import "./index.scss";

interface IProps {
  className?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  checkedBg?: string;
  uncheckedBg?: string;
  checkedCircleBg?: string;
  uncheckedCircleBg?: string;
  checkCircle?: ReactNode;
  uncheckedCircle?: ReactNode;
  size?: {
    width?: number;
    height?: number;
  }
}

function CSwitch(props: IProps) {
  const {
    className,
    checked,
    onChange,
    disabled,
    checkedBg = '#4dd865',
    uncheckedBg = '#cccccc',
    checkedCircleBg = '#fff',
    uncheckedCircleBg = '#fff',
    checkCircle,
    uncheckedCircle,
    size,
  } = props;
  const { width = 60, height = 28 } = size || {}
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  function onInputChange(e) {
    if (disabled) return;
    const value = e.target.checked;
    setIsChecked(value);
    onChange?.(value);
  }

  const containerWH = () => {
    let w = width <= 28 ? 28 : width;
    let h = height <= 16 ? 16 : height;
    if (width < height) {
      return { w, h }
    }
    // 高大于宽 强制高度为宽度一半
    h = w / 2;
    return { w, h }
  };
  const { w, h } = containerWH()

  const cw = h - 2
  const ch = h - 2

  return (
    <label className={`c-switch ${disabled ? 'c-switch-disabled' : ''} ${className}`}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onInputChange}
        className="c-switch-checkbox"
      />
      <div
        className={`c-switch-container ${isChecked ? 'c-switch-container-checked' : ''}`}
        style={{
          background: isChecked ? checkedBg : uncheckedBg,
          width: w,
          height: h,
        }}
      >
        <div
          className="c-switch-circle"
          style={{
            background: isChecked ? checkedCircleBg : uncheckedCircleBg,
            width: cw,
            height: ch,
            transform: isChecked ? `translateX(${w - h}px)` : ''
          }}
        >
          {isChecked ? checkCircle : uncheckedCircle}
        </div>
      </div>
    </label>
  );
}

CSwitch.displayName = "CSwitch";

export default CSwitch;
