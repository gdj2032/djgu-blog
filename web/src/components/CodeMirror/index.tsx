/**
 * 代码编辑器
 */
import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import CodeMirrorItem, { ReactCodeMirrorProps, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { material } from '@uiw/codemirror-theme-material'
import { javascript } from '@codemirror/lang-javascript'

interface IProps {
  id?: string;
  value?: string;
  readOnly?: boolean;
  onChange?: (v: string) => void;
  codeProps?: ReactCodeMirrorProps
}

function CodeMirror(props: IProps) {
  const { id = 'codeMirrorId', value: propsValue, readOnly, onChange, codeProps } = props;
  const mirrorRef = useRef<ReactCodeMirrorRef>();
  const [value, setValue] = useState(propsValue)

  useEffect(() => {
    if (propsValue !== value) {
      setValue(propsValue)
    }
  }, [propsValue])

  const handleChange = (v) => {
    setValue(v)
    onChange?.(v)
  }

  return (
    <CodeMirrorItem
      value={value}
      theme={material}
      readOnly={readOnly}
      onChange={handleChange}
      extensions={[javascript()]}
      id={id}
      ref={mirrorRef}
      height='300px'
      {...codeProps}
    />
  )
}

CodeMirror.displayName = 'CodeMirror';

export default CodeMirror;
