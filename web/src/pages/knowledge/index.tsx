/**
 * 知识点
 */
// import { isElectron } from '@/constants';
// import { GithubOutlined } from '@ant-design/icons';
import G6 from '@antv/g6';
import React, { useEffect } from 'react';
// import { GITHUB_KNOWLEDGE_URL } from './constants';
import './index.scss';
import { TREE_DATA } from './treeData';

function Knowledge() {

  const init = () => {

    const data = TREE_DATA()
    const container = document.getElementById('knowledge-container');
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;
    const graph = new G6.TreeGraph({
      container: 'knowledge-container',
      width,
      height,
      modes: {
        default: [
          {
            type: 'collapse-expand',
            onChange: function onChange(item, collapsed) {
              const data = item.get('model');
              data.collapsed = collapsed;
              return true;
            },
          },
          'drag-canvas',
          'zoom-canvas',
        ],
      },
      defaultNode: {
        size: 26,
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
      },
      defaultEdge: {
        type: 'cubic-horizontal',
      },
      layout: {
        type: 'mindmap',
        direction: 'H',
        getHeight: () => {
          return 16;
        },
        getWidth: () => {
          return 16;
        },
        getVGap: () => {
          return 10;
        },
        getHGap: () => {
          return 50;
        },
      },
    });

    let centerX = 0;
    graph.node(function (node) {
      if (node.id === 'Modeling Methods') {
        centerX = node.x;
      }

      return {
        label: node.id,
        labelCfg: {
          position:
            node.children && node.children.length > 0
              ? 'left'
              : node.x > centerX
                ? 'right'
                : 'left',
          offset: 5,
        },
      };
    });

    graph.data(data);
    graph.render();
    graph.fitView();


    // // 单击节点
    // graph.on('node:click', (e) => {
    //   const nodeItem = e.item // 获取被点击的节点元素对象
    //   console.log('单击', nodeItem._cfg)
    //   const mode = nodeItem._cfg?.model?.mode
    //   if (mode) {
    //     // mode
    //   }
    // })

    if (typeof window !== 'undefined') {
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) return;
        graph.changeSize(container.scrollWidth, container.scrollHeight);
      };
    }
  }
  useEffect(() => {
    init()
  }, [])

  // const Comp: any = isElectron ? 'div' : 'a'

  // const handleGithub = () => {
  //   if (isElectron) {
  //     window.app.openUrl(GITHUB_KNOWLEDGE_URL)
  //   }
  // }

  return (
    <div id='knowledge-container'>

      {/* <Comp className='kc-github' href={GITHUB_KNOWLEDGE_URL} target='_blank' rel="noreferrer" onClick={handleGithub}>
        <GithubOutlined className='kc-github-icon' />
      </Comp> */}
    </div>
  )
}

Knowledge.displayName = 'Knowledge';

export default Knowledge;
