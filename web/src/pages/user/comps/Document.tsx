/**
 * 文档类型
 */
import { USER_ROLE } from '@/constants';
import { documentService } from '@/services';
import { Button, message, Modal, Table } from 'antd';
import React from 'react';
import { usePagination } from '@djgu/react-comps';
import { DocumentService } from '@/typings/document';
import { useNavigate } from 'react-router';
import { PathConfig } from '@/framework/routes/routes';

function Document() {
  const navigate = useNavigate()
  const { tableProps, paginationProps, debounceRefresh } = usePagination<DocumentService.IListData>(async ({ limit, offset }) => {
    const res = await documentService.dList({ limit, offset })
    if (res?.code === 200) {
      return { dataSource: res.data.data, total: +res.data.total }
    }
    return { dataSource: [], total: 0 }
  })

  const handleDelete = (id) => {
    Modal.confirm({
      title: '是否删除文档?',
      icon: null,
      onOk: async () => {
        const res = await documentService.dDelete(id);
        if (res?.code === 200) {
          message.success('删除文档成功')
        }
        debounceRefresh()
      }
    })
  }

  const handleUpdate = (info?: DocumentService.IListData) => {
    navigate(`${PathConfig.documentCreate}${info ? `?id=${info.id}` : ''}`)
  }

  const columns = () => [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '操作', dataIndex: 'operation', key: 'operation', render: (_, record) => USER_ROLE.isAdminForSelf() && (
        <>
          <Button type="link" onClick={() => handleUpdate(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </>
      )
    },
  ]

  return (
    <>
      <Button type="link" onClick={() => handleUpdate()}>新增</Button>
      <Table
        columns={columns()}
        {...tableProps}
        pagination={paginationProps as any}
        rowKey={r => r.id}
      />
    </>
  )
}

Document.displayName = 'Document';

export default Document;
