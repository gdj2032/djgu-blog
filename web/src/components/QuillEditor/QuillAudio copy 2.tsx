import Quill from "quill";

const BlockEmbed = Quill.import('blots/block/embed');
class QuillAudio extends BlockEmbed {
  static create(value) {
    const node = super.create(value);
    node.setAttribute('src', value.url);
    node.setAttribute('controls', true);
    node.setAttribute('name', value.name);
    node.setAttribute('controlsList', 'nodownload');
    return node;
  }
  // 添加value获取当前的audio元素。拿到audio元素的属性。
  static value(domNode) {
    const value = {
      url: '',
      name: '',
    };
    // 这里要加判断。不然会显示undefined
    if (domNode.getAttribute('src')) {
      value.url = domNode.getAttribute('src');
      value.name = domNode.getAttribute('name');
    }
    return value;
  }
}
QuillAudio.blotName = 'audio';
QuillAudio.tagName = 'audio';
export default QuillAudio;
