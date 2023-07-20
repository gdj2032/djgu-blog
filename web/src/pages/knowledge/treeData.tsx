import { TREE_TYPE } from "./constants";

interface ITreeData {
  id: string;
  mode?: string;
  children?: ITreeData[];
}

export const TREE_DATA = (): ITreeData => {
  return {
    id: "前端知识",
    children: [
      {
        id: '前端基础',
        children: [
          {
            id: "HTML",
            mode: TREE_TYPE.html,
          },
          {
            id: "CSS",
            mode: TREE_TYPE.css,
            // children: [
            //   { id: "选择器", },
            //   { id: "布局", },
            //   { id: "交互", },
            //   { id: "动画", },
            //   { id: "BFC", },
            //   { id: "样式", },
            // ]
          },
          {
            id: "JavaScript",
            mode: TREE_TYPE.js,
            // children: [
            //   { id: "类型" },
            //   { id: "原型链" },
            //   { id: "作用域" },
            //   { id: "闭包" },
            //   { id: "异步" },
            //   { id: "正则表达式" },
            //   { id: "存储" },
            //   { id: "BOM" },
            //   { id: "DOM" },
            // ]
          },
        ]
      },
      {
        id: '计算机基础',
        children: [
          {
            id: '数据结构',
            // children: [
            //   { id: '堆(Heap)' },
            //   { id: '栈(Stack)' },
            //   { id: '队列(Queue)' },
            //   { id: '树(Tree)' },
            //   { id: '集合(Set)' },
            //   { id: '哈希表(Map)' },
            //   { id: '链表(linked list)' },
            //   { id: '字典树(trie)' },
            //   { id: '图(graph)' },
            // ],
          },
          {
            id: '算法',
            // children: [
            //   {
            //     id: '算法主题',
            //     children: [
            //       { id: '排序' },
            //       { id: '检索' },
            //       { id: '数学' },
            //       { id: '集合' },
            //       { id: '字符串' },
            //       { id: '图' },
            //       { id: '树' },
            //       { id: '链表' },
            //       { id: '数组' },
            //     ]
            //   },
            //   {
            //     id: '算法范式',
            //     children: [
            //       { id: 'BF算法' },
            //       { id: '贪心法' },
            //       { id: '分治法' },
            //       { id: '动态规划' },
            //       { id: '回溯法' },
            //     ]
            //   },
            // ]
          },
          {
            id: '设计模式',
            // children: [
            //   { id: "单例模式" },
            //   { id: "工厂模式" },
            //   { id: "观察者模式" },
            //   { id: "发布订阅模式" },
            // ]
          },
          {
            id: '架构模式',
            // children: [
            //   { id: 'MVC' },
            //   { id: 'MVP' },
            //   { id: 'MVVM' },
            // ]
          },
          {
            id: '编程方式',
            // children: [
            //   { id: "面向对象编程(OOP)" },
            //   { id: "函数式编程" },
            //   { id: "响应式编程" },
            // ]
          },
          {
            id: '网络',
            children: [
              {
                id: "ISO",
                // children: [
                //   { id: "7层模型" },
                // ]
              },
              {
                id: "浏览器",
                // children: [
                //   { id: "多进程" },
                //   { id: "浏览器内核" },
                //   { id: "事件循环" },
                //   { id: "网络安全" },
                // ]
              },
            ]
          }
        ]
      },
      {
        id: '后端',
        children: [
          { id: 'nodejs' },
          { id: 'nginx' },
          { id: 'docker' },
        ]
      },
      {
        id: "前端框架/库",
        children: [
          { id: "React" },
          { id: "Vue" },
        ]
      },
      {
        id: '前端领域',
        children: [
          {
            id: '移动端',
            children: [
              { id: 'H5' },
              {
                id: '移动App',
                children: [
                  { id: 'android' },
                  { id: 'ios' },
                  { id: 'React native' },
                  { id: 'flutter' },
                ]
              },
              {
                id: '小程序',
                children: [
                  { id: 'Taro' },
                  { id: 'uni-app' },
                  { id: 'weex' },
                ]
              },
            ]
          },
          {
            id: '可视化',
            children: [
              {
                id: 'SVG',
                children: [
                  { id: 'D3' }
                ]
              },
              {
                id: 'Canvas 2D',
                children: [
                  { id: 'echarts' },
                  { id: 'antv' },
                ]
              },
              {
                id: 'WebGL',
                children: [
                  { id: 'Three' }
                ]
              },
              { id: 'webGPU' },
            ]
          },
          {
            id: '微前端',
            children: [
              { id: 'qiankun' }
            ]
          },
          { id: 'electron' },
          {
            id: '实时通讯',
            children: [
              { id: 'Ajax轮询' },
              { id: 'websocket' },
            ]
          }
        ]
      },
      {
        id: '工程构建',
        children: [
          {
            id: "打包工具",
            children: [
              { id: "webpack" },
              { id: "vite" },
              { id: "rollup" },
            ],
          },
          {
            id: "语言增强",
            children: [
              { id: "less" },
              { id: "sass" },
              { id: "typescript" },
            ]
          },
          {
            id: "转换工具",
            children: [
              { id: "Postcss" },
              { id: "babel" },
            ]
          },
          {
            id: '模块化',
            // children: [
            //   { id: 'CSS Module' },
            //   { id: 'ES6 Module' },
            //   { id: 'CommonJS' },
            //   { id: 'CMD' },
            //   { id: 'AMD' },
            //   { id: 'UMD' },
            // ]
          },
          {
            id: 'mock数据',
            children: [
              { id: 'mock.js' },
            ]
          },
          { id: '性能优化' },
        ]
      },
    ]
  }
}
