import React, { useState, useEffect } from 'react';
import { useQuery } from '@djgu/react-comps';
import './index.scss';
import { DocumentService } from '@/typings/document';
import { documentService, fileService } from '@/services';
import { Card, Spin, Tag } from 'antd';
import { HistoryOutlined, EyeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { DATE_FORMAT } from '@/constants';
import { QuillEditor, TBreadcrumb } from '@/components';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';

function Detail() {
  const { id } = useQuery()
  const [data, setData] = useState<DocumentService.IListData>()
  const [content, setContent] = useState<string>('')
  const [spinning, setSpinning] = useState(false)
  const navigate = useNavigate()

  const routes = [
    { name: '返回', click: () => navigate(-1) },
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
        const res1 = await fileService.getFile(res.data.fileId)
        const fr = new FileReader()
        fr.addEventListener('loadend', (e: any) => {
          setContent(e.target.result)
        })
        fr.readAsText(res1)
        // setContent(res1)
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
          <span className="global-mgl-12">{data?.createTime ? dayjs(+data.createTime).format(DATE_FORMAT.YMD_Hms) : ''}</span>
        </Tag>
        <Tag color="volcano" className="global-mgl-12">
          <EyeOutlined />
          <span className="global-mgl-12">{data?.see}</span>
        </Tag>
        <Tag color="cyan" className="global-mgl-12">
          <AppstoreOutlined />
          <span className="global-mgl-12">{`${data?.route?.name}(${data?.route?.path})`}</span>
        </Tag>
      </div>
      <div className="global-mgt-8">
        <div className="global-description">{data.description}</div>
      </div>
      <div className="global-mgt-8">
        <QuillEditor
          value={content}
          syntax
          readOnly
        />
      </div>
    </>
  )

  return (
    <div className={`g-document-detail ${spinning && 'g-document-detail-spin'}`}>
      <TBreadcrumb route={routes} />
      <Card className="m-document-content">
        {
          data ?
            renderContent()
            : <Spin />
        }
      </Card>
    </div>
  )
}

Detail.displayName = 'Detail';

export default Detail;
