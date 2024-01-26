/**
 * 标签树
 */
import { tagService } from '@/services';
import { routeAction, useAppSelector } from '@/stores';
import { TagService } from '@/typings/tag';
import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './index.scss';

interface IProps {
  onSelect?: (d: TagService.IListData) => void
}

function TagsTree(props: IProps) {
  const { onSelect } = props;
  const dispatch = useDispatch()
  const { currentRoute, currentSelectKeys } = useAppSelector(routeAction.routeInfo)
  const [tierTags, setTierTags] = useState<TagService.IListData[]>()

  useEffect(() => {
    init()
    return () => {
      dispatch(routeAction.setCurrentSelectKeys([]))
    }
  }, [currentRoute])

  const init = async () => {
    if (currentRoute) {
      const res = await tagService.dListTier({ routeId: currentRoute.id })
      setTierTags(res?.data)
    }
  }

  if (!tierTags) return;

  return (
    <div className='g-tags-tree'>
      <Tree
        treeData={tierTags as any}
        defaultExpandAll
        selectedKeys={currentSelectKeys}
        blockNode
        onSelect={(k: any, info: any) => {
          onSelect?.(info)
          dispatch(routeAction.setCurrentSelectKeys(k))
        }}
      />
    </div>
  )
}

TagsTree.displayName = 'TagsTree';

export default TagsTree;
