/**
 * 用户列表
 */
import React from 'react';
import { usePagination } from '@djgu/react-comps';
import { userService } from '@/services';
import { Table } from 'antd';
import { USER_ROLE, DATE_FORMAT } from '@/constants';
import moment from 'moment'
import { UserService } from '@/typings/user';

interface IProps {
}

function UserList(props: IProps) {
  const { tableProps, paginationProps } = usePagination<UserService.IListData>(async ({ limit, offset }) => {
    const res = await userService.users({ limit, offset })
    return {
      dataSource: res.data.data,
      total: res.data.total
    }
  })

  const columns = [
    { key: 'id', dataIndex: 'id', title: 'ID' },
    { key: 'username', dataIndex: 'username', title: '用户名' },
    { key: 'role', dataIndex: 'role', title: '角色', render: t => USER_ROLE.toString(t) },
    { key: 'createTime', dataIndex: 'createTime', title: '创建时间', render: t => t ? moment(+t).format(DATE_FORMAT.YMD_Hms) : '-' },
  ]

  return (
    <div className='UserList'>
      <Table
        {...tableProps}
        pagination={paginationProps}
        columns={columns}
        rowKey={r => r.id}
      />
    </div>
  )
}

UserList.displayName = 'UserList';

export default UserList;
