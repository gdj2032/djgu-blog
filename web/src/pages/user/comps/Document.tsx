/**
 * 文档类型
 */
import { USER_ROLE } from '@/constants';
import { documentTypeService } from '@/services';
import { Button, message, Modal, Table } from 'antd';
import React from 'react';
import UpdateDocTypeModal from './UpdateDocTypeModal';
import { useAppSelector, userAction } from '@/stores';
import { usePagination, openModal2 } from '@djgu/react-comps';
import { DocumentTypeService } from '@/typings/documentType';

function Document() {
  const user = useAppSelector(userAction.userInfo);
  const { tableProps, paginationProps, debounceRefresh } = usePagination<DocumentTypeService.IListData>(async ({ limit, offset }) => {
    const res = await documentTypeService.dtList({ limit, offset })
    if (res?.code === 200) {
      return { dataSource: res.data.data, total: +res.data.total }
    }
    return { dataSource: [], total: 0 }
  })

  const handleDelete = (id) => {
    Modal.confirm({
      title: '是否删除文档类型?',
      icon: null,
      onOk: async () => {
        // const res = await documentTypeService.deleteDocumentType(id);
        // if (res?.code === 200) {
        //   message.success('删除文档类型成功')
        // }
        // debounceRefresh()
      }
    })
  }

  const handleUpdate = (info?: any) => {
    const { destroy } = openModal2(UpdateDocTypeModal, {
      data: info,
      afterClose: (isOk) => {
        console.log("🚀 ~ file: DocumentType.tsx:47 ~ handleUpdate ~ isOk", isOk)
        destroy()
        debounceRefresh(isOk)
      }
    })
  }

  const columns = () => [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '创建人', dataIndex: 'user', key: 'user', render: t => t?.name },
    {
      title: '操作', dataIndex: 'operation', key: 'operation', render: (_, record) => USER_ROLE.isAdmin(user.role) && (
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
