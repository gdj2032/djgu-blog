/**
 * quill 富文本编辑器
 * npm i quill 1.3.7
 * npm i --save @types/quill@2.0.14
 * npm i highlight.js --save
 */
import React, { useEffect, useState } from 'react';
import './index.scss';
import Quill from 'quill'
import { renderToString } from 'react-dom/server'
import previewIcon from '@/images/quill/preview.png';
import QuillPreview from './QuillPreview';
import hljs from 'highlight.js'

interface IProps {
  /**
   * id
   *
   * @memberof IProps
   */
  container?: string;
  /**
   * html格式
   *
   * @memberof IProps
   */
  value?: string;
  style?: React.CSSProperties;
  quillStyle?: React.CSSProperties;
  className?: string;
  /**
   * 只读
   *
   * @memberof IProps
   */
  readOnly?: boolean;
  placeholder?: string;
  /**
   * 代码高亮
   *
   * @memberof IProps
   */
  syntax?: boolean;
  /**
   * 是否显示工具栏 toolbar
   *
   * @memberof IProps
   */
  showToolbar?: boolean
  /**
   * 额外toolbar自定义按钮
   * showToolbar = true 有效
   *
   * @memberof IProps
   */
  extensionToolbar?: {
    id: string;
    click: () => void;
    children: React.JSX.Element;
  }[]
  /**
   * 自定义文件上传(选中文件后的操作)
   *
   * @memberof IProps
   */
  onChange?: (e) => void;
  quillRef?: (quill: Quill) => void
  onUpload?: (e) => { name: string; url: string };
  /**
   * 自定义点击上传图片功能
   *
   * @memberof IProps
   */
  onImage?: () => void
  /**
   * 自定义点击上传视频功能
   *
   * @memberof IProps
   */
  onVideo?: () => void
  /**
   * 自定义预览功能
   *
   * @memberof IProps
   */
  onPreview?: (html: string) => void
}

function QuillEditor(props: IProps) {
  const {
    value,
    container = 'quillId',
    style,
    quillStyle,
    className,
    readOnly,
    placeholder,
    syntax = true,
    showToolbar,
    extensionToolbar,
    onChange,
    quillRef,
    onImage,
    onVideo,
    onPreview,
  } = props;
  const [quillEditor, setQuillEditor] = useState<Quill>()
  const [content, setContent] = useState(value)
  const [previewAble, setPreviewAble] = useState(false)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (value !== content) {
      setContent(value)
    }
  }, [value])

  useEffect(() => {
    if (getValue() !== content) {
      setValue(content)
    }
  }, [content])

  const handleFile = () => {
    return new Promise<FileList>((resolve) => {
      const input = document.createElement('input');
      input.type = 'file'
      input.onchange = () => {
        resolve(input.files)
      }
      input.click()
    })
  }

  const handleImage = () => {
    if (onImage) {
      onImage()
    } else {
      handleFile()
    }
  }

  const handleVideo = () => {
    if (onVideo) {
      onVideo()
    } else {

    }
  }

  const handlePreview = () => {
    if (onPreview) {
      onPreview(content)
    } else {
      setPreviewAble((prev) => !prev)
    }
  }

  const getValue = () => {
    return quillEditor?.root.innerHTML
  }

  const setValue = (val) => {
    quillEditor?.clipboard.dangerouslyPasteHTML(0, val)
  }

  const init = () => {
    hljs.configure({   // optionally configure hljs
      languages: ['javascript', 'java', 'react', 'vue']
    });

    const toolbarOpt = {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
        ['blockquote', 'code-block'], // 引用，代码块
        [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
        [{ list: 'ordered' }, { list: 'bullet' }], // 列表
        [{ script: 'sub' }, { script: 'super' }], // 上下标
        [{ indent: '-1' }, { indent: '+1' }], // 缩进
        [{ direction: 'rtl' }], // 文本方向
        [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
        [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
        [{ font: [] }], // 字体
        [{ align: [] }], // 对齐方式
        ['clean'], // 清除字体样式
        ['link', 'image', 'video'], // 链接 图片 视频
        ['preview'], // 自定义按钮
      ],
      handlers: {
        preview: handlePreview
      }
    }

    if (extensionToolbar?.length) {
      toolbarOpt.container.push(extensionToolbar.map(e => {
        toolbarOpt.handlers[e.id] = e.click;
        return e.id
      }))
    }

    const syntaxOpt = {
      highlight: text => hljs.highlightAuto(text).value
    }

    const quill = new Quill(`#${container}`, {
      theme: 'snow',
      readOnly,
      placeholder,
      modules: {
        syntax: syntax ? syntaxOpt : false,
        toolbar: showToolbar ? toolbarOpt : false
      }
    });
    setQuillEditor(quill)
    quillRef?.(quill)
    quill?.clipboard.dangerouslyPasteHTML(0, content)
    if (showToolbar) {
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', handleImage);
      toolbar.addHandler('video', handleVideo);

      const btn = (
        <img src={previewIcon} className="ql-preview-icon" />
      )

      // 自定义预览按钮
      const sourceEditorButton = document.querySelector('.ql-preview');
      sourceEditorButton.innerHTML = renderToString(btn);

      if (extensionToolbar?.length) {
        for (const item of extensionToolbar) {
          const extraBtn = document.querySelector(`.ql-${item.id}`);
          if (extraBtn) {
            extraBtn.innerHTML = renderToString(item.children);
          }
        }
      }
    }

    quill.on('text-change', function (delta1, oldDelta1, source) {
      if (source === 'api') {
        console.info("An API call triggered this change.", delta1);
      } else if (source === 'user') {
        console.info("A user action triggered this change.", delta1);
      }
    });

    quill.on('editor-change', function (eventName, ...args) {
      if (eventName === 'text-change') {
        setContent(quill.root.innerHTML)
        onChange?.(quill.root.innerHTML)
        console.info('--- text change --->', args);
      } else if (eventName === 'selection-change') {
        // args[0] will be old range
        console.info('--- selection change --->', args);
      }
    });

  }

  return (
    <div className={`g-quill-editor ${className}`} style={style}>
      <div className='m-quill-item'>
        <div className='p-quill-editor' id={container} style={quillStyle} ></div>
      </div>
      {
        previewAble && (
          <QuillPreview
            contents={quillEditor.getContents()}
            close={() => setPreviewAble(false)}
            syntax={props.syntax}
          />
        )
      }
    </div>
  )
}

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
