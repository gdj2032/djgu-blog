import React from 'react';
import { DocumentService } from '@/typings/document';
import { Tag } from 'antd';
import { HistoryOutlined, EyeOutlined, AppstoreOutlined } from '@ant-design/icons';
import moment from 'moment';
import { DATE_FORMAT } from '@/constants';
import './index.scss';

interface IProps {
  data: DocumentService.IListData;
  onClick: (d: DocumentService.IListData) => void;
}

function DocumentItem(props: IProps) {
  const { data, onClick } = props;
  return (
    <div className='g-document-item' onClick={() => onClick?.(data)}>
      <div className="global-h2">{data.name}</div>
      <div className="global-mgt-8">
        <Tag color="magenta">
          <HistoryOutlined />
          <span className="global-mgl-12">{data.createTime ? moment(+data.createTime).format(DATE_FORMAT.YMD_Hms) : ''}</span>
        </Tag>
        <Tag color="volcano" className="global-mgl-12">
          <EyeOutlined />
          <span className="global-mgl-12">{data.see}</span>
        </Tag>
        <Tag color="cyan" className="global-mgl-12">
          <AppstoreOutlined />
          <span className="global-mgl-12">{data.types.map((e) => e.name).join(' ')}</span>
        </Tag>
      </div>
      <div className="global-mgt-8">
        <div className="global-description">{data.description}</div>
      </div>
    </div>
  )
}

DocumentItem.displayName = 'DocumentItem';

export default DocumentItem;
