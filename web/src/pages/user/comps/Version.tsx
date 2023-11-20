/**
 * 版本
 */
import { USER_ROLE, VERSION_TYPE } from '@/constants';
import { versionService } from '@/services';
import { Button, message, Modal, Table } from 'antd';
import React from 'react';
import UpdateVersionModal from './UpdateVersionModal';
import { usePagination, openModal2 } from '@djgu/react-comps';
import { VersionService } from '@/typings/version';

function Version() {
  const { tableProps, paginationProps, debounceRefresh } = usePagination<VersionService.IListData>(async ({ limit, offset }) => {
    const res = await versionService.versionList({ limit, offset })
    if (res?.code === 200) {
      return { dataSource: res.data.data, total: +res.data.total }
    }
    return { dataSource: [], total: 0 }
  })

  const handleDelete = (id) => {
    Modal.confirm({
      title: '是否删除版本?',
      icon: null,
      onOk: async () => {
        const res = await versionService.versionDelete(id);
        if (res?.code === 200) {
          message.success('删除成功')
        }
        debounceRefresh()
      }
    })
  }

  const handleUpdate = (info?: any) => {
    const { destroy } = openModal2(UpdateVersionModal, {
      data: info,
      afterClose: (isOk) => {
        console.log("🚀 ~ file: Version.tsx:47 ~ handleUpdate ~ isOk", isOk)
        destroy()
        debounceRefresh(isOk)
      }
    })
  }

  const handleSetCurrent = (id) => {
    Modal.confirm({
      title: '是否使用当前版本?',
      icon: null,
      onOk: async () => {
        const res = await versionService.setUsedVersion(id);
        if (res?.code === 200) {
          setTimeout(() => {
            window.location.reload()
          }, 2000);
        }
        debounceRefresh()
      }
    })
  }

  const columns = () => [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '版本类型', dataIndex: 'type', key: 'type', render: (t) => VERSION_TYPE.toString(t) },
    { title: '是否使用', dataIndex: 'used', key: 'used', render: (t) => t ? '是' : '否' },
    {
      title: '操作', dataIndex: 'operation', key: 'operation', render: (_, record) => USER_ROLE.isAdminForSelf() && (
        <>
          {
            !record.used && (
              <Button type="link" onClick={() => handleSetCurrent(record.id)}>更新</Button>
            )
          }
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

Version.displayName = 'Version';

export default Version;
