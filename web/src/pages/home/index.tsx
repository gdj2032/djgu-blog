/**
 * 文档列表
 */
import React, { useState } from 'react';
import './index.scss';
import { useNavigate } from 'react-router';
import { useVirtualList } from '@djgu/react-comps';
import { DocumentService } from '@/typings/document';
import { documentService } from '@/services';
import { Spin } from 'antd';
import { DocumentItem } from '@/components';
import { PathConfig } from '@/framework/routes/routes';

function Home() {
  const navigate = useNavigate()
  const {
    dataSource, loading
  } = useVirtualList<DocumentService.IListData>(async ({ limit, offset }) => {
    const res = await documentService.dList({
      limit,
      offset,
      latest: true,
    })
    if (res?.code === 200) {
      return { dataSource: res.data?.data || [], total: +res.data.total }
    }
    return { dataSource: [], total: 0 }
  }, [])

  return (
    <div className='g-home'>
      <div className="m-document-container" >
        <div className="p-doc-list">
          {
            dataSource.map((e) => (
              <DocumentItem key={e.id} data={e} onClick={d => navigate(`${PathConfig.documentDetail}?id=${d.id}`)} />
            ))
          }
        </div>
        {loading && <Spin rootClassName="p-loading" spinning={loading} />}
      </div>
    </div>
  )
}

Home.displayName = 'Home';

export default Home;
