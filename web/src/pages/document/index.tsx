/**
 * 文档列表
 */
import React, { useState } from 'react';
import './index.scss';
import { useNavigate } from 'react-router';
// import { useVirtualList } from '@djgu/react-comps';
import { DocumentService } from '@/typings/document';
import { documentService } from '@/services';
import { Input, Spin } from 'antd';
import { DocumentItem } from '@/components';
import { PathConfig } from '@/framework/routes/routes';
import useVirtualList from './test';

function Document() {
  const navigate = useNavigate()
  const [loadingMore, setLoadingMore] = useState(false)
  const [value, setValue] = useState('')
  console.log("🚀 ~ file: index.tsx:18 ~ Document ~ value:", value)
  const {
    dataSource, debounceRefresh, loading, paginationProps
  } = useVirtualList<DocumentService.IListData>(async ({ limit, offset }) => {
    console.info('--- value --->', value);
    const res = await documentService.dList({
      limit,
      offset,
      name: value,
    })
    setLoadingMore(false)
    if (res?.code === 200) {
      return { dataSource: res.data.data, total: +res.data.total }
    }
    return { dataSource: [], total: 0 }
  }, [value])

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
    <div className='g-document' onScroll={handleScroll}>
      <div className="m-doc-search">
        <Input.Search
          style={{ width: 300 }}
          placeholder="请输入搜索内容"
          value={value}
          onChange={v => {
            setValue(v.target.value)
          }}
        />
      </div>
      <div className="m-document-container" >
        <div className="p-doc-list">
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

Document.displayName = 'Document';

export default Document;
