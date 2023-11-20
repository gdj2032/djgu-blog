/**
 * tab路由公共页面 不存在显示404
 */
import { DocumentItem } from '@/components';
import NotFound from '@/framework/404';
import { PathConfig } from '@/framework/routes/routes';
import { documentService } from '@/services';
import { routeAction, useAppSelector } from '@/stores';
import { DocumentService } from '@/typings/document';
import { useVirtualList } from '@djgu/react-comps';
import { Input, Spin } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './index.scss';

function Contents() {
  const { currentRoute } = useAppSelector(routeAction.routeInfo)

  const navigate = useNavigate()
  const [loadingMore, setLoadingMore] = useState(false)
  const [value, setValue] = useState('')

  const { dataSource, debounceRefresh, loading, paginationProps } = useVirtualList<DocumentService.IListData>(async ({ limit, offset }) => {
    if (!currentRoute) {
      return { dataSource: [], total: 0 }
    }
    const res = await documentService.dList({
      limit,
      offset,
      name: value,
      routeId: currentRoute.id,
    })
    setLoadingMore(false)
    if (res?.code === 200) {
      return { dataSource: res.data?.data || [], total: +res.data.total }
    }
    return { dataSource: [], total: 0 }
  }, [value, currentRoute])

  if (!currentRoute?.id) {
    return <NotFound />;
  }

  const handleScroll = (e) => {
    if (e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight) {
      console.info('--- 触底了 ---');
      if (dataSource.length < paginationProps.total) {
        debounceRefresh()
        setLoadingMore(true)
      }
    }
  }

  return (
    <div className='g-home' onScroll={handleScroll}>
      <div className="m-search">
        <Input.Search
          style={{ width: 800 }}
          placeholder="请输入搜索内容"
          value={value}
          onChange={v => {
            setValue(v.target.value)
          }}
        />
      </div>
      <div className="m-container" >
        <div className="p-list">
          {
            dataSource.map((e) => (
              <DocumentItem key={e.id} data={e} onClick={d => navigate(`${PathConfig.documentDetail}?id=${d.id}`)} />
            ))
          }
        </div>
        {
          dataSource.length > 0 && dataSource.length === +paginationProps.total && (
            <div className="p-scroll-bottom">已经到底了</div>
          )
        }
        {
          loading && loadingMore && (
            <Spin rootClassName="p-loading" spinning={loading} />
          )
        }
        {loading && <Spin rootClassName="p-loading" spinning={loading} />}
      </div>
    </div>
  )
}

Contents.displayName = 'Contents';

export default Contents;
