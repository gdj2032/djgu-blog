/**
 * 标签
 */
import { USER_ROLE } from '@/constants';
import { tagService } from '@/services';
import { Button, message, Modal, Table } from 'antd';
import React from 'react';
import { openModal2, usePagination } from '@djgu/react-comps';
import UpdateTagModal from './UpdateTagModal';
import { initRoutes } from '@/utils';
import { TagService } from '@/typings/tag';

function TagView() {
  const { tableProps, paginationProps, debounceRefresh } = usePagination<TagService.IListData>(async ({ limit, offset }) => {
    const res = await tagService.dList({ limit, offset })
    if (res?.code === 200) {
      return { dataSource: res.data.data, total: +res.data.total }
    }
    return { dataSource: [], total: 0 }
  })

  const handleDelete = (id) => {
    Modal.confirm({
      title: '是否删除标签?',
      icon: null,
      onOk: async () => {
        const res = await tagService.dDelete(id);
        if (res?.code === 200) {
          message.success('删除标签成功')
        }
        debounceRefresh()
      }
    })
  }

  const handleUpdate = (info?: TagService.IListData) => {
    const { destroy } = openModal2(UpdateTagModal, {
      data: info,
      afterClose: (isOk) => {
        destroy()
        debounceRefresh(isOk)
        if (isOk) {
          initRoutes()
        }
      }
    })
  }

  const columns = () => [
    { title: '标签名称', dataIndex: 'name', key: 'name', render: (t, r) => t },
    { title: '绑定路由', dataIndex: 'route', key: 'route', render: (t, r) => r.route?.name },
    { title: '父标签', dataIndex: 'parentTag', key: 'parentTag', render: (t, r) => r.parentTag?.name },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '操作', dataIndex: 'operation', key: 'operation', render: (_, record) => USER_ROLE.isAdminForSelf() && (
        <>
          <Button type="link" onClick={() => handleUpdate(record)} disabled={USER_ROLE.isAdmin(record.role)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)} disabled={USER_ROLE.isAdmin(record.role)}>删除</Button>
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

TagView.displayName = 'TagView';

export default TagView;
