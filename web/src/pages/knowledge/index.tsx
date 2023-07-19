/**
 * 知识点
 */
import G6 from '@antv/g6';
import React, { useEffect } from 'react';
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
  return (
    <div id='knowledge-container'></div>
  )
}

Knowledge.displayName = 'Knowledge';

export default Knowledge;
