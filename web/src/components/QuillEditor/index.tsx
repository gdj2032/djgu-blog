/**
 * quill 富文本编辑器
  npm i quill 1.3.7
  npm i --save @types/quill@2.0.14
  npm i highlight.js --save
  npm i quill-image-resize-module
  npm i quill-image-drop-module
 */
import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import Quill, { EditorChangeHandler, TextChangeHandler } from 'quill'
import { renderToString } from 'react-dom/server'
import previewIcon from '@/images/quill/preview.png';
import audioIcon from '@/images/quill/audio.png';
import QuillPreview from './QuillPreview';
import hljs from 'highlight.js'
import ImageResize from 'quill-image-resize-module';
import { ImageDrop } from 'quill-image-drop-module';
import QuillToast from './QuillToast';
import QuillVideo from './QuillVideo';
import QuillAudio from './QuillAudio';
import Delta from "quill-delta";

type T_UPLOAD_FILE = 'image' | 'video' | 'audio';

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
   * 代码高亮 开启 代码过长 加载很耗时间
   * @default false
   *
   * @memberof IProps
   */
  syntax?: boolean;
  /**
   * 允许调整图像大小
   * @default true
   *
   * @memberof IProps
   */
  imageResize?: boolean;
  /**
   * 允许将图像粘贴并拖/放到编辑器中
   * @default true
   *
   * @memberof IProps
   */
  imageDrop?: boolean;
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
   * 单位为 MB
   * 默认50MB
   * @default 50
   *
   * @memberof IProps
   */
  uploadFileSize?: number;
  quillRef?: (quill: Quill) => void
  /**
   * 自定义文件上传(选中文件后的操作)
   *
   * @memberof IProps
   */
  onChange?: (html: string) => void;
  onTextChange?: TextChangeHandler;
  onEditorChange?: EditorChangeHandler
  /**
   * 自定义文件上传
   *
   * @memberof IProps
   */
  onUploadFile?: (files: FileList, type: T_UPLOAD_FILE) => Promise<{ name: string; url: string }[]>;
  /**
   * 自定义点击图片/视频/音频
   *
   * @memberof IProps
   */
  onCustomFile?: (type: T_UPLOAD_FILE) => Promise<{ name: string; url: string }[]>;
  /**
   * 自定义预览功能
   *
   * @memberof IProps
   */
  onPreview?: (html: string) => void
}

Quill.register({ 'formats/video': QuillVideo }, true);
Quill.register({ 'formats/audio': QuillAudio }, true);
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);

function QuillEditor(props: IProps) {
  const {
    value,
    container = 'quillId',
    style,
    quillStyle,
    className,
    readOnly,
    placeholder,
    syntax,
    showToolbar,
    extensionToolbar,
    uploadFileSize = 50,
    onChange,
    onTextChange,
    onEditorChange,
    onUploadFile,
    onCustomFile,
    quillRef,
    onPreview,
  } = props;
  const [quillEditor, setQuillEditor] = useState<Quill>()
  const [content, setContent] = useState(value)
  const [previewAble, setPreviewAble] = useState(false)
  const [audioAble, setAudioAble] = useState(false)
  const audioRef = useRef(false);

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current = false;
      handleFile('audio')
      setAudioAble(false)
    }
  }, [audioAble])

  useEffect(() => {
    if (value !== content) {
      console.info('--- value, content --->', { value, content });
      setContent(value)
    }
  }, [value])

  useEffect(() => {
    if (getValue() !== content) {
      setValue(content)
    }
  }, [content])

  useEffect(() => {
    if (showToolbar && quillEditor) {
      const toolbar = quillEditor.getModule('toolbar');
      toolbar.addHandler('image', () => handleFile('image'));
      toolbar.addHandler('video', () => handleFile('video'));
      // toolbar.addHandler('audio', () => handleFile('audio'));
    }
  }, [quillEditor])

  const blobToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result as string);
      });
      reader.readAsDataURL(blob);
    })
  }

  const handleBeforeUpload = (files) => {
    let allow = true;
    for (const file of files) {
      const isLt = file.size / 1024 / 1024 < uploadFileSize;
      if (!isLt) {
        const err = `上传的文件大小不能超过 ${uploadFileSize} MB!`
        console.error(err)
        QuillToast.show({ message: err, type: 'error' })
        allow = false;
        break;
      }
    }
    return allow;
  }

  const handleSelectFile = (accept: string) => {
    return new Promise<FileList>((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file'
      input.accept = accept
      input.onchange = () => {
        const allow = handleBeforeUpload(input.files)
        if (allow) {
          resolve(input.files)
        } else {
          reject('upload file not allowed')
        }
      }
      input.click()
    })
  }

  const handleFile = async (type: T_UPLOAD_FILE = 'image') => {
    let msg = []
    if (onCustomFile) {
      const res = await onCustomFile(type)
      for (const item of res) {
        msg.push(item.url)
      }
    } else {
      const files = await handleSelectFile(`${type}/*`)
      const res = await onUploadFile?.(files, type)
      for (const item of res) {
        msg.push(item.url)
      }
      if (!res?.length && (type === 'video' || type === 'audio')) {
        console.error(`${type} url is undefined, pls use "onUploadFile" !!!`)
        QuillToast.show({ message: '请使用 `onUploadFile` 上传音视频文件', type: 'error' })
        return;
      }
      if (!msg.length) {
        for (const item of (files as any)) {
          const base64Info = await blobToBase64(item)
          msg.push(base64Info)
        }
      }
    }
    if (msg?.length > 0) {
      for (const m of msg) {
        handleInsertFile(type, m)
      }
    } else {
      console.error(`${type} url is undefined`)
    }
  }

  const handleInsertFile = (type: T_UPLOAD_FILE, url: string) => {
    const len = quillEditor.getSelection()?.index;
    if (type === "audio" || type === 'video') {
      quillEditor.insertEmbed(len, type, { url }, Quill.sources.API);
    } else {
      quillEditor.insertEmbed(len, type, url, Quill.sources.USER);
    }
    quillEditor.setSelection({ index: len + 1, length: len });
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
    if (val !== getValue()) {
      const delta = new Delta()
      quillEditor?.updateContents(delta)
      quillEditor?.clipboard.dangerouslyPasteHTML(val, 'user')
    }
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
        ['link', 'image', 'video', 'audio'], // 链接 图片 视频
        ['preview'], // 自定义按钮
      ],
      handlers: {
        preview: handlePreview,
        audio: () => {
          audioRef.current = true;
          setAudioAble(true)
        }
      },
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
        toolbar: showToolbar ? toolbarOpt : false,
        imageResize: {
          displayStyles: {
            backgroundColor: 'black',
            border: 'none',
            color: 'white'
          },
          modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
        imageDrop: true,
      }
    });
    setQuillEditor(quill)
    quillRef?.(quill)
    quill?.clipboard.dangerouslyPasteHTML(0, content)
    if (showToolbar) {

      // 自定义预览按钮
      const previewBtn = (
        <img src={previewIcon} className="ql-preview-icon" />
      )
      const previewDom = document.querySelector('.ql-preview');
      if (previewDom) {
        previewDom.innerHTML = renderToString(previewBtn);
      }

      // 自定义音频按钮
      const audioBtn = (
        <img src={audioIcon} className="ql-audio-icon" />
      )
      const audioDom = document.querySelector('.ql-audio');
      if (audioDom) {
        audioDom.innerHTML = renderToString(audioBtn);
      }

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
      // if (source === 'api') {
      //   console.info("An API call triggered this change.", delta1);
      // } else if (source === 'user') {
      //   console.info("A user action triggered this change.", delta1);
      // }
      onTextChange?.(delta1, oldDelta1, source);
    });

    quill.on('editor-change', (...arg) => {
      // @ts-ignore
      onEditorChange?.(...arg);
      if (arg[0] === 'text-change') {
        setContent(quill.root.innerHTML)
        onChange?.(quill.root.innerHTML)
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
            contents={getValue()}
            close={() => setPreviewAble(false)}
            syntax={props.syntax}
          />
        )
      }
      <QuillToast ref={c => QuillToast.setRef(c)} />
    </div>
  )
}

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
