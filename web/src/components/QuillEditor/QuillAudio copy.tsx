import Quill from "quill";

const BlockEmbed = Quill.import('blots/block/embed');
const Link = Quill.import('formats/link')

const ATTRIBUTES = ['height', 'width']

class QuillAudio extends BlockEmbed {
  static create(value) {
    const node = super.create(value);
    console.log("🚀 ~ file: QuillAudio.tsx:7 ~ QuillAudio ~ create ~ value:", value)
    node.setAttribute('src', value.url);
    node.setAttribute('controls', true);
    node.setAttribute('name', value.name);
    node.setAttribute('controlsList', 'nodownload');
    node.setAttribute('width', value.width || 300)
    node.setAttribute('height', value.height || 50)
    return node;
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
      name: domNode.getAttribute('name'),
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
    const { audio } = this.value()
    return `<a href="${audio}">${audio}</a>`
  }
}
QuillAudio.blotName = 'audio';
QuillAudio.tagName = 'audio';
export default QuillAudio;
