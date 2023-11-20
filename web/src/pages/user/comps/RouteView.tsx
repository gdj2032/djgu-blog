/**
 * 文档类型
 */
import { USER_ROLE } from '@/constants';
import { routeService } from '@/services';
import { Button, message, Modal, Table } from 'antd';
import React from 'react';
import { openModal2, usePagination } from '@djgu/react-comps';
import { RouteService } from '@/typings/route';
import UpdateRouteModal from './UpdateRouteModal';
import { initRoutes } from '@/utils';

function RouteView() {
  const { tableProps, paginationProps, debounceRefresh } = usePagination<RouteService.IListData>(async ({ limit, offset }) => {
    const res = await routeService.dList({ limit, offset })
    if (res?.code === 200) {
      return { dataSource: res.data.data, total: +res.data.total }
    }
    return { dataSource: [], total: 0 }
  })

  const handleDelete = (id) => {
    Modal.confirm({
      title: '是否删除路由?',
      icon: null,
      onOk: async () => {
        const res = await routeService.dDelete(id);
        if (res?.code === 200) {
          message.success('删除路由成功')
        }
        debounceRefresh()
      }
    })
  }

  const handleUpdate = (info?: RouteService.IListData) => {
    const { destroy } = openModal2(UpdateRouteModal, {
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
    { title: '名称', dataIndex: 'name', key: 'name', render: (t, r) => t },
    { title: '路径', dataIndex: 'path', key: 'path' },
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

RouteView.displayName = 'RouteView';

export default RouteView;
