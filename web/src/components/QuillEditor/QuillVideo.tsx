import Quill from "quill";

// 源码中是import直接倒入，这里要用Quill.import引入
const BlockEmbed = Quill.import('blots/block/embed')
const Link = Quill.import('formats/link')

const ATTRIBUTES = ['height', 'width']

class QuillVideo extends BlockEmbed {
  static create(value) {
    let node = super.create()
    //添加
    node.setAttribute('src', value.url)
    node.setAttribute('controls', value.controls)
    node.setAttribute('width', value.width)
    node.setAttribute('height', value.height)
    return node
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }
      return formats
    }, {})
  }

  static sanitize(url) {
    return Link.sanitize(url)
  }

  static value(domNode) {
    // 设置值包含宽高，为了达到自定义效果
    // 宽高为空的话，就是按100%算
    return {
      url: domNode.getAttribute('src'),
      controls: domNode.getAttribute('controls'),
      width: domNode.getAttribute('width'),
      height: domNode.getAttribute('height')
    }
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value)
      } else {
        this.domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }

  html() {
    const { video } = this.value()
    return `<a href="${video}">${video}</a>`
  }
}
QuillVideo.blotName = 'video'
// QuillVideo.className = 'ql-video' // 可添加样式，看主要需要
QuillVideo.tagName = 'video' // 用video标签替换iframe

export default QuillVideo
