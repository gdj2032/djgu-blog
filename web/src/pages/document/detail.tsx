import React, { useState, useEffect } from 'react';
import { useQuery } from '@djgu/react-comps';
import './index.scss';
import { DocumentService } from '@/typings/document';
import { documentService } from '@/services';
import { Spin, Tag } from 'antd';
import { HistoryOutlined, EyeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { DATE_FORMAT } from '@/constants';
import moment from 'moment';
import { PathConfig } from '@/framework/routes/routes';
import { TBreadcrumb } from '@/components';
import Editor from 'for-editor'

function Detail() {
  const { id } = useQuery()
  const [data, setData] = useState<DocumentService.IListData>()
  const [spinning, setSpinning] = useState(false)

  const routes = [
    { name: '文档列表', url: PathConfig.document },
    { name: '详情' },
  ]

  const addSee = async () => {
    await documentService.dSee(id);
  }

  const init = async () => {
    setSpinning(true)
    try {
      await addSee()
      const res = await documentService.dDetail(id);
      if (res.code === 200) {
        setData(res.data)
      }
    } catch (error) {
      console.log("🚀 ~ file: detail.tsx:26 ~ init ~ error:", error)
    } finally {
      setSpinning(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  const renderContent = () => (
    <>
      <div className="global-h1">{data?.name}</div>
      <div className="global-mgt-8">
        <Tag color="magenta">
          <HistoryOutlined />
          <span className="global-mgl-12">{data?.createTime ? moment(+data.createTime).format(DATE_FORMAT.YMD_Hms) : ''}</span>
        </Tag>
        <Tag color="volcano" className="global-mgl-12">
          <EyeOutlined />
          <span className="global-mgl-12">{data?.see}</span>
        </Tag>
        <Tag color="cyan" className="global-mgl-12">
          <AppstoreOutlined />
          <span className="global-mgl-12">{data?.types.map((e) => e.name).join(' ')}</span>
        </Tag>
      </div>
      <div className="global-mgt-8">
        <div className="global-description">{data.description}</div>
      </div>
      <div className="global-mgt-8">
        <Editor
          value={data.content}
          preview
          disabled
          toolbar={{}}
          style={{
            border: 'none',
            boxShadow: 'none',
            background: '#fff',
          }}
        />
      </div>
    </>
  )

  return (
    <div className={`g-document-detail ${spinning && 'g-document-detail-spin'}`}>
      <TBreadcrumb route={routes} />
      <div className="m-document-content">
        {
          data ?
            renderContent()
            : <Spin />
        }
      </div>
    </div>
  )
}

Detail.displayName = 'Detail';

export default Detail;
