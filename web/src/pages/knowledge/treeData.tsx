interface ITreeData {
  id: string;
  children?: ITreeData[];
}

export const TREE_DATA = (): ITreeData => {
  return {
    id: "前端知识",
    children: [
      {
        id: '编程基础',
        children: [
          {
            id: "HTML",
            children: [
              { id: "DOM", },
              { id: "语义化", },
              { id: "状态码", },
              { id: "web安全", },
            ]
          },
          {
            id: "CSS",
            children: [
              { id: "选择器", },
              { id: "布局", },
              { id: "交互", },
              { id: "动画", },
            ]
          },
          {
            id: "JavaScript",
            children: [
              { id: "原型链" },
              { id: "作用域" },
              { id: "闭包" },
              { id: "异步" },
              { id: "正则表达式" },
            ]
          },
        ]
      },
      {
        id: '编程思想',
        children: [
          {
            id: '设计模式',
            children: [
              { id: "单例模式" },
              { id: "工厂模式" },
              { id: "观察者模式" },
              { id: "发布订阅模式" },
            ]
          },
          {
            id: '架构模式',
            children: [
              { id: 'MVC' },
              { id: 'MVP' },
              { id: 'MVVM' },
            ]
          },
          {
            id: '编程方式',
            children: [
              { id: "面向对象编程(OOP)" },
              { id: "函数式编程" },
              { id: "响应式编程" },
            ]
          }
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
        id: '计算机基础',
        children: [
          {
            id: '数据结构',
            children: [
              { id: '堆(Heap)' },
              { id: '栈(Stack)' },
              { id: '队列(Queue)' },
              { id: '树(Tree)' },
              { id: '集合(Set)' },
              { id: '哈希表(Map)' },
            ],
          },
          {
            id: '算法',
            children: [
              { id: '排序' },
              { id: '检索' },
              { id: 'Diff' },
            ]
          },
        ]
      },
      {
        id: "前端框架/库",
        children: [
          { id: "React" },
          { id: "Vue" },
          {
            id: "typescript",
            children: [
              { id: "interface" },
              { id: "泛型" },
            ]
          },
        ]
      },
      {
        id: "构建工具",
        children: [
          { id: "webpack" },
          { id: "vite" },
          { id: "rollup" },
        ]
      },
      {
        id: 'Node',
        children: [
          { id: 'Express' },
          { id: 'Koa' },
          { id: 'Egg' },
        ]
      },
      {
        id: '模块化',
        children: [
          { id: 'CSS Module' },
          { id: 'ES6 Module' },
          { id: 'CommonJS' },
          { id: 'CMD' },
          { id: 'AMD' },
        ]
      },
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
            ]
          },
          {
            id: '小程序',
            children: [
              { id: 'Taro' },
              { id: 'uni-app' },
            ]
          },
        ]
      },
      {
        id: '依赖',
        children: [
          { id: 'npm' },
          { id: 'yarn' },
          { id: 'nvm' },
        ]
      },
      {
        id: 'CI/CD',
        children: [
          { id: 'git web hook' },
          { id: 'jenkins' },
        ]
      },
    ]
  }
}
