/**
 * 预览
 */
import Quill from 'quill';
import React, { useEffect } from 'react';
import './index.scss';
import Delta from "quill-delta";
import { CloseOutlined } from '@ant-design/icons';
import hljs from 'highlight.js';

interface IProps {
  contents: Delta;
  close: () => void;
  syntax: boolean;
}

function QuillPreview(props: IProps) {
  const { contents, close, syntax } = props;

  const quillPreviewId = 'quillPreviewId'

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    const quill = new Quill(`#${quillPreviewId}`, {
      theme: 'snow',
      readOnly: true,
      modules: {
        syntax: syntax ? {
          highlight: text => hljs.highlightAuto(text).value
        } : false,
        toolbar: false,
      }
    })
    quill.setContents(contents)
  }
  return (
    <div className='g-quill-preview'>
      <div className='m-quill-preview'>
        <div className='p-preview-title'>预览</div>
        <div className='p-quill-preview' id={quillPreviewId}>
        </div>
        <div className='p-preview-close'>
          <CloseOutlined className='i-close' onClick={close} />
        </div>
      </div>
    </div>
  )
}

QuillPreview.displayName = 'QuillPreview';

export default QuillPreview;
